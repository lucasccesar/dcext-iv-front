const gratefulForm = document.getElementById("gratefulForm");
const gratefulInput = document.getElementById("gratefulInput");
const saveGratefulButton = document.getElementById("savegrateful");
const userGratefuls = document.getElementById("userGratefuls");

const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
const API_URL = "http://localhost:8000";

async function loadUserGratefuls() {
    try {
        const res = await fetch(`${API_URL}/gratidoes/usuario/${usuarioLogado.id_usuario}`);
        if (!res.ok) throw new Error("Erro ao buscar gratidão");

        const gratefuls = await res.json();
        renderGratefuls(gratefuls);

    } catch (err) {
        console.error("Erro ao carregar gratidão:", err);
    }
}

function renderGratefuls(gratefuls) {
    userGratefuls.innerHTML = "<p>Histórico de Gratidão:</p>";

    if (gratefuls.length === 0) {
        userGratefuls.innerHTML += "<p style='text-align:center;margin-top:20px;'>Nenhuma gratidão registrada ainda.</p>";
        return;
    }

    gratefuls
        .sort((a, b) => new Date(b.data_registro) - new Date(a.data_registro))
        .forEach(item => {
            const div = document.createElement("div");
            div.classList.add("gratefulItem");

            const data = new Date(item.data_registro);
            const formatada = data.toLocaleDateString("pt-BR") + " " + data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

            div.innerHTML = `
                <p class="gratefulDate">${formatada}</p>
                <p class="gratefulText">${item.texto}</p>
            `;
            userGratefuls.appendChild(div);
        });
}

saveGratefulButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const texto = gratefulInput.value.trim();
    if (!texto) {
        alert("Escreva algo antes de salvar!");
        return;
    }

    const payload = {
        id_usuario: usuarioLogado.id_usuario,
        texto: texto
    };

    try {
        const res = await fetch(`${API_URL}/gratidoes/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Erro ao salvar gratidão");

        gratefulInput.value = "";
        alert("Gratidão salva com sucesso!");

        loadUserGratefuls();

    } catch (err) {
        console.error(err);
        alert("Erro ao salvar gratidão.");
    }
});

loadUserGratefuls();
