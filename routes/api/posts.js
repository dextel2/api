const express = require("express");
const router = express.Router();

/**
 * @access Public
 * @route GET api/posts
 * @description Test Route
 */
router.get("/", (req, res) => {
	res.send("Post route");
});

module.exports = router;