const express = require('express');

const {
    addAdmin
} = require('../controllers/admin')

const router = express.Router();

router.post('/', addAdmin);

module.exports = router;