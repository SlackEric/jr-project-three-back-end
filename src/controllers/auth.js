const User = require('../models/user');
const { generateToken } = require('../utils/jwt');

async function loginUser (req, res) {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email }).exec();

    if (!existingUser) {
        return res.status(401).json('Invalid email or password');
    }

    const validPassword = await existingUser.validatePassword(password);

    if (!validPassword) {
        return res.status(401).json('Invalid email or password');
    }

    const token = generateToken(existingUser._id);
    return res.json({ email, token });
}

module.exports = {
    loginUser,
};