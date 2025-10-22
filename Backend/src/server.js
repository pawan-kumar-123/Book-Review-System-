import connectDB from "./db/DB.js";
import dotenv from "dotenv"


dotenv.config({
    path:'./env'
})
connectDB()




