const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');

const schema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: email => !Joi.string().email().validate(email).error,
            msg: 'Invalid email format'
        }
    },
    password: {
        type: String,
        require: true
    },
    role:{
        type: String,
        required: true
    }
});

schema.methods.hashPassword = async function() {
    this.password = await bcrypt.hash(this.password, 10);
};
  
schema.methods.validatePassword = async function(password) {
    const validPassword = await bcrypt.compare(password, this.password);
    return validPassword;
};

const model = mongoose.model('User', schema);

module.exports = model;