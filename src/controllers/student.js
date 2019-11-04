const Student = require('../models/student');

// back-end functions to manage students from database
async function addStudent(req, res) {
    const { firstName, lastName, email } = req.body;
    const student = new Student({
        firstName,
        lastName,
        email,
        password
    });

    await student.save();
    return res.json(student);
}

async function getStudent(req, res) {
    const { id } = req.params;
  
    const student = await Student.findById(id);
    
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
    const { firstName, lastName, email } = req.body;
    const newStudent = await Student.findByIdAndUpdate(id,
        { firstName, lastName, email, password },
        { new: true }
    );

    if (!newStudent) {
        return res.status(404).json('Student not found');
    }

    return res.json(newStudent);
}

async function deleteStudent(req, res) {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json('student not found');
    }
    return res.sendStatus(200);
  }


module.exports = {
    addStudent,
    getAllStudent,
    getStudent,
    updateStudent,
    deleteStudent
}