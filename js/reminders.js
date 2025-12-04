const remindersContainer = document.getElementById("reminders");
const remindersActive = document.querySelector("#remindersActive .remindersNum");
const remindersDone = document.querySelector("#remindersDone .remindersNum");

const API_URL = window.location.hostname + ":8000";

// Carregar o usuário logado do localStorage
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

if (!usuarioLogado) {
    alert("Usuário não encontrado. Faça login para continuar.");
    window.location.href = "./login.html";
}

let reminders = []; // Inicializando a variável 'reminders'

// Função para carregar os lembretes do usuário a partir da API
async function loadUserReminders() {
    try {
        const res = await fetch(`http://${API_URL}/lembretes/usuario/${usuarioLogado.id_usuario}`);
        if (!res.ok) throw new Error("Erro ao buscar lembretes");

        // Preencher a variável 'reminders' com os dados da API
        reminders = await res.json();

        // Carregar as atividades associadas a cada lembrete
        for (let reminder of reminders) {
            const activityRes = await fetch(`http://${API_URL}/atividades/${reminder.id_atividade}`);
            if (!activityRes.ok) {
                console.error(`Erro ao carregar a atividade para o lembrete ${reminder.id_lembrete}`);
                continue;
            }

            // Adicionando os dados da atividade no lembrete, incluindo o horário
            reminder.atividade = await activityRes.json();
        }

        renderReminders();
    } catch (err) {
        console.error("Erro ao carregar lembretes:", err);
    }
}

// Função para renderizar os lembretes na tela
// Função para renderizar os lembretes na tela
function renderReminders() {
    remindersContainer.innerHTML = "";

    let activeCount = 0;
    let doneCount = 0;

    const now = new Date();
    const weekDaysEN = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const weekDaysPT = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    const todayIndex = now.getDay();

    reminders.forEach((reminder) => {
        const activity = reminder.atividade; // Acessando a atividade associada ao lembrete

        if (!activity || !activity.dias_da_semana || typeof activity.dias_da_semana !== "string") {
            console.error("Lembrete sem dias da semana válidos:", reminder);
            return;  // Ignore este lembrete caso não tenha dias válidos
        }

        // Mapeando os dias da semana da atividade para índices
        const reminderDaysIndex = activity.dias_da_semana
            .split(",")
            .map(d => weekDaysEN.indexOf(d.trim().toLowerCase()));

        // Filtrar os dias para pegar apenas os que são depois ou iguais ao dia de hoje
        const futureDays = reminderDaysIndex.filter(dayIndex => dayIndex >= todayIndex);

        // Se não houver dias válidos no futuro, pegamos os próximos dias da próxima semana
        if (futureDays.length === 0) {
            futureDays.push(...reminderDaysIndex); // Todos os dias, se não houver próximos no mês
        }

        // Encontrar o próximo dia mais próximo
        const nextDayIndex = futureDays.reduce((prev, curr) => {
            return (curr - todayIndex + 7) % 7 < (prev - todayIndex + 7) % 7 ? curr : prev;
        });

        const div = document.createElement("div");
        div.classList.add("reminder");
        if (reminder.lido) div.classList.add("reminderRead");

        const [hours, minutes] = activity.horario.split(":").map(Number); // Usando o horário da atividade
        const displayDay = weekDaysPT[nextDayIndex]; // Exibindo o próximo dia encontrado
        let displayTime = activity.horario; // Usando o horário da atividade

        div.innerHTML = `
            <div class="reminderDesc">
                <div class="reminderDescDiv">
                    <span class="material-symbols-outlined">${reminder.lido ? "notifications" : "notifications"}</span>
                    <p>${reminder.mensagem_do_lembrete}</p>
                </div>
                <div class="activityDuration">
                    <span class="material-symbols-outlined">nest_clock_farsight_analog</span>
                    <p>${displayDay} - ${displayTime}</p>
                </div>  
            </div>
            <div class="reminderButtons">
                <button class="markAsRead reminderButton">
                    <span class="material-symbols-outlined">${reminder.lido ? "notifications" : "check"}</span>
                    <p>${reminder.lido ? "Reativar" : "Marcar como concluído"}</p>
                </button>
                <button class="delete reminderButton">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        `;

        const markBtn = div.querySelector(".markAsRead");
        markBtn.addEventListener("click", async () => {
            reminder.lido = !reminder.lido;
            try {
                const res = await fetch(`http://${API_URL}/lembretes/${reminder.id_lembrete}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ lido: reminder.lido })
                });
                if (!res.ok) throw new Error("Erro ao atualizar lembrete");
                renderReminders();
            } catch (err) {
                console.error("Erro ao salvar lembrete:", err);
                alert("Erro ao salvar lembrete.");
            }
        });

        const delBtn = div.querySelector(".delete");
        delBtn.addEventListener("click", async () => {
            try {
                const res = await fetch(`http://${API_URL}/lembretes/${reminder.id_lembrete}`, {
                    method: "DELETE",
                });
                if (!res.ok) throw new Error("Erro ao excluir lembrete");
                reminders = reminders.filter(r => r.id_lembrete !== reminder.id_lembrete);
                renderReminders();
            } catch (err) {
                console.error("Erro ao excluir lembrete:", err);
                alert("Erro ao excluir lembrete.");
            }
        });

        remindersContainer.appendChild(div);

        if (reminder.lido) doneCount++;
        else activeCount++;
    });

    remindersActive.textContent = activeCount;
    remindersDone.textContent = doneCount;
}

// Carregar os lembretes do usuário ao inicializar
loadUserReminders();
