import * as express from "express";
import * as bcrypt from "bcrypt"
import { AppDataSource } from "../data-source"
import {body, param, validationResult} from "express-validator"
import { Reservation } from "../entity/Reservation";

import verifyToken from "../middleware/verifyToken"
import { Between } from "typeorm";

const ReservationRouter = express.Router()

require('dotenv').config()

// ########################################################################################################
// Create reservation

ReservationRouter.post("/create", body('reservation_date').isDate().trim(), body('reservation_schedule').isString().trim(), verifyToken, async (req, res) => {

    // Validate the body of the request and send error if there's one

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()})
    }

    if(new Date().setHours(0, 0, 0, 0) >= new Date(req.body.reservation_date).setHours(0, 0, 0, 0)) {
        return res.status(400).json({error: "Votre date de réservation ne peut pas être une date passée ou actuelle."})
    }

    const reservationAlreadyExist = await AppDataSource.getRepository(Reservation).find({
        where: {
            user: res.locals.payload.id,
            reservation_date: req.body.reservation_date,
            reservation_schedule: req.body.reservation_schedule
        }
    })

    if(reservationAlreadyExist.length !== 0) {
        return res.status(400).json({error: `Vous avez déjà réservé pour le repas du ${req.body.reservation_schedule} pour la journée du ${new Date(req.body.reservation_date).toLocaleDateString()}.`})
    }

    await AppDataSource.getRepository(Reservation).save({
        user: res.locals.payload.id,
        reservation_date: req.body.reservation_date,
        reservation_schedule: req.body.reservation_schedule
    })

    return res.status(201).json({ message: `Votre réservation pour le repas du ${req.body.reservation_schedule} pour la journée du ${new Date(req.body.reservation_date).toLocaleDateString()} a bien été prise.`})
})


// ########################################################################################################
// Delete reservation

ReservationRouter.delete("/cancel", body('reservation_date').isDate().trim(), body('reservation_schedule').isString().trim(), verifyToken, async (req, res, next) => {
        // Validate the body of the request and send error if there's one

        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            return res.status(400).json({error: errors.array()})
        }
    
        if(new Date().setHours(0, 0, 0, 0) > new Date(req.body.reservation_date).setHours(0, 0, 0, 0)) {
            return res.status(400).json({error: "Votre date de réservation ne peut pas être une date passée ou actuelle."})
        }
    
        const reservationAlreadyExist = await AppDataSource.getRepository(Reservation).find({
            where: {
                user: res.locals.payload.id,
                reservation_date: req.body.reservation_date,
                reservation_schedule: req.body.reservation_schedule
            }
        })
    
        if(reservationAlreadyExist.length === 0) {
            return res.status(400).json({error: `Vous n'avez pas réservé pour le repas du ${req.body.reservation_schedule} pour la journée du ${new Date(req.body.reservation_date).toLocaleDateString()}.`})
        }
    
        await AppDataSource.getRepository(Reservation).delete({
            user: res.locals.payload.id,
            reservation_date: req.body.reservation_date,
            reservation_schedule: req.body.reservation_schedule
        })
    
        return res.status(201).json({ message: `Votre réservation pour le repas du ${req.body.reservation_schedule} pour la journée du ${new Date(req.body.reservation_date).toLocaleDateString()} a bien été annulée.`})
})

// ########################################################################################################
// Reservation of week for logged user

ReservationRouter.get("/user/:begin_date&:end_date", param('begin_date').isDate().trim(), param('end_date').isDate().trim(), verifyToken, async (req, res) => {
    const reservation = await AppDataSource.getRepository(Reservation).find({
        where: {
            user: {
                id: res.locals.payload.id
            },
            reservation_date: Between(
                req.params.begin_date,
                req.params.end_date
            )
        }
    })

    return res.status(200).json(reservation)
})

export default ReservationRouter