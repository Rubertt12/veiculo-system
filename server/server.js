const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// LOGIN
app.post('/api/login', (req, res) => {
  const { cpf, chassi, linha } = req.body;

  db.get(
    `SELECT * FROM usuarios WHERE cpf = ? AND chassi = ? AND linha = ?`,
    [cpf, chassi, linha],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });

      if (row) {
        return res.json({ success: true, usuario: row });
      }

      return res.json({ success: false });
    }
  );
});

// SALVAR EVENTO DE PÂNICO
app.post('/api/panico', (req, res) => {
  const { cpf, chassi, linha, latitude, longitude, endereco } = req.body;
  const data_hora = new Date().toISOString();

  db.run(
    `INSERT INTO eventos_panico (cpf, chassi, linha, latitude, longitude, endereco, data_hora)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [cpf, chassi, linha, latitude, longitude, endereco, data_hora],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      return res.json({ success: true });
    }
  );
});

app.post('/api/send-email', async (req, res) => {
  const {
    cpf,
    chassi,
    linha,
    latitude,
    longitude,
    endereco,
    mensagem
  } = req.body;

  const payload = {
    service_id: "service_thylr79",
    template_id: "template_lkc1ooe",
    user_id: "Hx4D4KkKfCSUb_xQR",
    accessToken: "SEU_PRIVATE_KEY_AQUI",
    template_params: {
      cpf,
      chassi,
      linha,
      latitude,
      longitude,
      endereco,
      mensagem
    }
  };

  try {
    const r = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const resposta = await r.text();
    console.log("EmailJS respondeu:", resposta);

    res.json({ success: true });
  } catch (err) {
    console.log("ERRO EMAIL:", err);
    res.status(500).json({ error: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
