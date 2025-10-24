import express from "express"
import cors from "cors"
import path from "path"
import cookieParser from "cookie-parser"
import { fileURLToPath } from "url"
import bookRoutes from "./routes/route.js"

const app = express()
app.use(cors({ limit: "16kb" }))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())
app.use("../../routes/route.js", bookRoutes)   //may has error
app.use("/api/books", bookRoutes)

const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename)
app.use(express.static(path.join(_dirname, "../../Frontend")))

app.get((req, res) => {
    res.sendFile(path.json(_dirname, "../../Frontend", "index.html"))
})


export default app;
