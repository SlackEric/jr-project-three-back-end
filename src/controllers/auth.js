const Admin = require('../models/admin');
const { generateToken } = require('../utils/jwt');

function adminLogin (req, res) {
    const { userName, password } = req.body;

    const admin = Admin.findOne({ userName }).exec();
    if (!admin) {
        return res.status(401).json('Invalid username or password');
    }

    const validPassword = admin.validPassword(password);
    if (!admin) {
        return res.status(401).json('Invalid username or password');
    }

    const token = generateToken(admin._id);
    return res.json({ userName, token });
}

module.exports = {
    adminLogin
};