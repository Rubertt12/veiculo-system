// Máscara de CPF
function mascara(i) {
    let v = i.value;
    if (isNaN(v[v.length-1])) {
        i.value = v.substring(0, v.length-1);
        return;
    }
    i.setAttribute("maxlength", "14");
    if (v.length === 3 || v.length === 7) i.value += ".";
    if (v.length === 11) i.value += "-";
}

// Toggle modo escuro
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
}

// Persistência do modo escuro
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
    }
});

// Limpar campos
function limpar() {
    document.getElementById('cpf').value = '';
    document.getElementById('chassi').value = '';
    document.getElementById('linha').value = '';
}

// Login
async function login() {
    const cpf = document.getElementById('cpf').value;
    const chassi = document.getElementById('chassi').value;
    const linha = document.getElementById('linha').value;

    if (!cpf || !chassi || !linha) {
        alert("Preencha todos os campos!");
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cpf, chassi, linha })
        });
        const data = await res.json();

        if (data.success) {
            // Salva dados no sessionStorage para usar na tela de pânico
            sessionStorage.setItem('usuario', JSON.stringify({ cpf, chassi, linha }));
            window.location.href = 'alarme.html';
        } else {
            alert("Usuário não encontrado. Verifique CPF, Chassi e Linha.");
        }
    } catch (err) {
        console.error(err);
        alert("Erro ao conectar com o servidor.");
    }
}
