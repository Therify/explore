/*
  Warnings:

  - You are about to drop the column `authentication_method` on the `flow_state` table. All the data in the column will be lost.
  - The primary key for the `schema_migrations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `version` on the `schema_migrations` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(14)`.
  - A unique constraint covering the columns `[version]` on the table `schema_migrations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "storage";

-- DropIndex
DROP INDEX "auth"."flow_state_created_at_idx";

-- DropIndex
DROP INDEX "auth"."idx_user_id_auth_method";

-- DropIndex
DROP INDEX "auth"."mfa_challenge_created_at_idx";

-- DropIndex
DROP INDEX "auth"."refresh_tokens_updated_at_idx";

-- DropIndex
DROP INDEX "auth"."saml_relay_states_created_at_idx";

-- DropIndex
DROP INDEX "auth"."sessions_not_after_idx";

-- AlterTable
ALTER TABLE "auth"."flow_state" DROP COLUMN "authentication_method";

-- AlterTable
ALTER TABLE "auth"."schema_migrations" DROP CONSTRAINT "schema_migrations_pkey",
ALTER COLUMN "version" SET DATA TYPE VARCHAR(14);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL,
    "given_name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email_address" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_address_key" ON "public"."users"("email_address");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "auth"."refresh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "schema_migrations_version_idx" ON "auth"."schema_migrations"("version");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
