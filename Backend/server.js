import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import router from "./routes/user.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.startsWith("http://localhost:")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

connectDB();
const PORT=process.env.PORT || 3000;

app.use("/api/password", passwordRoutes);
app.use("/api/user", router);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);

})