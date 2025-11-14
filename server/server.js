const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Servir a pasta public
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Login
app.post('/api/login', (req, res) => {
    const { cpf, chassi, linha } = req.body;

    db.get(`SELECT * FROM usuarios WHERE cpf = ? AND chassi = ? AND linha = ?`,
        [cpf, chassi, linha],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (row) return res.json({ success: true, usuario: row });
            return res.json({ success: false, message: "Usuário não encontrado" });
        }
    );
});

// Registrar pânico
app.post('/api/panico', (req, res) => {
    const { cpf, chassi, linha, latitude, longitude, endereco } = req.body;

    const data_hora = new Date().toISOString();

    db.run(`
        INSERT INTO eventos_panico 
        (cpf, chassi, linha, latitude, longitude, endereco, data_hora)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
        [cpf, chassi, linha, latitude, longitude, endereco, data_hora],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.json({ success: true });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
