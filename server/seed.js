// seed.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

function seedDatabase() {
  const dbPath = path.join(__dirname, 'database.db');
  const db = new sqlite3.Database(dbPath);

  db.serialize(() => {
    // Cria a tabela se não existir
    db.run(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cpf TEXT UNIQUE,
        chassi TEXT,
        linha TEXT
      )
    `);

    // Verifica se já existe algum usuário
    db.get("SELECT COUNT(*) AS count FROM usuarios", (err, row) => {
      if (err) return console.error(err);

      if (row.count === 0) {
        console.log("Inserindo usuários padrão...");

        const stmt = db.prepare(
          `INSERT INTO usuarios (cpf, chassi, linha) VALUES (?, ?, ?)`
        );

        stmt.run("12345678901", "CHASSI123", "LINHA1");
        stmt.run("98765432100", "CHASSI987", "LINHA2");
        stmt.run("45678912300", "CHASSI456", "LINHA3");

        stmt.finalize(() => {
          console.log("Usuários inseridos com sucesso!");
          db.close();
        });
      } else {
        console.log("Usuários já existem, seed ignorado.");
        db.close();
      }
    });
  });
}

module.exports = seedDatabase;
