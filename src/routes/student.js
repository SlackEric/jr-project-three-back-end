const express = require('express');
const {
    addStudent,
    getAllStudent,
    getStudentsByName,
    updateStudent,
    deleteStudent,
    addCourse,
    deleteCourse
  } = require('../controllers/student');

const router = express.Router();

router.get('/', getAllStudent);
router.get('/:name', getStudentsByName);
router.post('/', addStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);
router.post('/:id/courses/:code', addCourse); 
router.delete('/:id/courses/:code', deleteCourse);

module.exports = router;