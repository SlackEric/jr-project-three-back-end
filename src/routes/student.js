const express = require('express');
const {
    addStudent,
    getAllStudent,
    getStudent,
    updateStudent,
    deleteStudent
  } = require('../controllers/student');

const router = express.Router();

router.get('/', getAllStudent);
router.get('/:id', getStudent);
router.post('/', addStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;