const express = require("express");
const { check, validationResult } = require("express-validator");
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
], (req, res) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	res.send('User route');


});

module.exports = router;