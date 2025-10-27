"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_source_1 = require("./data-source");
require('dotenv').config();
const port = process.env.PORT;
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const cors_1 = __importDefault(require("cors"));
const reservationRoute_1 = __importDefault(require("./routes/reservationRoute"));
// establish database connection
data_source_1.AppDataSource
    .initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
})
    .catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
// create and setup express app
const app = (0, express_1.default)();
app.use(express_1.default.json());
const corsConfig = {
    origin: `http://localhost:5173`,
    credentials: true,
};
app.use((0, cors_1.default)(corsConfig));
app.use("/api/user", userRoute_1.default);
app.use("/api/reservation", reservationRoute_1.default);
// start express server
app.listen(port, () => { console.log(`Server is listening on port ${port}`); });
