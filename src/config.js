import loadEnvVariables from "./utils/env-loader.js";

loadEnvVariables();

const config = {
	port: process.env.PORT || 8001,
	redisHost: process.env.REDIS_HOST,
	redisPort: process.env.REDIS_PORT,
	mongodbUri: process.env.MONGODB_URI,
	jwtSecret: process.env.JWT_SECRET,
};

export default config;
