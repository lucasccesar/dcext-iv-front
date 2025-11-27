const form = document.querySelector("form");
const emailInput = form.querySelectorAll("input")[0];
const passwordInput = form.querySelectorAll("input")[1];

const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
if (usuarioLogado) {
    window.location.href = "./main.html";
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const senha = passwordInput.value.trim();

    if (!email || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    /* INÍCIO DO CÓDIGO TEMPORÁRIO - simulação de login com localStorage */
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuario = usuarios.find(u => u.email === email && u.senha === senha);

    if (!usuario) {
        alert("Email ou senha incorretos!");
        return;
    }

    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
    /* FIM DO CÓDIGO TEMPORÁRIO */

    /*
    fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
    })
    .then(res => res.json())
    .then(data => {
        localStorage.setItem("usuarioLogado", JSON.stringify(data));
        window.location.href = "./main.html";
    })
    .catch(err => alert("Erro ao logar: " + err));
    */

    window.location.href = "./main.html";
});
