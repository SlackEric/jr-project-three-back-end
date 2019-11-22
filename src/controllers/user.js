const User = require('../models/user');
const { generateToken } = require('../utils/jwt');

async function addUser(req, res) {
    const {username, password, role} = req.body;

    const existingUser = await User.findOne({username}).exec();
    if(existingUser) {
        return res.status(400).json('user already exist');
    }

    const user = new User({
        username,
        password,
        role
    });
    await user.hashPassword();
    await user.save();
    return res.json(user);
}

module.exports = {
    addUser
}