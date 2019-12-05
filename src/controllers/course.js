const Course = require('../models/course');
const Student = require('../models/student');
const Tutor = require('../models/tutor');

async function addCourse(req, res) {
    const { courseName, code, coursePeriod, description, studentIDs, tutorIDs } = req.body;
    const course = new Course({
        courseName,
        code,
        coursePeriod,
        description
    });
    await course.save();
    // add existing student or tutor to the course
    if (studentIDs || tutorIDs) {
        const addedCourse = await Course.findById(code);
        if (studentIDs) {
            async function asyncEachStudentId(array) {
                for (let index = 0; index < array.length; index++) {
                    const element = array[index];
                    const student = await Student.findById({ _id: element });
                    await addedCourse.studentId.addToSet(student._id);
                    await addedCourse.save();
                    await student.courses.addToSet(addedCourse.code);
                    await student.save();
                };
            };
            addStudentIDs = async() => {
                await asyncEachStudentId(studentIDs);
            };
            await addStudentIDs();
        };
        if (tutorIDs) {
            async function asyncEachTutorId(array) {
                for (let index = 0; index < array.length; index++) {
                    const element = array[index];
                    const tutor = await Tutor.findById({ _id: element });
                    await addedCourse.tutorId.addToSet(tutor._id);
                    await addedCourse.save();
                    await tutor.courses.addToSet(addedCourse.code);
                    await tutor.save();
                };
            };
            addTutorIDs = async () => {
                await asyncEachTutorId(tutorIDs);
            };
            await addTutorIDs();

        };
        return res.json(addedCourse);
    } else {
        return res.json(course);
    }
}

async function getCourse(req, res) {
    const { id: code } = req.params;

    const course = await Course.findById(code);

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
    const { courseName, code, coursePeriod, description } = req.body;
    const newCourse = await Course.findByIdAndUpdate(id,
        { courseName, code, coursePeriod, description },
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

    // Delete course code from student or tutor once course deleted
    const students = await Student.find({ courses: id });
    students.forEach(student => {
        student.courses.pull(id);
        student.save();
    });

    const tutors = await Tutor.find({ courses: id });
    tutors.forEach(tutor => {
        tutor.courses.pull(id);
        tutor.save();
    });

    return res.sendStatus(200);
}

module.exports = {
    addCourse,
    getAllCourse,
    getCourse,
    updateCourse,
    deleteCourse
}