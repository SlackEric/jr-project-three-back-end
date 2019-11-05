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
        validate: {
            validator: email => !Joi.string().email().validate(email).error,
            msg: 'Invalid email format'
        }
    },
    password: {
        type: String,
        required: true
    },
    course: [{
        type: String,
        ref: 'Course'
    }]
});

const model = mongoose.model('Stduent', schema);

module.exports = model;