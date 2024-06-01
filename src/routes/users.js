const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Assuming you have a User model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email});
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
        email,
        password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: 'User created successfully' });
    })

module.exports = router;

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email});

    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });  
    }

    const token = jwt.sign(
        { userId: user._id, email: user.email },
        'your_jwt_secret',
        { expiresIn: '1h' }
    );

    res.status(200).json({ token });

} catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
}
})

module.exports = router;
