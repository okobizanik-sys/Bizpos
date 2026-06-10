/*
  Warnings:

  - You are about to drop the `knex_migrations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `knex_migrations_lock` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `sessions` ALTER COLUMN `expires` DROP DEFAULT;

-- AlterTable
ALTER TABLE `settings_data` ADD COLUMN `brand_name` TEXT NULL;

-- AlterTable
ALTER TABLE `verification_tokens` ALTER COLUMN `expires` DROP DEFAULT;

-- DropTable
DROP TABLE `knex_migrations`;

-- DropTable
DROP TABLE `knex_migrations_lock`;
