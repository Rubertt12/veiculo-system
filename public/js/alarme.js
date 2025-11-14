document.addEventListener("DOMContentLoaded", () => {
    emailjs.init("Hx4D4KkKfCSUb_xQR");
});

// Dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Botão de pânico
async function panico() {
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    if (!usuario) {
        alert("Faça login novamente.");
        window.location.href = "index.html";
        return;
    }

    navigator.geolocation.getCurrentPosition(async pos => {
        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);

        document.getElementById("latitude").value = lat;
        document.getElementById("longitude").value = lon;

        const endereco = await obterEndereco(lat, lon);
        document.getElementById("endereco").value = endereco;

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

        enviarEmail(usuario, lat, lon, endereco);

        alert("Alerta enviado!");
    });
}

async function obterEndereco(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.display_name || "Endereço não encontrado";
}

function enviarEmail(usuario, lat, lon, endereco) {
    emailjs.send("service_thylr79", "template_lkc1ooe", {
        cpf: usuario.cpf,
        chassi: usuario.chassi,
        linha: usuario.linha,
        latitude: lat,
        longitude: lon,
        endereco: endereco,
        mensagem: `BOTÃO DE PÂNICO ATIVADO!\nLinha: ${usuario.linha}\nChassi: ${usuario.chassi}\nLocalização: ${lat}, ${lon}\nEndereço:\n${endereco}`
    })
    .then(() => console.log("Email enviado"))
    .catch(err => console.error("Erro:", err));
}
