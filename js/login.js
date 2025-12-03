const form = document.querySelector("form");
const emailInput = form.querySelectorAll("input")[0];
const passwordInput = form.querySelectorAll("input")[1];

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
        const response = await fetch("http://localhost:8000/usuarios/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        // Se a API responder erro (401, 404 etc)
        if (!response.ok) {
            const erro = await response.json().catch(() => null);
            alert(erro?.detail || "Email ou senha incorretos!");
            return;
        }

        // Usuário autenticado
        const usuario = await response.json();

        // Salvar sessão
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

        // Redirecionar
        window.location.href = "./main.html";

    } catch (error) {
        console.error(error);
        alert("Erro ao conectar com o servidor!");
    }
});
