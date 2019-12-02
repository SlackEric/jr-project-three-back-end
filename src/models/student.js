const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: email => !Joi.string().email().validate(email).error,
            msg: 'Invalid email format'
        }
    },
    dateOfBirth: {
        type: Date,
        default: ''
    },
    // This one might need to be changed to option
    gender: {
        type: String,
        default: ''
    },
    mobile: {
        type: String,
        default: '',
    },
    note: {
        type: String,
        default: ''
    },
    courses: [{
        type: String,
        ref: 'Course'
    }]
});

const model = mongoose.model('Student', schema);

module.exports = model;