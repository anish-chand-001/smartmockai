
import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import connectDB from "./config/db.js";
import colors from 'colors'

dotenv.config();
const PORT = process.env.PORT || 5000;
connectDB()


app.listen(PORT,() =>{
    console.log(`server is running on port ${PORT}`.bgBlue);

    
})