const User = require("../models/user");
const Tutor = require("../models/tutor");
const Course = require("../models/course");
const generator = require('generate-password');

async function addTutor(req, res) {
  const {
    firstName,
    lastName,
    email,
    password,
    dateOfBirth,
    gender,
    mobile,
    note,
    courses
  } = req.body;
  const tutor = new Tutor({
    firstName,
    lastName,
    email,
    dateOfBirth,
    gender,
    mobile,
    note
  });

  await tutor.save();

  if (!password) {
    password = generator.generate({
      length: 10,
      numbers: true
    });
  }

  const role = "tutor";
  const user = new User({
    email,
    password,
    role
  });
  await user.hashPassword();
  await user.save();

  if (courses) {
    // add course code to new tutor
    const addedTutor = await Tutor.findOne({ email });
    async function asyncEachCourseCode(array) {
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        const course = await Course.findById({ _id: element });
        await addedTutor.courses.addToSet(course._id);
        await addedTutor.save();
        await course.tutorId.addToSet(addedTutor._id);
        await course.save();
      }
    }
    addCourseCodes = async () => {
      await asyncEachCourseCode(courses);
    };
    await addCourseCodes();

    return res.json(addedTutor);
  }

  return res.json(tutor);
}

async function getAllTutor(req, res) {
  const tutors = await Tutor.find().populate("courses", "courseName");
  return res.json(tutors);
}

async function getTutorsByName(req, res) {
  const { name } = req.params;

  const regex = /^([A-Za-z]+)(\s+([A-Za-z]+))*$/;
  const match = regex.exec(name);
  const paramFirstWord = match[1];
  const paramSecondWord = match[3];

  let tutors = [];

  if (typeof paramSecondWord !== "undefined") {
    /*
      When there are two words, it means it provides both first name and last name.
    */
    tutors = await Tutor.find({firstName: paramFirstWord, lastName: paramSecondWord});
  } else {
    /*
      When there is only one word provided, that could be either the first name or last name,
      so we need to search it as a first name and as a last name.
    */
    tutors = await Tutor.find({$or:[{firstName: paramFirstWord}, {lastName: paramFirstWord}]});
  }

  return res.json(tutors);
}

async function updateTutor(req, res) {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    email,
    dateOfBirth,
    gender,
    mobile,
    note
  } = req.body;
  const newTutor = await Tutor.findByIdAndUpdate(
    id,
    { firstName, lastName, dateOfBirth, gender, mobile, note },
    { new: true }
  );

  if (!newTutor) {
    return res.status(404).json("Tutor not found");
  }

  // Check if password is included in the body
  const { password } = req.body;
  if (password) {
    const newUser = await User.findOneAndUpdate(
      { email },
      { password },
      { new: true }
    );
    await newUser.hashPassword();
    await newUser.save();
  }

  return res.json(newTutor);
}

async function deleteTutor(req, res) {
  const { id } = req.params;
  const tutor = await Tutor.findByIdAndDelete(id);
  if (!tutor) {
    return res.status(404).json("Tutor not found");
  }

  const email = tutor.email;
  const user = await User.findOneAndDelete({ email });
  if (!user) {
    return res.status(404).json("Tutor not found");
  }

  const courses = await Course.find({ tutorId: id });
  if (courses) {
    courses.forEach(course => {
      course.tutorId.pull(id);
      course.save();
    });
  }
  return res.sendStatus(200);
}

async function addCourse(req, res) {
  const { id, code } = req.params;
  const tutor = await Tutor.findById(id);
  const course = await Course.findById(code);

  if (!tutor || !course) {
    return res.status(404).json("tutor or course not found");
  }

  tutor.courses.addToSet(course._id);
  course.tutorId.addToSet(tutor._id);

  await tutor.save();
  await course.save();
  return res.json(tutor);
}

async function deleteCourse(req, res) {
  const { id, code } = req.params;

  const tutor = await Tutor.findById(id);
  const course = await Course.findById(code);

  if (!tutor || !course) {
    return res.status(404).json("tutor or course not found");
  }

  tutor.courses.pull(course._id);
  course.tutorId.pull(tutor._id);
  await tutor.save();
  await course.save();
  return res.json(tutor);
}

module.exports = {
  addTutor,
  getAllTutor,
  getTutorsByName,
  updateTutor,
  deleteTutor,
  addCourse,
  deleteCourse
};
