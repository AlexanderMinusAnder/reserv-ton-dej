import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Reservation } from "./Reservation"
import { Specificity } from "./Specificity"

export enum status {
    "demi-pensionnaire" = "demi-pensionnaire",
    "interne" = "interne"
}


export enum role {
    eleve = "eleve",
    admin = "admin",
    cuisine = "cuisine"
}

@Entity()
export class Users {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column({
        unique: true
    })
    email: string

    @Column()
    password: string

    @Column({
        type: "enum",
        enum: status,
        default: status["demi-pensionnaire"]
    })
    status: status

    @Column({
        type: "enum",
        enum: role,
        default: role.eleve
    })
    role: role

    @OneToMany(() => Reservation, (reservation) => reservation.user)
    reservation: Reservation[]

    @OneToMany(() => Specificity, (specificity) => specificity.user)
    specificity: Specificity[]

}
