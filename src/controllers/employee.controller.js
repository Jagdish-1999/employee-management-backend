// controllers/employee.controller.js
import Employee from "../models/employee.model.js";
import asyncHandler from "../utils/async-handler.js";

// Admin: Create a new employee
const createEmployee = asyncHandler(async (req, res) => {
	try {
		const employee = new Employee(req.body);
		await employee.save();
		res
			.status(201)
			.json({ message: "Employee created successfully.", employee });
	} catch (error) {
		res.status(500).json({ message: "Failed to create employee.", error });
	}
});

// Admin, Editor: Read employee details
const getEmployee = asyncHandler(async (req, res) => {
	try {
		const employee = await Employee.findById(req.params.id);
		if (!employee) {
			return res.status(404).json({ message: "Employee not found." });
		}
		res.status(200).json({ employee });
	} catch (error) {
		res.status(500).json({ message: "Failed to retrieve employee.", error });
	}
});

// Admin, Editor: Read employee details
const fetchEmployees = asyncHandler(async (_req, res) => {
	try {
		const employee = await Employee.find();
		if (!employee.length) {
			return res.status(404).json({ message: "Employee not found." });
		}
		res
			.status(200)
			.json({ message: "Employees Fetched successfully", employees: employee });
	} catch (error) {
		res.status(500).json({ message: "Failed to retrieve employee.", error });
	}
});

// Admin, Editor: Update employee details
const updateEmployee = asyncHandler(async (req, res) => {
	try {
		const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		if (!employee) {
			return res.status(404).json({ message: "Employee not found." });
		}
		res
			.status(200)
			.json({ message: "Employee updated successfully.", employee });
	} catch (error) {
		res.status(500).json({ message: "Failed to update employee.", error });
	}
});

// Admin: Delete employee
const deleteEmployee = asyncHandler(async (req, res) => {
	try {
		const employee = await Employee.findByIdAndDelete(req.params.id);
		if (!employee) {
			return res.status(404).json({ message: "Employee not found." });
		}
		res
			.status(200)
			.json({ message: "Employee deleted successfully.", employee });
	} catch (error) {
		res.status(500).json({ message: "Failed to delete employee.", error });
	}
});

export {
	createEmployee,
	getEmployee,
	fetchEmployees,
	updateEmployee,
	deleteEmployee,
};
