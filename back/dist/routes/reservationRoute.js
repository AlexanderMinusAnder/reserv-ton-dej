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
const data_source_1 = require("../data-source");
const express_validator_1 = require("express-validator");
const Reservation_1 = require("../entity/Reservation");
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const ReservationRouter = express.Router();
require('dotenv').config();
// ########################################################################################################
// Create reservation
ReservationRouter.post("/create", (0, express_validator_1.body)('reservation_date').isDate().trim(), (0, express_validator_1.body)('reservation_schedule').isString().trim(), verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate the body of the request and send error if there's one
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    if (new Date().setHours(0, 0, 0, 0) >= new Date(req.body.reservation_date).setHours(0, 0, 0, 0)) {
        return res.status(400).json({ error: "Votre date de réservation ne peut pas être une date passée ou actuelle." });
    }
    const reservationAlreadyExist = yield data_source_1.AppDataSource.getRepository(Reservation_1.Reservation).find({
        where: {
            user: res.locals.payload.id,
            reservation_date: req.body.reservation_date,
            reservation_schedule: req.body.reservation_schedule
        }
    });
    if (reservationAlreadyExist.length !== 0) {
        return res.status(400).json({ error: `Vous avez déjà réservé pour le repas du ${req.body.reservation_schedule} pour la journée du ${new Date(req.body.reservation_date).toLocaleDateString()}.` });
    }
    const added = yield data_source_1.AppDataSource.getRepository(Reservation_1.Reservation).save({
        user: res.locals.payload.id,
        reservation_date: req.body.reservation_date,
        reservation_schedule: req.body.reservation_schedule
    });
    return res.status(201).json({
        user: res.locals.payload.id,
        reservation_date: new Date(req.body.reservation_date).toISOString(),
        reservation_schedule: req.body.reservation_schedule
    });
}));
// ########################################################################################################
// Delete reservation
ReservationRouter.delete("/cancel", (0, express_validator_1.body)('reservation_date').isDate().trim(), (0, express_validator_1.body)('reservation_schedule').isString().trim(), verifyToken_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate the body of the request and send error if there's one
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    if (new Date().setHours(0, 0, 0, 0) > new Date(req.body.reservation_date).setHours(0, 0, 0, 0)) {
        return res.status(400).json({ error: "Votre date de réservation ne peut pas être une date passée ou actuelle." });
    }
    const reservationAlreadyExist = yield data_source_1.AppDataSource.getRepository(Reservation_1.Reservation).find({
        where: {
            user: res.locals.payload.id,
            reservation_date: req.body.reservation_date,
            reservation_schedule: req.body.reservation_schedule
        }
    });
    if (reservationAlreadyExist.length === 0) {
        return res.status(400).json({ error: `Vous n'avez pas réservé pour le repas du ${req.body.reservation_schedule} pour la journée du ${new Date(req.body.reservation_date).toLocaleDateString()}.` });
    }
    const deleted = yield data_source_1.AppDataSource.getRepository(Reservation_1.Reservation).delete({
        user: res.locals.payload.id,
        reservation_date: req.body.reservation_date,
        reservation_schedule: req.body.reservation_schedule
    });
    return res.status(201).json({
        user: res.locals.payload.id,
        reservation_date: new Date(req.body.reservation_date).toISOString(),
        reservation_schedule: req.body.reservation_schedule
    });
}));
// ########################################################################################################
// Get reservation of currently logged user
ReservationRouter.get("/from-logged-user", verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reservation = yield data_source_1.AppDataSource.getRepository(Reservation_1.Reservation).find({
        where: {
            user: {
                id: res.locals.payload.id
            }
        }
    });
    return res.status(200).json(reservation);
}));
exports.default = ReservationRouter;
