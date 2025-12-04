const form = document.getElementById("formInput");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const typeInput = document.getElementById("typeInput");

// Se já está logado, redireciona
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
if (usuarioLogado) {
    window.location.href = "./main.html";
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = nameInput.value.trim();
    const email = emailInput.value.trim();
    const senha = passwordInput.value.trim();
    const tipo = typeInput.value;

    if (!nome || !email || !senha || !tipo) {
        alert("Preencha todos os campos!");
        return;
    }

    try {
        // 🔹 Chamada real para a API FastAPI
        const response = await fetch("http://dcext-iv-backend.onrender.com/usuarios/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha, tipo })
        });

        // Se a API retornar erro
        if (!response.ok) {
            const erro = await response.json();
            alert(erro.detail || "Erro ao criar conta!");
            return;
        }

        // Sucesso → retorna o usuário criado
        const usuario = await response.json();

        // Gravar sessão local
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

        alert("Conta criada com sucesso!");
        window.location.href = "./main.html";

    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao conectar com o servidor!");
    }
});
