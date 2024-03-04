import * as express from "express"
import { AppDataSource } from "./data-source"
require('dotenv').config()
const port = process.env.PORT
import Router from "./routes/userRoute"

// establish database connection

AppDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

// create and setup express app
const app = express()
app.use(express.json())

app.use("/api/user", Router)

// start express server
app.listen(port, () => {console.log(`Server is listening on port ${port}`)})