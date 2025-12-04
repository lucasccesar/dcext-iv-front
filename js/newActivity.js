const form = document.getElementById("newActivityForm");
const nameInput = document.getElementById("activityName");
const timeInput = document.getElementById("time");

const API_URL = window.location.hostname + ":8000";

// Carregar o usuário logado do localStorage
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

if (!usuarioLogado) {
    alert("Usuário não encontrado. Faça login para continuar.");
    window.location.href = "./login.html";
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const time = timeInput.value;
    const dayInputs = document.querySelectorAll("input[name='day']:checked");
    const days = Array.from(dayInputs).map(d => d.value);

    // Validação dos campos
    if (!name || !time || days.length === 0) {
        alert("Preencha todos os campos!");
        return;
    }

    // Convertendo os dias da semana para uma string separada por vírgulas
    const daysString = days.join(",");  // Ex: "monday,tuesday"

    // Montando o objeto da atividade com os campos esperados pela API
    const activity = {
        id_usuario: usuarioLogado.id_usuario,
        nome: name,
        descricao: name,  // Pode ser o mesmo nome ou algo adicional
        tipo: "atividade padrão",  // Manter o tipo como uma string
        dias_da_semana: daysString,  // Enviar como string separada por vírgulas
        horario: time,
        ativo: true  // Definido como ativo
    };

    // Verificando os dados antes de enviar
    console.log("Atividade a ser enviada:", JSON.stringify(activity));

    try {
        // Enviar a atividade para a API
        const res = await fetch(`http://${API_URL}/atividades/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(activity)
        });

        if (!res.ok) {
            throw new Error("Erro ao salvar a atividade");
        }

        alert("Atividade salva com sucesso!");
        window.location.href = "./activities.html"; // Redireciona para a página de atividades

    } catch (err) {
        console.error("Erro ao salvar atividade:", err);
        alert("Erro ao salvar a atividade.");
    }
});
