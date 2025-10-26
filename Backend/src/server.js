import connectDB from "./db/DB.js";
import dotenv from "dotenv"
import app from "./app.js"

dotenv.config({
    path: './env'
})
connectDB()


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});

export default app