const express = require('express');

const {
    addTutor,
    getAllTutor,
    getTutor,
    updateTutor,
    deleteTutor
} = require('../controllers/tutor');

const router = express.Router();

router.get('/', getAllTutor);
router.get('/:id', getTutor);
router.post('/', addTutor);
router.put('/:id', updateTutor);
router.delete('/:id', deleteTutor);

module.exports = router;