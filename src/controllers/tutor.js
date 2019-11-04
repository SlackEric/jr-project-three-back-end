const Tutor = require('../models/tutor');

async function addTutor(req,res) {
    const { firstName, lastName, email, service } = req.body;
    const tutor = new Tutor({
        firstName,
        lastName,
        email,
        password,
        service
    });

    await tutor.save();
    return res.json(tutor);
}

async function getAllTutor(req,res) {
    const tutors = await Tutor.find();
    return res.json(tutors);
}

async function getTutor(req,res) {
    const { id } = req.params;
  
    const tutor = await Tutor.findById(id);
    
    //error message not showing correctly if id is missing one digit
    if (!tutor) {
      return res.status(404).json('Tutor not found');
    }
    return res.json(tutor);
}

async function updateTutor(req,res) {
    const { id } = req.params;
    const { firstName, lastName, email, service } = req.body;
    const newTutor = await Tutor.findByIdAndUpdate(id,
        { firstName, lastName, email, password,service },
        { new: true }
    );

    if (!newTutor) {
        return res.status(404).json('Tutor not found');
    }

    return res.json(newTutor);
}

async function deleteTutor(req,res) {
    const { id } = req.params;
    const tutor = await Tutor.findByIdAndDelete(id);
    if (!tutor) {
      return res.status(404).json('Tutor not found');
    }
    return res.sendStatus(200);
}

module.exports = {
    addTutor,
    getAllTutor,
    getTutor,
    updateTutor,
    deleteTutor
}