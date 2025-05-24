import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class InitialSchemaWithRenamings1714800000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create User table
    await queryRunner.createTable(
      new Table({
        name: "user",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "firstName",
            type: "varchar",
          },
          {
            name: "lastName",
            type: "varchar",
          },
          {
            name: "email",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "password",
            type: "varchar",
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
      true
    );

    // 2. Create Race table
    await queryRunner.createTable(
      new Table({
        name: "race",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "isPublished",
            type: "boolean",
            default: false,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
      true
    );

    // 3. Create RaceDetails table with the correct column name 'penalties' (not manualPenalties)
    await queryRunner.createTable(
      new Table({
        name: "race_details",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "raceId",
            type: "int",
            isUnique: true,
          },
          {
            name: "teamsAndPilots",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "settings",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "penalties", // Already using the renamed column name
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "results", // Already included
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "lapsNotDelimiters",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "stintByPilots",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "rawData",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "calculatedData",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
      true
    );

    // 4. Add foreign key from RaceDetails to Race
    await queryRunner.createForeignKey(
      "race_details",
      new TableForeignKey({
        columnNames: ["raceId"],
        referencedColumnNames: ["id"],
        referencedTableName: "race",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.dropTable("race_details", true);
    await queryRunner.dropTable("race", true);
    await queryRunner.dropTable("user", true);
  }
}
