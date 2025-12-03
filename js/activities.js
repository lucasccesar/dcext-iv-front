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

        div.innerHTML = `
            <p style="font-size:calc(0.6rem + 0.7vw);color:#264770;">${item.nome}</p>
            <p style="font-size:calc(0.6rem + 0.6vw);">${daysText}</p>
            <p style="font-size:calc(0.6rem + 0.6vw);opacity:0.6;">${item.horario}</p>
        `;

        myActivities.appendChild(div);
    });
}

// Função para traduzir o dia da semana
function translateDay(d) {
    if (d === "monday") return "Segunda";
    if (d === "tuesday") return "Terça";
    if (d === "wednesday") return "Quarta";
    if (d === "thursday") return "Quinta";
    if (d === "friday") return "Sexta";
    if (d === "saturday") return "Sábado";
    return "Domingo";
}

// Carregar as atividades do usuário ao inicializar
loadUserActivities();
