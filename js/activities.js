const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
const noActivities = document.getElementById("noActivities");
const myActivities = document.getElementById("myActivities");

let activities = [];

// Função para carregar as atividades do usuário a partir da API
async function loadUserActivities() {
    try {
        const res = await fetch(`http://localhost:8000/atividades/usuario/${usuarioLogado.id_usuario}`);
        if (!res.ok) throw new Error("Erro ao buscar atividades");

        // Preencher a variável 'activities' com os dados da API
        activities = await res.json();
        renderActivities();
    } catch (err) {
        console.error("Erro ao carregar atividades:", err);
    }
}

// Função para renderizar as atividades na tela
function renderActivities() {
    const items = activities;

    // Exibe ou oculta a mensagem de "Sem Atividades"
    noActivities.style.display = items.length === 0 ? "flex" : "none";

    // Remove atividades antigas da tela
    const oldItems = document.querySelectorAll(".userActivity");
    oldItems.forEach(el => el.remove());

    // Renderiza cada atividade
    items.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("userActivity");
        div.style.background = "white";
        div.style.border = "1px solid #bfcbd9";
        div.style.borderRadius = "5vw";
        div.style.padding = "5vw";
        div.style.display = "flex";
        div.style.flexDirection = "column";
        div.style.gap = "2vw";

        // Dividir a string de dias separados por vírgula em um array
        const daysArray = item.dias_da_semana ? item.dias_da_semana.split(",") : [];

        // Mapear os dias da semana para o formato traduzido
        const daysText = daysArray
            .map(d => translateDay(d))
            .join(", ");

        // Adiciona o botão "Adicionar aos lembretes" com toggle
        const addToRemindersButtonText = item.isInReminders ? "notifications_off" : "notifications";

        div.innerHTML = `
            <p style="font-size:calc(0.6rem + 0.7vw);color:#264770;">${item.nome}</p>
            <p style="font-size:calc(0.6rem + 0.6vw);">${daysText}</p>
            <p style="font-size:calc(0.6rem + 0.6vw);opacity:0.6;">${item.horario}</p>
            <button class="addToRemindersButton">
                <span class="material-symbols-outlined">${addToRemindersButtonText}</span>
            </button>
        `;

        // Função que é chamada ao clicar no botão "Adicionar aos lembretes"
        const addToRemindersButton = div.querySelector(".addToRemindersButton");
        const addToRemindersButtonSpan = div.querySelector(".addToRemindersButton span");
        addToRemindersButton.addEventListener("click", async () => {
            const reminder = {
                id_usuario: usuarioLogado.id_usuario,
                id_atividade: item.id_atividade,
                mensagem_do_lembrete: item.nome,
                dias_da_semana: item.dias_da_semana,
                horario: item.horario,
                lido: false // Marca o lembrete como não lido inicialmente
            };

            try {
                // Verificar se já existe um lembrete para a atividade
                const resGet = await fetch(`http://localhost:8000/lembretes/usuario/${usuarioLogado.id_usuario}`);
                const reminders = await resGet.json();

                // Se a atividade já estiver nos lembretes, remove
                const existingReminder = reminders.find(rem => rem.id_atividade === item.id_atividade);
                if (existingReminder) {
                    const resDelete = await fetch(`http://localhost:8000/lembretes/${existingReminder.id_lembrete}`, {
                        method: "DELETE",
                    });
                    if (resDelete.ok) {
                        item.isInReminders = false;  // Atualiza a atividade para não estar nos lembretes
                        addToRemindersButtonSpan.innerText = "notifications"; // Alterar o texto do botão
                        alert("Lembrete removido com sucesso!");
                    } else {
                        throw new Error("Erro ao remover lembrete");
                    }
                } else {
                    // Caso contrário, adiciona o lembrete
                    const resAdd = await fetch("http://localhost:8000/lembretes/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(reminder)
                    });

                    if (!resAdd.ok) {
                        throw new Error("Erro ao adicionar lembrete");
                    }

                    item.isInReminders = true;  // Atualiza a atividade para estar nos lembretes
                    addToRemindersButtonSpan.innerText = "notifications_off"; // Alterar o texto do botão
                    alert("Lembrete adicionado com sucesso!");
                }
            } catch (err) {
                console.error("Erro ao adicionar/remover lembrete:", err);
                alert("Erro ao adicionar/remover lembrete.");
            }
        });

        myActivities.appendChild(div);
    });
}

// Função para traduzir o dia da semana
function translateDay(d) {
    if (d === "monday") return "Segunda-feira";
    if (d === "tuesday") return "Terça-feira";
    if (d === "wednesday") return "Quarta-feira";
    if (d === "thursday") return "Quinta-feira";
    if (d === "friday") return "Sexta-feira";
    if (d === "saturday") return "Sábado";
    return "Domingo";  // Se for domingo
}

// Carregar as atividades do usuário ao inicializar
loadUserActivities();
