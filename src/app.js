import express from "express";
import cors from "cors";
import loadEnvVariables from "./utils/env-loader.js";

loadEnvVariables();

const app = express();

// middleware calls
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		optionsSuccessStatus: 200,
		credentials: true,
	})
);

// routes
import { userRouter } from "./routes/user.route.js";
import { employeeRouter } from "./routes/employee.route.js";

// Handling employee routes
app.use("/employee", employeeRouter);

// Handling user routes
app.use("/users", userRouter);

export { app };
