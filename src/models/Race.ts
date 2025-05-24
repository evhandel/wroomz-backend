import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from "typeorm"
import { RaceDetails } from "./RaceDetails"

@Entity()
export class Race {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column({ default: false })
    isPublished!: boolean

    @OneToOne(() => RaceDetails, (details: RaceDetails) => details.race)
    details!: RaceDetails

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date
} 