const express = require('express');

const {
    addTutor,
    getAllTutor,
    getTutorsByName,
    updateTutor,
    deleteTutor,
    addCourse,
    deleteCourse
} = require('../controllers/tutor');

const router = express.Router();

router.get('/', getAllTutor);
router.get('/:name', getTutorsByName);
router.post('/', addTutor);
router.put('/:id', updateTutor);
router.delete('/:id', deleteTutor);
router.post('/:id/courses/:code', addCourse);
router.delete('/:id/courses/:code', deleteCourse);

module.exports = router;