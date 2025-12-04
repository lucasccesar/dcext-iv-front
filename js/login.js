const form = document.querySelector("form");
const emailInput = form.querySelectorAll("input")[0];
const passwordInput = form.querySelectorAll("input")[1];

const API_URL = window.location.hostname + ":8000";

// Se já está logado, redireciona
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
if (usuarioLogado) {
    window.location.href = "./main.html";
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const senha = passwordInput.value.trim();

    if (!email || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    try {
        // Chamada ao endpoint de login
        const response = await fetch(`http://${API_URL}/usuarios/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        // 🔹 Se a resposta chegou (mesmo que erro 401)
        if (response.ok) {
            const usuario = await response.json();
            localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
            window.location.href = "./main.html";
            return;
        }

        // 🔹 Se o servidor respondeu erro
        const erro = await response.json().catch(() => null);
        alert(erro?.detail || "Email ou senha incorretos!");
        return;

    } catch (error) {
        console.warn("Servidor offline. Entrando em modo de teste...");

        // 🔹 MODO TESTE: simula login sem backend
        const usuarioFake = {
            nome: "Usuário Teste",
            email: email
        };

        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioFake));
        window.location.href = "./main.html";
    }
});
