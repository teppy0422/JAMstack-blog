/*
  Warnings:

  - You are about to drop the `accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sampleblog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sampleblog2` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sampleblog3` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `typingresult` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_fkey";

-- DropTable
DROP TABLE "accounts";

-- DropTable
DROP TABLE "sampleblog";

-- DropTable
DROP TABLE "sampleblog2";

-- DropTable
DROP TABLE "sampleblog3";

-- DropTable
DROP TABLE "sessions";

-- DropTable
DROP TABLE "typingresult";

-- DropTable
DROP TABLE "users";
