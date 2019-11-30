const User = require('../models/user');
const Student = require('../models/student');
const Course = require('../models/course');

// back-end functions to manage students from database
async function addStudent(req, res) {
    const { firstName, lastName, email, password } = req.body;
    const student = new Student({
        firstName,
        lastName,
        email
    });

    await student.save();

    const role = 'student';
    const user = new User({
        email,
        password,
        role
    });
   
    await user.hashPassword();
    await user.save();

    return res.json(student);
}

async function getStudent(req, res) {
    const { id } = req.params;
  
    const student = await Student.findById(id).populate('courses', 'courseName');
    
    //error message not showing correctly if id is missing one digit
    if (!student) {
      return res.status(404).json('Student not found');
    }
    return res.json(student);
  }

async function getAllStudent(req, res) {
    const students = await Student.find();
    return res.json(students);
}

// Not sure if the password information should be update here
async function updateStudent(req, res) {
  const { id } = req.params;
  const { firstName, lastName } = req.body;
  const newStudent = await Student.findByIdAndUpdate(id,
      { firstName, lastName },
      { new: true }
  );

  if (!newStudent) {
      return res.status(404).json('Student not found');
  }

  const { password } = req.body;
  
  const newUser = await User.findOneAndUpdate(email, { password }, { new: true })

  await newUser.hashPassword();
  await newUser.save()

  return res.json(newStudent);
}

async function deleteStudent(req, res) {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json('student not found');
    }

    const email = student.email;
    const user = await User.findOneAndDelete(email);
    if (!user) {
      return res.status(404).json('student not found');
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
  const {id, code} = req.params;

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
    getStudent,
    updateStudent,
    deleteStudent,
    addCourse,
    deleteCourse
}