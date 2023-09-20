const express = require('express')
const bcrypt = require('bcrypt');
const UserModel = require('../Models/Usermodel');
var jwt = require('jsonwebtoken');
require('dotenv').config();

const userRouter = express.Router();

userRouter.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const hash = await bcrypt.hash(password, 8);

        const newUser = new UserModel({
            firstName,
            lastName,
            email,
            password: hash,
        });

        await newUser.save();
        res.json({ "msg": "Signup successful!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "msg": "Internal server error" });
    }
});

userRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ "msg": "User not found. Please sign up!" });
        }

        const hash = user.password;
        const correct_password = await bcrypt.compare(password, hash);

        if (correct_password) {
            var token = jwt.sign({ userID: user._id }, process.env.JWT);
            return res.json({ "msg": "Login successful!", "token": token });
        } else {
            return res.status(401).json({ "msg": "Invalid password" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "msg": "Internal server error" });
    }
});


module.exports = userRouter;