import express from "express"
import connectDB from "./config/db.js"
import dotenv from "dotenv"
import passwordRoutes from "./routes/passwordRoutes.js"

const app=express();

dotenv.config()
app.use(express.json())
connectDB();
const PORT=process.env.PORT || 3000;

app.use("/api/password", passwordRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/password", passwordRoutes);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);

})