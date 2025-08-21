import mongoose from "mongoose";

let isConnected = false;
let listenersBound = false;

const bindConnectionListeners = () => {
	if (listenersBound) return;
	listenersBound = true;
	mongoose.connection.on("connected", () => {
		isConnected = true;
		// console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
		console.log("MongoDB connection established successfully.");
	});
	mongoose.connection.on("error", (err) => {
		console.error("MongoDB connection error:", err);
	});
	mongoose.connection.on("disconnected", () => {
		isConnected = false;
		console.warn("MongoDB disconnected");
	});
};

const connectDB = async () => {
	const uri = process.env.MONGODB_URI;
	const dbName = process.env.MONGODB_DB_NAME || "pingup";

	if (!uri) {
		throw new Error("MONGODB_URI is not set in environment variables");
	}

	if (isConnected) return mongoose.connection;

	bindConnectionListeners();

	await mongoose.connect(uri, {
		dbName,
		// serverSelectionTimeoutMS: 5000,
		// maxPoolSize: 10, // optional: tune based on workload
	});

	return mongoose.connection;
};

export default connectDB;
