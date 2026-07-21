import express from "express"
import connectDB from "./config/db.js"
import dotenv from "dotenv"
import passwordRoutes from "./routes/passwordRoutes.js"
import cors from "cors"


const app=express();

dotenv.config()
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

connectDB();
const PORT=process.env.PORT || 3000;

app.use("/api/password", passwordRoutes);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);

})