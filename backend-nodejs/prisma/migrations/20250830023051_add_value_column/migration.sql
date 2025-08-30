/*
  Warnings:

  - Added the required column `value` to the `cars` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."cars" ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;
