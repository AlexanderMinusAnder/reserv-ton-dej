import * as express from "express";
import * as bcrypt from "bcrypt"
import { AppDataSource } from "../data-source"
import {body, validationResult} from "express-validator"
import * as jwt from "jsonwebtoken"
import { Users } from "../entity/Users";
const Router = express.Router()

require('dotenv').config()

Router.post("/signup",
    body("firstName").notEmpty().isString(),
    body("lastName").notEmpty().isString(),
    body("email").notEmpty().isEmail().withMessage("Votre email n'est pas au bon format"),
    body("password").notEmpty().isString().isStrongPassword().withMessage("Votre mot de passe doit être composé d'au minimum 8 caractères et dois contenir une lettre majuscule ainsi qu'un caractère spéciale"),
    body("status").notEmpty().isString().default("demi-pensionnaire"),
    body("role").notEmpty().isString().default("eleve"),
    async (req, res) => {

    const errors = validationResult(req)

    console.log(errors)
    if(!errors.isEmpty()) {
        return res.status(400).send({error: errors.array()})
    }
     
    // Hash password and send user with hashed password to database
    const password = bcrypt.hashSync(req.body.password, 10)

    const user = {
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "email": req.body.email,
        "password": password,
        "status": req.body.status,
        "role": req.body.role
    }

    await AppDataSource.getRepository(Users).save(user)

    // Delete password from user and create jwt then send token

    delete user.password

    const token = jwt.sign(user, process.env.tokenkey)

    res.status(201).send({ token: token })

})

export default Router