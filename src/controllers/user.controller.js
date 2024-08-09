import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import asyncHandler from "../utils/async-handler.js";
import redisClient from "../utils/redis-client.js"; // Import Redis client

// Function to create a new user
const createUser = asyncHandler(async (req, res) => {
	try {
		const { username, email, password, role } = req.body;

		// Validating user input
		if (!username || !email || !password) {
			return res
				.status(400)
				.json({ message: "Username, email, and password are required." });
		}

		// Checking if the user already exists or not
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists." });
		}

		// Hashing the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create a new user
		const newUser = new User({
			username,
			email,
			password: hashedPassword,
			role: role || "Viewer", // Default role
		});

		// Saving created user to database
		await newUser.save();

		// Generate a token
		const token = jwt.sign(
			{ userId: newUser._id, role: newUser.role },
			process.env.JWT_SECRET,
			{
				expiresIn: "1h", // Setting Token expiration time
			}
		);

		// Responding with the new user and token
		res.status(201).json({
			message: "User created successfully.",
			user: {
				id: newUser._id,
				username: newUser.username,
				email: newUser.email,
				role: newUser.role,
			},
			token, // Returning token
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Failed to create user.", error });
	}
});

// Function to fetch users
const fetchUsers = asyncHandler(async (req, res) => {
	try {
		const users = await User.find();

		// Responding with the new user and token
		res.status(201).json({
			message: "User fetched successfully.",
			users,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Failed to fetch user.", error });
	}
});

// Function to handle user login with caching
const loginUser = asyncHandler(async (req, res) => {
	try {
		const { email, password } = req.body;

		// Validating user input
		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "Email and password are required." });
		}

		// Check if user details are cached
		const cachedUser = await redisClient.get(`user:${email}`);
		if (cachedUser) {
			const user = JSON.parse(cachedUser);
			const isMatch = await bcrypt.compare(password, user.password);
			if (isMatch) {
				const token = jwt.sign(
					{ userId: user._id, role: user.role },
					process.env.JWT_SECRET,
					{
						expiresIn: "1h", // Setting Token expiration time
					}
				);
				return res.status(200).json({
					message: "Login successful.",
					user: {
						_id: user._id,
						username: user.username,
						email: user.email,
						role: user.role,
					},
					token, // Returning token for authenticated requests
				});
			}
		}

		// Find the user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: "Invalid email or password." });
		}

		// Check if the password is correct
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: "Invalid email or password." });
		}

		// Cache user data
		await redisClient.set(`user:${email}`, JSON.stringify(user), "EX", 3600); // Cache for 1 hour

		// Generating a token
		const token = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWT_SECRET,
			{
				expiresIn: "1h", // Setting Token expiration time
			}
		);

		// Responding with user info and token
		res.status(200).json({
			message: "Login successful.",
			user: {
				_id: user._id,
				username: user.username,
				email: user.email,
				role: user.role,
			},
			token, // Returning token for authenticated requests
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Login failed.", error });
	}
});

// Function to handle Logout user
const logoutUser = asyncHandler(async (req, res) => {
	try {
		const email = req.params.email;
		console.log(email);

		if (!email) {
			return res.status(400).json({ message: "Email is required." });
		}

		// Remove cached user data
		await redisClient.del(`user:${email}`);

		res.status(200).json({ message: "Logout successful." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Logout failed.", error });
	}
});

// Admin: Assign role to user with caching
const assignRole = asyncHandler(async (req, res) => {
	try {
		const { userId, role } = req.body;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		user.role = role;
		await user.save();

		// Invalidate cache
		await redisClient.del(`user:${user.email}`);

		res.status(200).json({ message: "User role updated successfully.", user });
	} catch (error) {
		res.status(500).json({ message: "Failed to update user role.", error });
	}
});

export { createUser, fetchUsers, loginUser, logoutUser, assignRole };
