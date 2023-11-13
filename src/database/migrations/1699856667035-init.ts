import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1699856667035 implements MigrationInterface {
  name = 'Init1699856667035';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`products\` (\`id\` varchar(36) NOT NULL, \`code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`price\` decimal(10,2) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_7cfc24d6c24f0ec91294003d6b\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`shelves\` (\`id\` varchar(36) NOT NULL, \`code\` varchar(2) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`sections\` (\`id\` varchar(36) NOT NULL, \`number\` int NOT NULL, \`shelf_id\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`product_locations\` (\`id\` varchar(36) NOT NULL, \`product_id\` varchar(255) NOT NULL, \`section_id\` varchar(255) NOT NULL, \`quantity\` int NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`warehouse_logs\` (\`id\` varchar(36) NOT NULL, \`action\` enum ('ADD_PRODUCT_TO_LOCATION', 'REMOVE_PRODUCT_FROM_LOCATION', 'RETRIEVE_PRODUCT_LOCATION') NOT NULL, \`success\` tinyint NOT NULL, \`details\` json NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sections\` ADD CONSTRAINT \`FK_5ef11fcb14761dc58b2e9f643a5\` FOREIGN KEY (\`shelf_id\`) REFERENCES \`shelves\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_locations\` ADD CONSTRAINT \`FK_b38330f33c7ae4354b83445b23a\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_locations\` ADD CONSTRAINT \`FK_6ec6f6419a8fa488a40efd6f3b4\` FOREIGN KEY (\`section_id\`) REFERENCES \`sections\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`product_locations\` DROP FOREIGN KEY \`FK_6ec6f6419a8fa488a40efd6f3b4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_locations\` DROP FOREIGN KEY \`FK_b38330f33c7ae4354b83445b23a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sections\` DROP FOREIGN KEY \`FK_5ef11fcb14761dc58b2e9f643a5\``,
    );
    await queryRunner.query(`DROP TABLE \`warehouse_logs\``);
    await queryRunner.query(`DROP TABLE \`product_locations\``);
    await queryRunner.query(`DROP TABLE \`sections\``);
    await queryRunner.query(`DROP TABLE \`shelves\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_7cfc24d6c24f0ec91294003d6b\` ON \`products\``,
    );
    await queryRunner.query(`DROP TABLE \`products\``);
  }
}
