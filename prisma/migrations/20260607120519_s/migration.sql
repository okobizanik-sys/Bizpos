-- AlterTable
ALTER TABLE `sessions` ALTER COLUMN `expires` DROP DEFAULT;

-- AlterTable
ALTER TABLE `verification_tokens` ALTER COLUMN `expires` DROP DEFAULT;
