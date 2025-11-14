const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  console.log("Inserindo usuários...");

  db.run(
    `INSERT INTO usuarios (cpf, chassi, linha) VALUES (?, ?, ?)`,
    ["12345678901", "CHASSI123", "LINHA1"]
  );

  db.run(
    `INSERT INTO usuarios (cpf, chassi, linha) VALUES (?, ?, ?)`,
    ["98765432100", "CHASSI987", "LINHA2"]
  );

  db.run(
    `INSERT INTO usuarios (cpf, chassi, linha) VALUES (?, ?, ?)`,
    ["45678912300", "CHASSI456", "LINHA3"]
  );
});

db.close();
console.log("Usuários inseridos com sucesso!");
