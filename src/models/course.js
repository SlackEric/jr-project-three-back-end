const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
    },
    fee: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        default: ''
    },
});

const model = mongoose.model('Course', schema);

module.exports = model;