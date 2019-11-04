const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    lastName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    service:{
        type: String,
        default: ''
    }
});

const model = mongoose.model('Tutor', schema);

module.exports = model;