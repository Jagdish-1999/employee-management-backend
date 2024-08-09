import { createClient } from "redis";
import loadEnvVariables from "./env-loader.js";

loadEnvVariables();

const redisClient = createClient({
	url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisClient.on("error", (err) => {
	console.error("[Error] Redis Client Error:", err);
});

(async () => {
	try {
		await redisClient.connect();
		console.log("[Success] Redis Connection success!");
	} catch (err) {
		console.error("[Error] Error Connecting to Redis:", err);
	}
})();

export default redisClient;
