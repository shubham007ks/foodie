const express = require('express')
const router = express.Router()
const User = require('../models/users')
const { body, validationResult } = require('express-validator');
const jwt = requre("jsonwebtoken");
const bcrypt = require("bcrypt.js");
const jwtSecret = "MynameisEndtoEndYouTubeChannel1$#"

router.post("/createuser", [
    body('email').isEmail(),
    body('name').isLength({ min: 5 }),
    body('password', 'Incorrect Password').isLength({ min: 5 })]
    , async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const salt = await bcrypt.genSalt(10);
        let secPassword = await bcrypt.hash(req.body.password, salt)

        try {
            await User.create({
                name: req.body.name,
                password: req.body.password,
                email: req.body.email,
                location: req.body.location
            })
                .then(res.json({ success: true }));
        } catch (error) {
            console.log(error)
            res.json({ success: false });
        }
    })


router.post("/loginuser",
    async (req, res) => {

        try {
            let userData = await User.findOne({ email });
            if (!userData) {
                return res.status(400).json({ errors: "Try logging with correct credentials" });
            }

            const pwdCompare = await bcrypt.compare(req.body.password, userData.password)

            if (!pwdCompare) {
                return res.status(400).json({ errors: "Try logging with correct credentials" })
            }
            const data = {
                user: {
                    id: userData.id
                }
            }

            const authToken = jwt.sign(data, jwtSecret)
            return res.json({ success: true, authToken: authToken })
        }

        catch (error) {
            console.log(error)
            res.json({ success: false });
        }
    })

module.exports = router;