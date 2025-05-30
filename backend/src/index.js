import express from "express"
import authRoutes from "./routes/auth.route.js"
import "dotenv/config"
import cookieParser from "cookie-parser"
import {connectDB} from "../src/lib/db.js"
const app = express()


app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRoutes)

const PORT = process.env.PORT

app.listen(PORT, () =>
{
    console.log(`runnin on port ${PORT}`)
    connectDB()
})
