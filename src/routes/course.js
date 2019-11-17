const express = require('express');

const{
    addCourse,
    getAllCourse,
    getCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/course')

const router = express.Router();

router.get('/', getAllCourse);
router.get('/:id', getCourse);
router.post('/', addCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

module.exports = router;