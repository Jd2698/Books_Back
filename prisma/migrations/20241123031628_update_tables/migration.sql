/*
  Warnings:

  - You are about to drop the `Book` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `entregado` on the `Prestamo` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `estado` to the `Prestamo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Book_titulo_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Book";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Libro" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "fechaPublicacion" DATETIME NOT NULL,
    "genero" TEXT NOT NULL,
    "resumen" TEXT,
    "autor" TEXT NOT NULL,
    "numPaginas" INTEGER,
    "numLibros" INTEGER NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Prestamo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "libroId" INTEGER NOT NULL,
    "fechaPrestamo" DATETIME NOT NULL,
    "fechaDevolucion" DATETIME NOT NULL,
    "estado" TEXT NOT NULL,
    CONSTRAINT "Prestamo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Prestamo_libroId_fkey" FOREIGN KEY ("libroId") REFERENCES "Libro" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Prestamo" ("fechaDevolucion", "fechaPrestamo", "id", "libroId", "usuarioId") SELECT "fechaDevolucion", "fechaPrestamo", "id", "libroId", "usuarioId" FROM "Prestamo";
DROP TABLE "Prestamo";
ALTER TABLE "new_Prestamo" RENAME TO "Prestamo";
CREATE TABLE "new_Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT
);
INSERT INTO "new_Usuario" ("email", "id", "telefono") SELECT "email", "id", "telefono" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Libro_titulo_key" ON "Libro"("titulo");
