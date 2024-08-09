import express from "express";

import {
	authenticateUser,
	authorizeRoles,
} from "../middlewares/auth.middleware.js";
import {
	createUser,
	loginUser,
	assignRole,
	fetchUsers,
	logoutUser,
} from "../controllers/user.controller.js";

const router = express.Router();

// Route for create a new user
router.route("/create").post(createUser);

// Route for create a new user
router.route("/fetch").get(fetchUsers);

// Route for user login
router.route("/login").post(loginUser);

// Route for user logout
router.route("/logout/:email").get(logoutUser);

// Admin: Assign role to user
router
	.route("/assign-role")
	.post(authenticateUser, authorizeRoles("Admin"), assignRole);

export { router as userRouter };
