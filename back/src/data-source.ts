import "reflect-metadata"
import { DataSource } from "typeorm"
import { Users } from "./entity/Users"
import { Reservation } from "./entity/Reservation"
import { Specificity } from "./entity/Specificity"
import { AuthToken } from "./entity/AuthToken"
require('dotenv').config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    synchronize: true,
    logging: false,
    entities: [Users, Reservation, Specificity, AuthToken],
    migrations: [],
    subscribers: [],
})
