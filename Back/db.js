// db.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const dbPromise = open({
  filename: "./database.db",
  driver: sqlite3.Database,
});

(async () => {
  const db = await dbPromise;

  // cria tabela users se não existir (com as colunas novas)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      diamonds INTEGER DEFAULT 0,
      xp INTEGER DEFAULT 0,
      streak_count INTEGER DEFAULT 0,
      last_completed_date TEXT DEFAULT NULL,
      selected_avatar INTEGER DEFAULT 0,
      selected_background INTEGER DEFAULT 0
    );
  `);

  // adiciona colunas novas se ainda não existirem
  try {
    await db.exec(`ALTER TABLE users ADD COLUMN selected_avatar INTEGER DEFAULT 0;`);
  } catch (e) {}
  try {
    await db.exec(`ALTER TABLE users ADD COLUMN selected_background INTEGER DEFAULT 0;`);
  } catch (e) {}

  // cria tabela de compras
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
