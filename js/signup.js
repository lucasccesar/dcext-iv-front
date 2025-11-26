const form = document.getElementById("formInput")
const nameInput = document.getElementById("nameInput")
const emailInput = document.getElementById("emailInput")
const passwordInput = document.getElementById("passwordInput")
const typeInput = document.getElementById("typeInput")

form.addEventListener("submit", async e => {
    e.preventDefault()

    const nome = nameInput.value.trim()
    const email = emailInput.value.trim()
    const senha = passwordInput.value.trim()

    if (!nome || !email || !senha) {
        alert("Preencha todos os campos.")
        return
    }

    // Limite de caracteres para bcrypt
    if (senha.length > 72) {
        alert("A senha deve ter no máximo 72 caracteres.")
        return
    }

    const data = {
        nome: nome,
        email: email,
        senha: senha,
        tipo: typeInput.value
    }

    if (!data.nome || !data.email || !data.senha) {
        alert("Preencha todos os campos.")
        return
    }

    console.log(data)

    try {
        const response = await fetch("http://127.0.0.1:8000/usuarios/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            const err = await response.json().catch(() => null)
            alert(err?.detail || "Erro ao criar conta.")
            return
        }

        alert("Conta criada com sucesso!")
        window.location.href = "./login.html"
    } catch {
        alert("Erro ao conectar ao servidor.")
    }
})
