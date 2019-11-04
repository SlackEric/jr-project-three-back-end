const Course = require('../models/course');

async function addCourse(req, res) {
    const { courseName, fee, description } = req.body;
    const course = new Course({
        courseName,
        fee,
        description
    });

    await course.save();
    return res.json(course);
}

async function getCourse(req, res) {
    const { id } = req.params;
  
    const course = await Course.findById(id);
    
    //error message not showing correctly if id is missing one digit
    if (!course) {
      return res.status(404).json('Course not found');
    }
    return res.json(course);
}

async function getAllCourse(req, res) {
    const courses = await Course.find();
    return res.json(courses);
}

async function updateCourse(req, res) {
    const { id } = req.params;
    const { courseName, fee, description } = req.body;
    const newCourse = await Course.findByIdAndUpdate(id,
        { courseName, fee, description },
        { new: true }
    );

    if (!newCourse) {
        return res.status(404).json('Course not found');
    }

    return res.json(newCourse);
}

async function deleteCourse(req, res) {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json('Course not found');
    }
    return res.sendStatus(200);
}

module.exports = {
    addCourse,
    getAllCourse,
    getCourse,
    updateCourse,
    deleteCourse
}