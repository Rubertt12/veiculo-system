// ===============================
// MODO ESCURO
// ===============================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
}

document.addEventListener('DOMContentLoaded', () => {
    // ===== MODO ESCURO =====
    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // ===== CHECAR LOGIN =====
    const usuarioRaw = sessionStorage.getItem("usuario");
    if (!usuarioRaw) {
        // Nenhum usuário logado, volta pra login
        window.location.href = "index.html";
        return;
    }

    try {
        JSON.parse(usuarioRaw); // só pra validar JSON
    } catch (e) {
        sessionStorage.removeItem("usuario");
        window.location.href = "index.html";
        return;
    }
});

// ===============================
// INICIALIZA EMAILJS
// ===============================
emailjs.init("Hx4D4KkKfCSUb_xQR"); // substitua pelo seu User ID do EmailJS

// ===============================
// FUNÇÃO PRINCIPAL DO BOTÃO DE PÂNICO
// ===============================
async function panico() {

    // ==== CARREGAR USUÁRIO ====
    const usuarioRaw = sessionStorage.getItem("usuario");
    if (!usuarioRaw) {
        alert("Usuário não logado!");
        window.location.href = "index.html";
        return;
    }

    let usuario;
    try {
        usuario = JSON.parse(usuarioRaw);
    } catch (e) {
        alert("Erro ao carregar usuário. Faça login novamente.");
        sessionStorage.removeItem("usuario");
        window.location.href = "index.html";
        return;
    }

    // ==== CHECAR GEOLOCALIZAÇÃO ====
    if (!("geolocation" in navigator)) {
        alert("Geolocalização não suportada.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async function (position) {

        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);

        document.getElementById("latitude").value = lat;
        document.getElementById("longitude").value = lon;

        const endereco = await obterEndereco(lat, lon);
        document.getElementById("endereco").value = endereco;

        // ===============================
        // SALVAR NO BANCO (BACKEND)
        // ===============================
        try {
            await fetch("/api/panico", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cpf: usuario.cpf,
                    chassi: usuario.chassi,
                    linha: usuario.linha,
                    latitude: lat,
                    longitude: lon,
                    endereco: endereco
                })
            });
        } catch (err) {
            console.error("Erro ao salvar evento:", err);
        }

        // ===============================
        // ENVIAR EMAIL VIA EMAILJS (FRONTEND)
        // ===============================
        try {
            const resultado = await emailjs.send(
                'service_thylr79',   // Substitua pelo seu Service ID
                'template_lkc1ooe',  // Substitua pelo seu Template ID
                {
                    cpf: usuario.cpf,
                    chassi: usuario.chassi,
                    linha: usuario.linha,
                    latitude: lat,
                    longitude: lon,
                    endereco: endereco,
                    message: "Alerta de pânico!"
                }
            );
            console.log("EMAIL ENVIADO:", resultado.text);
        } catch (e) {
            console.error("Erro ao enviar email:", e);
        }

        alert("Alerta de pânico enviado com sucesso!");

    }, function (error) {
        alert("Erro ao obter localização: " + error.message);
    });

}

// ===============================
// OPENSTREETMAP – PEGAR ENDEREÇO
// ===============================
async function obterEndereco(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data.display_name || "Endereço não encontrado";
    } catch (e) {
        return "Erro ao obter endereço";
    }
}
