/*
  Warnings:

  - You are about to drop the column `fechaPublicacion` on the `Libro` table. All the data in the column will be lost.
  - You are about to drop the column `numLibros` on the `Libro` table. All the data in the column will be lost.
  - You are about to drop the column `numPaginas` on the `Libro` table. All the data in the column will be lost.
  - You are about to drop the column `fechaDevolucion` on the `Prestamo` table. All the data in the column will be lost.
  - You are about to drop the column `fechaPrestamo` on the `Prestamo` table. All the data in the column will be lost.
  - You are about to drop the column `libroId` on the `Prestamo` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `Prestamo` table. All the data in the column will be lost.
  - Added the required column `fecha_publicacion` to the `Libro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero_libros` to the `Libro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fecha_devolucion` to the `Prestamo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fecha_prestamo` to the `Prestamo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `libro_id` to the `Prestamo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario_id` to the `Prestamo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Rol" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Usuario_rol" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario_id" INTEGER NOT NULL,
    "rol_id" INTEGER NOT NULL,
    CONSTRAINT "Usuario_rol_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Usuario_rol_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "Rol" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Libro" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "fecha_publicacion" DATETIME NOT NULL,
    "genero" TEXT NOT NULL,
    "resumen" TEXT,
    "autor" TEXT NOT NULL,
    "numero_paginas" INTEGER,
    "numero_libros" INTEGER NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Libro" ("autor", "disponible", "genero", "id", "resumen", "titulo") SELECT "autor", "disponible", "genero", "id", "resumen", "titulo" FROM "Libro";
DROP TABLE "Libro";
ALTER TABLE "new_Libro" RENAME TO "Libro";
CREATE UNIQUE INDEX "Libro_titulo_key" ON "Libro"("titulo");
CREATE TABLE "new_Prestamo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario_id" INTEGER NOT NULL,
    "libro_id" INTEGER NOT NULL,
    "fecha_prestamo" DATETIME NOT NULL,
    "fecha_devolucion" DATETIME NOT NULL,
    "estado" TEXT NOT NULL,
    CONSTRAINT "Prestamo_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Prestamo_libro_id_fkey" FOREIGN KEY ("libro_id") REFERENCES "Libro" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Prestamo" ("estado", "id") SELECT "estado", "id" FROM "Prestamo";
DROP TABLE "Prestamo";
ALTER TABLE "new_Prestamo" RENAME TO "Prestamo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
