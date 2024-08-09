import express from "express";
import {
	createEmployee,
	getEmployee,
	updateEmployee,
	deleteEmployee,
	fetchEmployees,
} from "../controllers/employee.controller.js";
import {
	authenticateUser,
	authorizeRoles,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin: Create employee
router
	.route("/create")
	.post(authenticateUser, authorizeRoles("Admin"), createEmployee);

// Admin, Editor: Get employee details
router
	.route("/fetch")
	.get(
		authenticateUser,
		authorizeRoles("Admin", "Editor", "Viewer"),
		fetchEmployees
	);

// Admin, Editor: Get employee details
router
	.route("/:id")
	.get(authenticateUser, authorizeRoles("Admin", "Editor"), getEmployee);

// Admin, Editor: Update employee
router
	.route("/:id")
	.put(authenticateUser, authorizeRoles("Admin", "Editor"), updateEmployee);

// Admin: Delete employee
router
	.route("/:id")
	.delete(authenticateUser, authorizeRoles("Admin"), deleteEmployee);

export { router as employeeRouter };
