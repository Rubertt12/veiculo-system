// ===============================
// MÁSCARA DE CPF
// ===============================
const cpfInput = document.getElementById("cpf");

cpfInput.addEventListener("input", function(e) {
    let value = e.target.value.replace(/\D/g, ""); // remove tudo que não é número
    if (value.length > 11) value = value.slice(0, 11); // limita a 11 dígitos

    // Formata: 123.456.789-00
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    e.target.value = value;
});

// ===============================
// FUNÇÃO LOGIN AJUSTADA
// ===============================
async function login() {
    const cpf = cpfInput.value.trim();
    const chassi = document.getElementById('chassi').value.trim();
    const linha = document.getElementById('linha').value.trim();

    // VALIDAÇÕES BÁSICAS
    if (!cpf || cpf.length !== 14) { // 14 caracteres com pontos e traço
        alert("Digite um CPF válido.");
        return;
    }
    if (!chassi) {
        alert("Digite o chassi.");
        return;
    }
    if (!linha) {
        alert("Digite a linha.");
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                cpf: cpf.replace(/\D/g, ""), // envia apenas números
                chassi, 
                linha 
            })
        });

        const data = await res.json();

        if (data.success) {
            sessionStorage.setItem("usuario", JSON.stringify(data.usuario));
            window.location.href = "alarme.html";
        } else {
            alert(data.message || "Dados incorretos.");
        }
    } catch (err) {
        console.error("Erro no login:", err);
        alert("Erro ao tentar fazer login. Tente novamente.");
    }
}
