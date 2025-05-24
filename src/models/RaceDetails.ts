import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Race } from "./Race";

@Entity()
export class RaceDetails {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Race, (race: Race) => race.details)
  @JoinColumn()
  race!: Race;

  @Column("jsonb", { nullable: true })
  teamsAndPilots!: Record<string, any>;

  @Column("jsonb", { nullable: true })
  settings!: Record<string, any>;

  @Column("jsonb", { nullable: true })
  penalties!: Record<string, any>;

  @Column("jsonb", { nullable: true })
  results!: Record<string, any>[];

  @Column("jsonb", { nullable: true })
  lapsNotDelimiters!: Record<string, any>;

  @Column("jsonb", { nullable: true })
  stintByPilots!: Record<string, any>;

  @Column("jsonb", { nullable: true })
  rawData!: Record<string, any>;

  @Column("jsonb", { nullable: true })
  calculatedData!: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
