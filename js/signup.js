const form = document.getElementById("formInput");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const typeInput = document.getElementById("typeInput");

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

    if (!nome || !email || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    /* INÍCIO DO CÓDIGO TEMPORÁRIO - simulação de cadastro com localStorage */
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (usuarios.some(u => u.email === email)) {
        alert("Email já cadastrado!");
        return;
    }

    const novoId = usuarios.length ? usuarios[usuarios.length - 1].id_usuario + 1 : 1;
    const novoUsuario = {
        id_usuario: novoId,
        nome,
        email,
        senha,
        tipo,
        data_criacao: new Date().toISOString()
    };

    usuarios.push(novoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    localStorage.setItem("usuarioLogado", JSON.stringify(novoUsuario));
    /* FIM DO CÓDIGO TEMPORÁRIO */

    /*
    const response = await fetch("http://localhost:8000/usuarios/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, tipo })
    });
    const data = await response.json();
    console.log("Usuário criado:", data);
    */

    alert("Conta criada com sucesso!");
    window.location.href = "./main.html";
});
