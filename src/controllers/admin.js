const User = require('../models/user');
const Admin = require('../models/admin');

async function addAdmin(req, res) {
    const {email, password} = req.body;

    const admin = new Admin({
        email
    });

    await admin.save();

    const role = 'admin';
    const user = new User({
        email,
        password,
        role
    });
    await user.hashPassword();
    await user.save();

    return res.json(user);  
}

module.exports = {
    addAdmin
}