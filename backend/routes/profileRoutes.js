const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/authUtils');
const User = require('../models/User');
const { updateProfileValidation, updatePasswordValidation } = require('../utils/authUtils');
const bcrypt = require('bcrypt');

const multer = require('multer');

// Set up Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Get user profile
router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({ "success": true, "data": user });
    } catch (err) {
        res.status(400).json({"success": false, "message": err.message});
    }
});

// Update user profile
router.put('/', verifyToken, async (req, res) => {
    // Validate profile update data
    const { error } = updateProfileValidation(req.body);
    if (error) return res.status(400).json({ "success": false, "message": error.details[0].message });

    try {
        const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, { new: true }).select('-password');
        res.json({ "success": true, "data": updatedUser });
    } catch (err) {
        res.status(400).json({"success": false, "message": err.message});
    }
});

// Upload user avatar
router.post('/avatar', verifyToken, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ "success": false, "message": 'No file uploaded'});
        }

        // Save avatar path to user document
        const user = await User.findById(req.user._id);
        user.avatar = req.file.path;
        await user.save();
        res.json({ "success": true, "message": "Avatar uploaded successfully" });
    } catch (err) {
        res.status(400).json({ "success": false, "message": err.message });
    }
});

// Update user password
router.put('/password', verifyToken, async (req, res) => {
    // Validate password update data
    const { error } = updatePasswordValidation(req.body);
    if (error) return res.status(400).json({ "success": false, "message": error.details[0].message });

    try {
        // Check if the current password matches
        const user = await User.findById(req.user._id);
        const validPass = await bcrypt.compare(req.body.currentPassword, user.password);
        if (!validPass) return res.status(400).json({ "success": false, "message": 'Invalid current password' });

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

        // Update the password
        user.password = hashedPassword;
        await user.save();
        res.json({ "success": true, "message": "Password updated successfully" });
    } catch (err) {
        res.status(400).json({ "success": false, "message": err.message });
    }
});

module.exports = router;
