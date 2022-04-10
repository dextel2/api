const express = require("express");
const { check, validationResult } = require("express-validator");
const gravtar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../../models/User");
const router = express.Router();

/**
 * @access Public
 * @route GET api/users
 * @description Register User
 */
router.post("/", [
	check('name', "Name is required").not().isEmpty(),
	check('email', "Please include a valid email").isEmail(),
	check("password", "Please enter a valid password with 6 or more length").isLength({ min: 6 })
], async (req, res) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	const { name, email, password } = req.body;

	try {
		// Check if the user exists
		let user = await User.findOne({ email });
		if (user) {
			return res
				.status(400)
				.json({ errors: [{ msg: "User already exists" }] });
		}

		// grab users gravtar
		const avatar = gravtar.url(email, { s: "200", r: "pg", d: "mm" });
		user = new User({ name, email, avatar, password });

		// enc password
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);

		await user.save();

		const payload = {
			user: {
				id: user.id,
			}
		};
		jwt.sign(payload, config.get("jwtSecret"), { expiresIn: 360000 }, (err, token) => {
			if (err) {
				throw err;
			} else {
				res.json({ token: token });
			}
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;