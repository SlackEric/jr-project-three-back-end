const User = require('../models/user');
const Student = require('../models/student');
const Course = require('../models/course');
const generator = require('generate-password');

// back-end functions to manage students from database
async function addStudent(req, res) {
  let { firstName, lastName, email, password, dateOfBirth, gender, mobile, note, courses } = req.body;
  const student = new Student({
    firstName,
    lastName,
    email,
    dateOfBirth,
    gender,
    mobile,
    note,
  });

  await student.save();

  if (!password) {
    password = generator.generate({
      length: 10,
      numbers: true
    });
  }

  const role = 'student';
  const user = new User({
    email,
    password,
    role
  });
console.log(user);
  await user.hashPassword();
  await user.save();

  // add course code to new student
  if (courses) {
    const addedStudent = await Student.findOne({ email })

    async function asyncEachCourseCode(array) {
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        const course = await Course.findById({ _id: element });
        await addedStudent.courses.addToSet(course._id);
        await addedStudent.save();
        await course.studentId.addToSet(addedStudent._id);
        await course.save();
      };
    };
    addCourseCodes = async () => {
      await asyncEachCourseCode(courses);
    };
    await addCourseCodes();

    return res.json(addedStudent);
  }

  return res.json(student);
}

async function getStudentsByName(req, res) {
  const { name } = req.params;

  const regex = /^([A-Za-z]+)(\s+([A-Za-z]+))*$/;
  const match = regex.exec(name);

  const paramFirstWord = match[1];
  const paramSecondWord = match[3];

  let students = [];

  if (typeof paramSecondWord !== "undefined") {
    /*
      When there are two words, it means it provides both first name and last name.
    */
    students = await Student.find({ firstName: paramFirstWord, lastName: paramSecondWord });
  } else {
    /*
      When there is only one word provided, that could be either the first name or last name,
      so we need to search it as a first name and as a last name.
    */
    students = await Student.find({ $or: [{ firstName: paramFirstWord }, { lastName: paramFirstWord }] });
  }

  return res.json(students);
}

async function getAllStudent(req, res) {
  const students = await Student.find();
  return res.json(students);
}

// Not sure if the password information should be update here
async function updateStudent(req, res) {
  const { id } = req.params;
  const { firstName, lastName, email, dateOfBirth, gender, mobile, note } = req.body;
  const newStudent = await Student.findByIdAndUpdate(id,
    { firstName, lastName, dateOfBirth, gender, mobile, note },
    { new: true }
  );

  if (!newStudent) {
    return res.status(404).json('Student not found');
  }

  const { password } = req.body;
  if (password) {
    const newUser = await User.findOneAndUpdate({ email }, { password }, { new: true })
    await newUser.hashPassword();
    await newUser.save()
  }

  return res.json(newStudent);
}

async function deleteStudent(req, res) {
  const { id } = req.params;
  const student = await Student.findByIdAndDelete(id);
  if (!student) {
    return res.status(404).json('student not found');
  }

  const email = student.email;

  const user = await User.findOneAndDelete({ email });
  if (!user) {
    return res.status(404).json('student not found');
  }

  const courses = await Course.find({ studentId: id });
  if (courses) {
    courses.forEach(course => {
      course.studentId.pull(id);
      course.save();
    });
  }
  return res.sendStatus(200);
}

// Create many to many relation between student and course
async function addCourse(req, res) {
  const { id, code } = req.params;
  const student = await Student.findById(id);
  const course = await Course.findById(code);

  if (!student || !course) {
    return res.status(404).json('student or course not found')
  }

  student.courses.addToSet(course._id);
  course.studentId.addToSet(student._id);

  await student.save();
  await course.save();
  return res.json(student);
}

async function deleteCourse(req, res) {
  const { id, code } = req.params;

  const student = await Student.findById(id);
  const course = await Course.findById(code);

  if (!student || !course) {
    return res.status(404).json('student or course not found')
  }

  student.courses.pull(course._id);
  course.studentId.pull(student._id);
  await student.save();
  await course.save();
  return res.json(student);
}


module.exports = {
  addStudent,
  getAllStudent,
  getStudentsByName,
  updateStudent,
  deleteStudent,
  addCourse,
  deleteCourse
}