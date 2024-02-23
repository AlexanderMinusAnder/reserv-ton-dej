import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Users } from "./Users"

export enum schedule {
    MATIN = "matin",
    MIDI = "midi",
    SOIR = "soir"
}

@Entity()
export class Reservation {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    reservation_date: Date

    @Column({
        type: "enum",
        enum: schedule,
        default: schedule.MIDI
    })
    reservation_schedule: schedule

    @ManyToOne(() => Users, (user) => user.reservation)
    @JoinColumn({name: "user_id"})
    user: Users

}
