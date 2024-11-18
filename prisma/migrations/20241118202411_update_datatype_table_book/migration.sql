/*
  Warnings:

  - You are about to alter the column `numPaginas` on the `Book` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `stock_disponible` on the `Book` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Book" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "fechaPublicacion" DATETIME NOT NULL,
    "genero" TEXT NOT NULL,
    "numPaginas" INTEGER,
    "resumen" TEXT,
    "autor" TEXT NOT NULL,
    "stock_disponible" INTEGER NOT NULL
);
INSERT INTO "new_Book" ("autor", "fechaPublicacion", "genero", "id", "numPaginas", "resumen", "stock_disponible", "titulo") SELECT "autor", "fechaPublicacion", "genero", "id", "numPaginas", "resumen", "stock_disponible", "titulo" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
