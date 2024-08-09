import jwt from "jsonwebtoken";
import redisClient from "../utils/redis-client.js";
import User from "../models/user.model.js";

// Middleware to authenticate user using JWT
const authenticateUser = async (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1];
	console.log(req.headers);
	if (!token) {
		return res
			.status(401)
			.json({ message: "Authentication failed. No token provided." });
	}

	try {
		// Check if token is cached
		const cachedToken = await redisClient.get(token);
		if (cachedToken) {
			req.user = JSON.parse(cachedToken);
			return next();
		}

		// Verify token and get user details
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.userId);

		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		// Cache the token and user details
		await redisClient.set(token, JSON.stringify(user), "EX", 3600); // Cache for 1 hour

		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({ message: "Authentication failed." });
	}
};

// Middleware to authorize based on user roles
const authorizeRoles = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return res.status(403).json({
				message: "You do not have permission to perform this action.",
			});
		}
		next();
	};
};

export { authenticateUser, authorizeRoles };
