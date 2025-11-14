// Toggle modo escuro
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("dark-mode", document.body.classList.contains("dark-mode"));
}

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("dark-mode") === "true") {
        document.body.classList.add("dark-mode");
    }
});

// FUNÇÃO PRINCIPAL DO BOTÃO DE PÂNICO
async function panico() {
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    if (!usuario) {
        alert("Usuário não logado!");
        window.location.href = "index.html";
        return;
    }

    if (!navigator.geolocation) {
        alert("Geolocalização não suportada.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);

        document.getElementById("latitude").value = lat;
        document.getElementById("longitude").value = lon;

        const endereco = await obterEndereco(lat, lon);
        document.getElementById("endereco").value = endereco;

        // SALVAR NO BANCO
        await fetch("http://localhost:3000/api/panico", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                cpf: usuario.cpf,
                chassi: usuario.chassi,
                linha: usuario.linha,
                latitude: lat,
                longitude: lon,
                endereco
            })
        });

        // ENVIAR E-MAIL (NOVO EmailJS)
        await enviarEmail(usuario, lat, lon, endereco);

        alert("Pânico enviado!");
    });
}

// OBTER ENDEREÇO PELO OSM
async function obterEndereco(lat, lon) {
    try {
        const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
        const j = await r.json();
        return j.display_name || "Endereço não encontrado";
    } catch {
        return "Erro ao buscar endereço";
    }
}

// ENVIAR EMAIL → via backend
async function enviarEmail(usuario, lat, lon, endereco) {
    try {
        await fetch("http://localhost:3000/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                cpf: usuario.cpf,
                chassi: usuario.chassi,
                linha: usuario.linha,
                latitude: lat,
                longitude: lon,
                endereco,
                mensagem: `🚨 BOTÃO DE PÂNICO ACIONADO!
CPF: ${usuario.cpf}
Linha: ${usuario.linha}
Chassi: ${usuario.chassi}
Lat/Lon: ${lat}, ${lon}
Endereço: ${endereco}`
            })
        });

        console.log("E-mail enviado!");
    } catch (err) {
        console.error("Erro ao enviar e-mail:", err);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    emailjs.init("Hx4D4KkKfCSUb_xQR");
});
