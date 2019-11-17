const express = require('express');
const {
    addStudent,
    getAllStudent,
    getStudent,
    updateStudent,
    deleteStudent,
    addCourse,
    deleteCourse
  } = require('../controllers/student');

const router = express.Router();

router.get('/', getAllStudent);
router.get('/:id', getStudent);
router.post('/', addStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);
router.post('/:id/courses/:code', addCourse); 
router.delete('/:id/courses/:code', deleteCourse);

module.exports = router;