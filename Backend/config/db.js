import mongoose from "mongoose";
import dns from "dns";

// Fix for Node.js SRV lookup issues on Windows / local DNS resolvers
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;
    try {
        if (!mongoUri) {
            throw new Error("MongoDB URI is not defined in environment variables (MONGO_URI / MONGO_URL)");
        }
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;