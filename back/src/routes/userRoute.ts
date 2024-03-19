import * as express from "express";
import * as bcrypt from "bcrypt"
import { AppDataSource } from "../data-source"
import {body, validationResult} from "express-validator"
import * as jwt from "jsonwebtoken"
import { Users } from "../entity/Users";
import verifyToken from "../middleware/verifyToken";
import { AuthToken } from "../entity/AuthToken";
const UserRouter = express.Router()

require('dotenv').config()

// ########################################################################################################
// Create access token

const generateAccess = (user) => {
    return jwt.sign(user, process.env.tokenKey, {expiresIn: "600s"})
}

UserRouter.post("/token", async (req, res) => {
    const refreshToken = req.body.refreshToken

    if(refreshToken == null ) return res.status(401).send({error: "No refresh token provided"})

    const tokenFound = await AppDataSource.getRepository(AuthToken).find({
        where : {
            token: req.body.refreshToken
        }
    })

    if (tokenFound.length === 0) {
        return res.sendStatus(403)
    }

    jwt.verify(refreshToken, process.env.refreshKey, (err, user) => {
        if(err) return res.status(403).send(err)
        const accessToken = generateAccess({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            status: user.status,
            role: user.role
        })
        res.json({accessToken})
    })
})

// ########################################################################################################
// Sign out

UserRouter.delete("/signout", async (req, res) => {
    const refreshToken = req.body.refreshToken
    await AppDataSource.getRepository(AuthToken).delete({
        token: refreshToken
    })

    if(refreshToken == null ) return res.status(401).send({error: "No refresh token provided"})

    return res.sendStatus(200)
})

// ########################################################################################################
// Signup

UserRouter.post("/signup",
    body("firstName").notEmpty().isString().trim(),
    body("lastName").notEmpty().isString().trim(),
    body("email").notEmpty().isEmail().withMessage("Votre email n'est pas au bon format").trim(),
    body("password").notEmpty().isString().isStrongPassword().withMessage("Votre mot de passe doit être composé d'au minimum 8 caractères et dois contenir une lettre majuscule ainsi qu'un caractère spéciale"),
    body("status").notEmpty().isString().default("demi-pensionnaire").trim(),
    body("role").notEmpty().isString().default("eleve").trim(),
    async (req, res) => {

    // Validate the body of the request and send error if there's one

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()})
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

    const accessToken = jwt.sign(user, process.env.tokenkey)

    res.status(201).json({ accessToken: accessToken })

})

// ########################################################################################################
// Sign in

UserRouter.post("/signin", body('email').isEmail().trim(), body('password').isString(), async (req, res) => {
    // Validate the body of the request and send error if there's one

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()})
    }

    // Find the user based on email

    const userFound = await AppDataSource.getRepository(Users).findOne({
        where: {
            email: req.body.email
        }
    })

    // If there is no user found, send error message and bad request error

    if (!userFound) {
        return res.status(400).json({error: "Identifiant ou mot de passe incorrect."})
    }

    // Hashed password from database is compared with entered password

    const match = await bcrypt.compare(req.body.password, userFound.password)

    if(!match) {
        return res.status(400).json({error: "Identifiant ou mot de passe incorrect."})
    }

    // Create new object based on found user, remove password and create json web token

    const user = { ...userFound }

    delete user.password

    const accessToken = generateAccess(user)
    const refreshToken = jwt.sign(user, process.env.refreshKey)

    await AppDataSource.getRepository(AuthToken).save({token: refreshToken})

    res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken })
})

// ########################################################################################################
// Logged user info

UserRouter.get("/profile", verifyToken, async (req, res, next) => {
    const user = await AppDataSource.getRepository(Users).find({
        where: {
            id: res.locals.payload.id
        },
        relations: {
            specificity: true
        }
    })

    delete user[0].password

    return res.status(200).json(user[0])
})

// ########################################################################################################
// Every user info

UserRouter.get("/all", async (req, res, next) => {
    const userList = await AppDataSource.getRepository(Users).find({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            status: true,
            role: true
        },
        relations: {
            specificity: true
        }
    })

    return res.status(200).json(userList)
})

export default UserRouter