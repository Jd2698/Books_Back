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
    CONSTRAINT "Prestamo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Prestamo_libroId_fkey" FOREIGN KEY ("libroId") REFERENCES "Libro" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Prestamo" ("estado", "fechaDevolucion", "fechaPrestamo", "id", "libroId", "usuarioId") SELECT "estado", "fechaDevolucion", "fechaPrestamo", "id", "libroId", "usuarioId" FROM "Prestamo";
DROP TABLE "Prestamo";
ALTER TABLE "new_Prestamo" RENAME TO "Prestamo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
