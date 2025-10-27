"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const bcrypt = __importStar(require("bcrypt"));
const data_source_1 = require("../data-source");
const express_validator_1 = require("express-validator");
const jwt = __importStar(require("jsonwebtoken"));
const Users_1 = require("../entity/Users");
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const AuthToken_1 = require("../entity/AuthToken");
const UserRouter = express.Router();
require('dotenv').config();
// ########################################################################################################
// Create access token
const generateAccess = (user) => {
    return jwt.sign(user, process.env.tokenKey, { expiresIn: "600s" });
};
UserRouter.post("/token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.body.refreshToken;
    if (refreshToken == null)
        return res.status(401).send({ error: "No refresh token provided" });
    const tokenFound = yield data_source_1.AppDataSource.getRepository(AuthToken_1.AuthToken).find({
        where: {
            token: req.body.refreshToken
        }
    });
    if (tokenFound.length === 0) {
        return res.sendStatus(403);
    }
    jwt.verify(refreshToken, process.env.refreshKey, (err, user) => {
        if (err)
            return res.status(403).send(err);
        const accessToken = generateAccess({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            status: user.status,
            role: user.role
        });
        res.json({ accessToken });
    });
}));
// ########################################################################################################
// Sign out
UserRouter.delete("/signout", verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.body.refreshToken;
    yield data_source_1.AppDataSource.getRepository(AuthToken_1.AuthToken).delete({
        token: refreshToken
    });
    if (refreshToken == null)
        return res.status(401).send({ error: "No refresh token provided" });
    return res.sendStatus(200);
}));
// ########################################################################################################
// Signup
UserRouter.post("/signup", (0, express_validator_1.body)("firstName").notEmpty().isString().trim(), (0, express_validator_1.body)("lastName").notEmpty().isString().trim(), (0, express_validator_1.body)("email").notEmpty().isEmail().withMessage("Votre email n'est pas au bon format").trim(), (0, express_validator_1.body)("password").notEmpty().isString().isStrongPassword().withMessage("Votre mot de passe doit être composé d'au minimum 8 caractères et dois contenir une lettre majuscule ainsi qu'un caractère spéciale"), (0, express_validator_1.body)("status").notEmpty().isString().default("demi-pensionnaire").trim(), (0, express_validator_1.body)("role").notEmpty().isString().default("eleve").trim(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate the body of the request and send error if there's one
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    // Hash password and send user with hashed password to database
    const password = bcrypt.hashSync(req.body.password, 10);
    const user = {
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "email": req.body.email,
        "password": password,
        "status": req.body.status,
        "role": req.body.role
    };
    yield data_source_1.AppDataSource.getRepository(Users_1.Users).save(user);
    // Delete password from user and create jwt then send token
    delete user.password;
    const accessToken = jwt.sign(user, process.env.tokenKey);
    res.status(201).json({ accessToken: accessToken });
}));
// ########################################################################################################
// Sign in
UserRouter.post("/signin", (0, express_validator_1.body)('email').isEmail().trim(), (0, express_validator_1.body)('password').isString(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate the body of the request and send error if there's one
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    // Find the user based on email
    const userFound = yield data_source_1.AppDataSource.getRepository(Users_1.Users).findOne({
        where: {
            email: req.body.email
        }
    });
    // If there is no user found, send error message and bad request error
    if (!userFound) {
        return res.status(400).json({ error: "Identifiant ou mot de passe incorrect." });
    }
    // Hashed password from database is compared with entered password
    const match = yield bcrypt.compare(req.body.password, userFound.password);
    if (!match) {
        return res.status(400).json({ error: "Identifiant ou mot de passe incorrect." });
    }
    // Create new object based on found user, remove password and create json web token
    const user = Object.assign({}, userFound);
    delete user.password;
    const accessToken = generateAccess(user);
    const refreshToken = jwt.sign(user, process.env.refreshKey);
    yield data_source_1.AppDataSource.getRepository(AuthToken_1.AuthToken).save({ token: refreshToken });
    res.cookie("refreshToken", refreshToken);
    res.cookie("accessToken", accessToken);
    res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
}));
// ########################################################################################################
// Logged user info
UserRouter.get("/profile", verifyToken_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield data_source_1.AppDataSource.getRepository(Users_1.Users).find({
        where: {
            id: res.locals.payload.id
        },
        relations: {
            specificity: true
        }
    });
    delete user[0].password;
    return res.status(200).json(user[0]);
}));
// ########################################################################################################
// Every user info
UserRouter.get("/all", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userList = yield data_source_1.AppDataSource.getRepository(Users_1.Users).find({
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
    });
    return res.status(200).json(userList);
}));
exports.default = UserRouter;
