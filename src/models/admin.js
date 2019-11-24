const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        validate: {
            validator: email => !Joi.string().email().validate(email).error,
            msg: 'Invalid email format'
        }
    }

});

const model = mongoose.model('Admin', schema);

module.exports = model;