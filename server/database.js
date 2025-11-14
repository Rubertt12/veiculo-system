const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cpf TEXT UNIQUE,
      chassi TEXT,
      linha TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS eventos_panico (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cpf TEXT,
      chassi TEXT,
      linha TEXT,
      latitude TEXT,
      longitude TEXT,
      endereco TEXT,
      data_hora TEXT
    )
  `);
});

module.exports = db;
