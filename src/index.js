import { app } from "./app.js";

import { connectToDB } from "./db/db.js";
import config from "./config.js";
import loadEnvVariables from "./utils/env-loader.js";

loadEnvVariables();

connectToDB().then(() => {
	app.on("Error", (error) => {
		console.log("[Error]: Express is not communicating with MongoDB", error);
		throw error;
	});
	app.listen(config.port, () => {
		console.log(`[Server]: listening at http://localhost:${config.port}`);
	});
});
