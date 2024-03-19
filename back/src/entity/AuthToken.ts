import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"

@Entity()
export class AuthToken {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    token: string

}
