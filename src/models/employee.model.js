import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		position: {
			type: String,
			required: true,
		},
		department: {
			type: String,
			required: true,
		},
		salary: {
			type: Number,
			required: false,
			default: 0,
		},
		joiningDate: {
			type: Date,
			required: false,
			default: null,
		},
		exitDate: {
			type: Date,
			required: false,
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

const Employee =
	mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

export default Employee;
