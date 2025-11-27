const diaryForm = document.getElementById("diaryForm");
const diaryInput = document.getElementById("diaryInput");
const saveDiaryButton = document.getElementById("saveDiary");
const recordDiaryButton = document.getElementById("recordDiary");
const recordDiaryButtonText = recordDiaryButton.querySelector("p");
const userDiariesContainer = document.getElementById("userDiaries");
const emotionSelect = document.getElementById("emotionSelect");

const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

/* ===== INÍCIO DO CÓDIGO TEMPORÁRIO ===== */
let diarios = JSON.parse(localStorage.getItem("diarios")) || [];

const urlParams = new URLSearchParams(window.location.search);
const urlEmotion = urlParams.get("emocao");
if (urlEmotion) emotionSelect.value = urlEmotion;

function renderUserDiaries() {
    userDiariesContainer.innerHTML = "";
    const p = document.createElement("p");
    p.innerText = "Meus Diários"
    userDiariesContainer.appendChild(p)

    const diariosUsuario = diarios
        .filter(d => d.id_usuario === usuarioLogado.id_usuario)
        .sort((a, b) => new Date(b.data_registro) - new Date(a.data_registro));

    if (diariosUsuario.length === 0) {
        userDiariesContainer.innerHTML = "<p>Você ainda não registrou nenhum diário.</p>";
        return;
    }

    diariosUsuario.forEach(d => {
        const div = document.createElement("div");
        div.className = "diaryLog";
        div.innerHTML = `
            <p class="diaryDate">${new Date(d.data_registro).toLocaleString()}</p>
            <p class="diaryText">${d.texto}</p>
            <p class="diaryEmotion">Emoção: ${d.emocao || "Não registrada"}</p>
        `;
        userDiariesContainer.appendChild(div);
    });
}

const hoje = new Date().toISOString().split("T")[0];
const diariosHoje = diarios
    .filter(d => d.id_usuario === usuarioLogado.id_usuario && d.data_registro.startsWith(hoje))
    .sort((a, b) => new Date(b.data_registro) - new Date(a.data_registro));

if (diariosHoje.length > 0) {
    diaryInput.value = diariosHoje[0].texto;
    if (diariosHoje[0].emocao) emotionSelect.value = diariosHoje[0].emocao;
}

renderUserDiaries();

saveDiaryButton.addEventListener("click", (e) => {
    e.preventDefault();
    const texto = diaryInput.value.trim();
    const emocao = emotionSelect.value;

    if (!texto) {
        alert("Escreva algo antes de salvar!");
        return;
    }

    const novoId = diarios.length ? diarios[diarios.length - 1].id_diario + 1 : 1;
    const novoDiario = {
        id_diario: novoId,
        id_usuario: usuarioLogado.id_usuario,
        texto,
        emocao,
        data_registro: new Date().toISOString()
    };

    diarios.push(novoDiario);
    localStorage.setItem("diarios", JSON.stringify(diarios));

    diaryInput.value = "";
    emotionSelect.value = "";
    renderUserDiaries();
    alert("Diário salvo com sucesso!");
});
/* ===== FIM DO CÓDIGO TEMPORÁRIO ===== */

/* ===== CÓDIGO PARA CONSUMO DA API (comentado) =====
fetch("http://localhost:8000/diarios/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_usuario: usuarioLogado.id_usuario, texto, emocao })
})
.then(res => res.json())
.then(data => console.log("Diário salvo:", data))
.catch(err => alert("Erro ao salvar diário: " + err));
*/
