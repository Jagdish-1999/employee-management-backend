import dotenv from "dotenv";
import path from "path";

/**
 * Loads environment variables from the appropriate .env file based on NODE_ENV.
 */
const loadEnvVariables = () => {
	const envFile =
		process.env.NODE_ENV === "production"
			? ".env.production"
			: ".env.development";

	dotenv.config({ path: path.resolve(process.cwd(), envFile) });
};

export default loadEnvVariables;
