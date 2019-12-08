const User = require('../models/user');
const Tutor = require('../models/tutor');
const Course = require('../models/course');

async function addTutor(req, res) {
    const { firstName, lastName, email, password, dateOfBirth, gender, mobile, note, code } = req.body;
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

    const role = 'tutor';
    const user = new User({
        email,
        password,
        role
    });
    await user.hashPassword();
    await user.save();

    if (code) {
        // add course code to new tutor
        const addedTutor = await Tutor.findOne({ email })
        const course = await Course.findById(code);

        addedTutor.courses.addToSet(course._id);
        course.tutorId.addToSet(addedTutor._id);

        await addedTutor.save();
        await course.save();

        return res.json(addedTutor);
    }

    return res.json(tutor);
}

async function getAllTutor(req, res) {
    const tutors = await Tutor.find().populate('courses', 'courseName');
    return res.json(tutors);
}

async function getTutor(req, res) {
    const { id } = req.params;

    const tutor = await Tutor.findById(id);

    //error message not showing correctly if id is missing one digit
    if (!tutor) {
        return res.status(404).json('Tutor not found');
    }
    return res.json(tutor);
}

async function updateTutor(req, res) {
    const { id } = req.params;
    const { firstName, lastName, email, dateOfBirth, gender, mobile, note } = req.body;
    const newTutor = await Tutor.findByIdAndUpdate(id,
        { firstName, lastName, dateOfBirth, gender, mobile, note },
        { new: true }
    );

    if (!newTutor) {
        return res.status(404).json('Tutor not found');
    }

    // Check if password is included in the body
    const { password } = req.body;
    if (password) {
    const newUser = await User.findOneAndUpdate({ email }, { password }, { new: true })
    await newUser.hashPassword();
    await newUser.save();
    };

    return res.json(newTutor);
}

async function deleteTutor(req, res) {
    const { id } = req.params;
    const tutor = await Tutor.findByIdAndDelete(id);
    if (!tutor) {
        return res.status(404).json('Tutor not found');
    }

    const email = tutor.email;
    const user = await User.findOneAndDelete({ email });
    if (!user) {
        return res.status(404).json('Tutor not found');
    }

    const course = await Course.findOne({ tutorId: id });
    course.tutorId.pull(tutor._id);
    await course.save();

    return res.sendStatus(200);
}

async function addCourse(req, res) {
    const { id, code } = req.params;
    const tutor = await Tutor.findById(id);
    const course = await Course.findById(code);

    if (!tutor || !course) {
        return res.status(404).json('tutor or course not found')
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
        return res.status(404).json('tutor or course not found')
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
    getTutor,
    updateTutor,
    deleteTutor,
    addCourse,
    deleteCourse
}