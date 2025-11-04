// db.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const dbPromise = open({
  filename: "./database.db",
  driver: sqlite3.Database,
});

(async () => {
  const db = await dbPromise;

  // cria tabela users se não existir (com as colunas de streak)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      diamonds INTEGER DEFAULT 0,
      xp INTEGER DEFAULT 0,
      streak_count INTEGER DEFAULT 0,
      last_completed_date TEXT DEFAULT NULL
    );
  `);

  // caso a tabela já exista sem as colunas, tenta adicionar (safe)
  // NOTA: sqlite aceita ALTER TABLE ADD COLUMN que ignora se coluna já existe? não — então tentamos com try/catch
  try {
    await db.exec(`ALTER TABLE users ADD COLUMN streak_count INTEGER DEFAULT 0;`);
  } catch (e) {
    // coluna já existe — ignora
  }
  try {
    await db.exec(`ALTER TABLE users ADD COLUMN last_completed_date TEXT DEFAULT NULL;`);
  } catch (e) {
    // coluna já existe — ignora
  }

  await db.exec(`
    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      item_name TEXT,
      type TEXT,
      cost INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
})();

export default dbPromise;
