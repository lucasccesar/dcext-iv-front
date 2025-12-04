const diaryForm = document.getElementById("diaryForm");
const diaryInput = document.getElementById("diaryInput");
const saveDiaryButton = document.getElementById("saveDiary");
const userDiariesContainer = document.getElementById("userDiaries");
const emotionSelect = document.getElementById("emotionSelect");

const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

const API_URL = window.location.hostname + ":8000";

const urlParams = new URLSearchParams(window.location.search);
const urlEmotion = urlParams.get("emocao");
if (urlEmotion) emotionSelect.value = urlEmotion;

async function loadUserDiaries() {
    try {
        const res = await fetch(`http://${API_URL}/diarios/usuario/${usuarioLogado.id_usuario}`);
        if (!res.ok) throw new Error("Erro ao buscar diários");

        const diarios = await res.json();

        renderUserDiaries(diarios);

        const hoje = new Date().toISOString().split("T")[0];
        const diariosHoje = diarios.filter(d => d.data_registro.startsWith(hoje));

        if (diariosHoje.length > 0) {
            diaryInput.value = diariosHoje[0].texto;
            if (diariosHoje[0].emocao) emotionSelect.value = diariosHoje[0].emocao;
        }

    } catch (err) {
        console.error("Erro ao carregar diários:", err);
    }
}

function renderUserDiaries(diarios) {
    userDiariesContainer.innerHTML = "<p>Meus Diários</p>";

    if (!diarios.length) {
        userDiariesContainer.innerHTML = "<p>Você ainda não registrou nenhum diário.</p>";
        return;
    }

    console.log(diarios)

    diarios
        .sort((a, b) => new Date(b.data_registro) - new Date(a.data_registro))
        .forEach(d => {
            const dataBanco = new Date(d.data_registro);
            dataBanco.setHours(dataBanco.getHours() + 3);

            const localDateString = dataBanco.toLocaleString();

            const div = document.createElement("div");
            div.className = "diaryLog";
            div.innerHTML = `
                <p class="diaryDate">${localDateString}</p>
                <p class="diaryText">${d.texto}</p>
                <p class="diaryEmotion">Emoção: ${d.emocao || "Não registrada"}</p>
            `;
            userDiariesContainer.appendChild(div);
        });
}

saveDiaryButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const texto = diaryInput.value.trim();
    const emocao = emotionSelect.value;

    if (!texto) {
        alert("Escreva algo antes de salvar!");
        return;
    }

    const dataLocal = new Date();

    dataLocal.setHours(dataLocal.getHours() - 3);

    const dataComAjuste = dataLocal.toISOString();

    const payload = {
        id_usuario: usuarioLogado.id_usuario,
        texto,
        emocao,
        data_registro: dataComAjuste
    };

    console.log(payload);

    try {
        const res = await fetch(`http://${API_URL}/diarios/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Erro ao salvar diário");

        diaryInput.value = "";
        emotionSelect.value = "";

        loadUserDiaries();

        alert("Diário salvo com sucesso!");

    } catch (err) {
        console.error(err);
        alert("Erro ao salvar diário.");
    }
});

loadUserDiaries();
