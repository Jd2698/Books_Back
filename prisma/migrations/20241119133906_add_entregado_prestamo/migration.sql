-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Prestamo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "libroId" INTEGER NOT NULL,
    "fechaPrestamo" DATETIME NOT NULL,
    "fechaDevolucion" DATETIME NOT NULL,
    "entregado" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Prestamo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Prestamo_libroId_fkey" FOREIGN KEY ("libroId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Prestamo" ("fechaDevolucion", "fechaPrestamo", "id", "libroId", "usuarioId") SELECT "fechaDevolucion", "fechaPrestamo", "id", "libroId", "usuarioId" FROM "Prestamo";
DROP TABLE "Prestamo";
ALTER TABLE "new_Prestamo" RENAME TO "Prestamo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
