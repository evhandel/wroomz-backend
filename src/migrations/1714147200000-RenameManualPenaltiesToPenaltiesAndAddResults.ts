import { MigrationInterface, QueryRunner } from "typeorm"

export class RenameManualPenaltiesToPenaltiesAndAddResults1714147200000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // First, rename manualPenalties to penalties
        await queryRunner.query(`
            ALTER TABLE "race_details" 
            RENAME COLUMN "manualPenalties" TO "penalties"
        `);

        // Then add the results column
        await queryRunner.query(`
            ALTER TABLE "race_details" 
            ADD COLUMN IF NOT EXISTS "results" jsonb
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // First remove the results column
        await queryRunner.query(`
            ALTER TABLE "race_details" 
            DROP COLUMN IF EXISTS "results"
        `);

        // Then rename penalties back to manualPenalties
        await queryRunner.query(`
            ALTER TABLE "race_details" 
            RENAME COLUMN "penalties" TO "manualPenalties"
        `);
    }
} 