import express from "express"
import connectDB from "./config/db.js"
import dotenv from "dotenv"
import passwordRoutes from "./routes/passwordRoutes.js"
import router from "./routes/user.js"
import cors from "cors"
import cookieParser from "cookie-parser";

const app=express();
app.use(cookieParser());

dotenv.config()
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

connectDB();
const PORT=process.env.PORT || 3000;

app.use("/api/password", passwordRoutes);
app.use("/api/user", router);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);

})