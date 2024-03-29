const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../utils/authUtils');

// User Registration
router.post('/register', async (req, res) => {
    // Validate user data
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({ "success": false, "message": error.details[0].message });
    
    try {
        // Check if the email is already registered
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) return res.status(400).json({ "success": false, "message": 'Email already exists' });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        const savedUser = await user.save();
        res.json({ "success": true, "data": savedUser._id });
    } catch (err) {
        res.status(400).json({ "success": false, "message": err.message });
    }
});

// User Login
router.post('/login', async (req, res) => {
    // Validate user data
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ "success": false, "message": error.details[0].message });

    try {
        // Check if the email exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({ "success": false, "message": 'Email not found' });

        // Check password
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(400).json({ "success": false, "message": 'Invalid password' });

        // Create and assign a token
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        res.header('auth-token', token).json({ "success": true, "token": token });
    } catch (err) {
        res.status(400).json({ "success": false, "message": err.message });
    }
});

module.exports = router;
