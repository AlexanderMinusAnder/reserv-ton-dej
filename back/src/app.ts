import express from "express";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.listen(port, () => {
    try {
        console.log(`Server is running on port: ${port}`)
    } catch (err) {
        throw new Error(`Couldn't start server: ${err}`)
    }
})