const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
/**
 * @access public
 * @route GET api/auth
 * @description Test Route
 */
router.get("/", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		res.json(user);
	} catch (error) {
		console.error(error);
		res.status(500).send("Server Error");
	}
});

/**
 * @route POST api/auth
 * @access private
 * @description 
 */
router.post("/", [
	check('email', "Please include a valid email").isEmail(),
	check("password", "Password is required").exists()
], async (req, res) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	const { email, password } = req.body;

	try {
		let user = await User.findOne({ email });
		if (!user) {
			return res
				.status(400)
				.json({ errors: [{ msg: "Invalid credentials" }] });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res
				.status(400)
				.json({ errors: [{ msg: "Invalid credentials" }] });
		}


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