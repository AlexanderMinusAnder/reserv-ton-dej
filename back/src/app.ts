import * as express from "express"
import { Request, Response } from "express"
require('dotenv').config()
const port = process.env.PORT

// create and setup express app
const app = express()
app.use(express.json())

// start express server
app.listen(port, () => {console.log(`Server is listening on port ${port}`)})