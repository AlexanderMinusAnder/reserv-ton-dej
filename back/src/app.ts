import express from "express"
import { AppDataSource } from "./data-source"
require('dotenv').config()
const port = process.env.PORT
import UserRouter from "./routes/userRoute"

import cors from "cors"

import ReservationRouter from "./routes/reservationRoute"
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
const corsConfig = {
    origin: `http://localhost:5173`,
    credentials: true,
  }
app.use(cors(corsConfig))

app.use("/api/user", UserRouter)

app.use("/api/reservation", ReservationRouter)



// start express server
app.listen(port, () => {console.log(`Server is listening on port ${port}`)})