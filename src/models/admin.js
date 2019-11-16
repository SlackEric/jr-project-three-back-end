const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userName:{
        type: String,
        required: true,
    },
    password: {
        type: String,
        require: true
    }
});

const model = mongoose.model('User', schema);

module.exports = model;