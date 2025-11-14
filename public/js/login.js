async function login() {
    const cpf = document.getElementById('cpf').value;
    const chassi = document.getElementById('chassi').value;
    const linha = document.getElementById('linha').value;

    const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf, chassi, linha })
    });

    const data = await res.json();

    if (data.success) {
        sessionStorage.setItem("usuario", JSON.stringify(data.usuario));
        window.location.href = "alarme.html";
    } else {
        alert("Dados incorretos.");
    }
}
