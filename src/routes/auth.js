const express = require('express');
const { adminLogin } = require('../controllers/auth');
const router = express.Router();

router.post('/', adminLogin);

module.exports = router;