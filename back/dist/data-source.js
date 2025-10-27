"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Users_1 = require("./entity/Users");
const Reservation_1 = require("./entity/Reservation");
const Specificity_1 = require("./entity/Specificity");
const AuthToken_1 = require("./entity/AuthToken");
require('dotenv').config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    synchronize: true,
    logging: false,
    entities: [Users_1.Users, Reservation_1.Reservation, Specificity_1.Specificity, AuthToken_1.AuthToken],
    migrations: [],
    subscribers: [],
});
