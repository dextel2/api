const jwt = require("jsonwebtoken");
const config = require("config");

/**
 * @description custom middleware function to verify jwt for protected routes
 * @param {Request} request 
 * @param {Response} response 
 * @param {Function} next 
 */
module.exports = function (request, response, next) {

	// Get token from the header
	const token = request.header('x-auth-token');

	// Check if no token

	if (!token) {
		return response.status(401).json({ msg: "No token auth denied" });
	}

	try {
		const decoded = jwt.verify(token, config.get("jwtSecret"));
		request.user = decoded.user;
		next();
	} catch (error) {
		console.error(error);
		response.status(401).json({ msg: "Token is not valid" });
	}
};