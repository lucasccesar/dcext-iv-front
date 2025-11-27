const gratefulForm = document.getElementById("gratefulForm")
const gratefulInput = document.getElementById("gratefulInput")
const saveGratefulButton = document.getElementById("savegrateful")
const recordGratefulButton = document.getElementById("recordgrateful")
const recordGratefulButtonText = recordGratefulButton.querySelector("p")
const userGratefuls = document.getElementById("userGratefuls")

const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"))

/* INÍCIO DO CÓDIGO TEMPORÁRIO - simulação do banco com localStorage */
let gratefuls = JSON.parse(localStorage.getItem("gratefuls")) || []
renderGratefuls()
/* FIM DO CÓDIGO TEMPORÁRIO */

saveGratefulButton.addEventListener("click", (e) => {
    e.preventDefault()
    const texto = gratefulInput.value.trim()
    if (!texto) {
        alert("Escreva algo antes de salvar!")
        return
    }

    /* INÍCIO DO CÓDIGO TEMPORÁRIO - simulação do POST da API */
    const novoId = gratefuls.length ? gratefuls[gratefuls.length - 1].id_grateful + 1 : 1
    const grateful = {
        id_grateful: novoId,
        id_usuario: usuarioLogado.id_usuario,
        texto,
        data_registro: new Date().toISOString()
    }
    gratefuls.push(grateful)
    localStorage.setItem("gratefuls", JSON.stringify(gratefuls))
    renderGratefuls()
    /* FIM DO CÓDIGO TEMPORÁRIO */

    /*
    fetch("http://localhost:8000/grateful", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario: usuarioLogado.id_usuario, texto })
    })
    .then(res => res.json())
    .then(() => {
        renderGratefuls()
    })
    .catch(() => alert("Erro ao salvar gratidão"))
    */

    gratefulInput.value = ""
    alert("Gratidão salva com sucesso!")
})

function renderGratefuls() {
    userGratefuls.innerHTML = ""
    const p = document.createElement("p")
    p.innerText = "Histórico de Gratidão:"
    userGratefuls.appendChild(p)

    const userItems = gratefuls
        .filter(g => g.id_usuario === usuarioLogado.id_usuario)
        .sort((a, b) => new Date(b.data_registro) - new Date(a.data_registro))

    if (userItems.length === 0) {
        userGratefuls.innerHTML = "<p style='text-align:center;margin-top:20px;'>Nenhuma gratidão registrada ainda.</p>"
        return
    }

    userItems.forEach(item => {
        const div = document.createElement("div")
        div.classList.add("gratefulItem")

        const data = new Date(item.data_registro)
        const formatada = data.toLocaleDateString("pt-BR") + " " + data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

        div.innerHTML = `
        <p class="gratefulDate">${formatada}</p>
        <p class="gratefulText">${item.texto}</p>
        `
        userGratefuls.appendChild(div)
    })
}

let recognition
let isRecording = false

try {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition = new SpeechRecognition()
    recognition.lang = "pt-BR"
    recognition.interimResults = true
    recognition.continuous = true

    recognition.onresult = (event) => {
        let transcript = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript
        }
        gratefulInput.value = transcript
    }

    recognition.onerror = () => {
        isRecording = false
        recordGratefulButtonText.textContent = "Gravar áudio"
    }

    recognition.onend = () => {
        isRecording = false
        recordGratefulButtonText.textContent = "Gravar áudio"
    }

    recordGratefulButton.addEventListener("click", (e) => {
        e.preventDefault()
        if (!isRecording) {
            try {
                recognition.start()
                isRecording = true
                recordGratefulButtonText.textContent = "🎤 Gravando... Clique para parar"
            } catch {
                alert("Não foi possível iniciar o reconhecimento de voz neste dispositivo.")
            }
        } else {
            recognition.stop()
        }
    })

} catch {
    recordGratefulButton.addEventListener("click", (e) => {
        e.preventDefault()
        alert("Transcrição de voz não suportada neste dispositivo.")
    })
}
