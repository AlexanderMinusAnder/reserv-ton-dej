import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Users } from "./Users"

@Entity()
export class Specificity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    allergy: string

    @Column()
    diet: string

    @ManyToOne(() => Users, (users) => users.specificity)
    @JoinColumn({
        name: "user_id"
    })
    user: Users
}
