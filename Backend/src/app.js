import express from "express"
import cors from "cors"
import path from "path"
import cookieParser from "cookie-parser"
import { fileURLToPath } from "url"

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static("public"))
app.use(cookieParser())

const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename)
app.use(express.static(path.join(_dirname, "../../Frontend")))





// routes import
import userRouter from "./routes/route.js"
import adminRouter from "./routes/admin.routes.js"

//routes declaration
app.use("/", userRouter)
app.use("/admin", adminRouter)

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(_dirname, "../../Frontend", "index.html"))
})


export default app;
