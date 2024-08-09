import mongoose from "mongoose";

import config from "../config.js";

const connectToDB = async () => {
	const URI = config.mongodbUri;
	if (!URI) {
		throw new Error("Database connection string does not exist");
	} else {
		try {
			const connectionInstance = await mongoose.connect(URI);
			console.log(
				`\n[Success]: MongoDB Connection Success !! DB Host: ${connectionInstance.connection.host}`
			);
		} catch (error) {
			console.log(`[Failed]: MongoDB Connection failed: ${error}`);
			process.exit(1);
		}
	}
};

export { connectToDB };
