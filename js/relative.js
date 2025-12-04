const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
if (!usuarioLogado) {
    window.location.href = "./login.html";
}

if (usuarioLogado.tipo !== "familiar") {
    window.location.href = "./main.html";
}

const sidebarButton = document.getElementById("sidebarButton");

sidebarButton.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "./login.html";
});

const apiBase = `http://${window.location.hostname}:8000`; 

const selectRelative = document.getElementById("selectRelative");
const selectLogType = document.getElementById("selectLogType");
const searchResult = document.getElementById("searchResult");

let permissoesAtuais = []; // Guarda permissões carregadas

document.addEventListener("DOMContentLoaded", async () => {
    await carregarIdososPermitidos();
});

async function carregarIdososPermitidos() {
    try {
        const response = await fetch(`${apiBase}/compartilhamento/familiar/${usuarioLogado.id_usuario}?ativas=true`);
        if (!response.ok) throw new Error("Erro ao buscar permissões");

        const permissoes = await response.json();
        permissoesAtuais = permissoes; // Salva para filtrar depois

        const idososMap = new Map();
        for (const p of permissoes) {
            if (!idososMap.has(p.id_idoso)) {
                const respUser = await fetch(`${apiBase}/usuarios/${p.id_idoso}`);
                const userData = await respUser.json();
                idososMap.set(p.id_idoso, {
                    id: p.id_idoso,
                    nome: userData.nome,
                    tiposPermitidos: [p.tipo_dado]
                });
            } else {
                idososMap.get(p.id_idoso).tiposPermitidos.push(p.tipo_dado);
            }
        }

        preencherSelectIdosos(Array.from(idososMap.values()));

    } catch (error) {
        console.error(error);
        alert("Erro ao carregar compartilhamentos.");
    }
}

function preencherSelectIdosos(lista) {
    selectRelative.innerHTML = "<option value=''>Selecione um idoso</option>";
    lista.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.nome;
        option.dataset.tipos = item.tiposPermitidos.join(",");
        selectRelative.appendChild(option);
    });
}

// ------------------------------
// Buscar dados somente se compartilhado
// ------------------------------
selectRelative.addEventListener("change", executarBusca);
selectLogType.addEventListener("change", executarBusca);

async function executarBusca() {
    const idosoId = selectRelative.value;
    const tipoSelecionado = selectLogType.value;

    if (!idosoId) {
        searchResult.innerHTML = "<p>Selecione um idoso.</p>";
        return;
    }

    const option = selectRelative.options[selectRelative.selectedIndex];
    const tiposPermitidos = option.dataset.tipos.split(",");

    // Se a permissão for "emocao", tratar como "gratidao"
    let tipoFinal = tipoSelecionado;
    if (tiposPermitidos.includes("emocao") && tipoSelecionado === "gratidao") {
        tipoFinal = "gratidao";
    }

    // Verifica se o tipo selecionado está entre os compartilhados
    if (!tiposPermitidos.includes(tipoSelecionado) && !(tipoSelecionado === "gratidao" && tiposPermitidos.includes("emocao"))) {
        searchResult.innerHTML = "<p>Este tipo de dado não foi compartilhado com você.</p>";
        return;
    }

    await buscarDadosPorTipo(idosoId, tipoFinal);
}

// ------------------------------
// Rotas específicas
// ------------------------------
async function buscarDadosPorTipo(idosoId, tipo) {
    searchResult.innerHTML = "<p>Carregando...</p>";

    let endpoint = "";
    switch (tipo) {
        case "diario": endpoint = `/diarios/usuario/${idosoId}`; break;
        case "gratidao": endpoint = `/gratidoes/usuario/${idosoId}`; break;
        case "atividade": endpoint = `/atividades/usuario/${idosoId}`; break;
        case "lembrete": endpoint = `/lembretes/usuario/${idosoId}`; break;
        default: searchResult.innerHTML = "<p>Tipo inválido.</p>"; return;
    }

    try {
        const res = await fetch(`${apiBase}${endpoint}`);
        const dados = await res.json();
        mostrarResultados(dados, tipo);
    } catch (err) {
        console.error(err);
        searchResult.innerHTML = "<p>Erro ao buscar dados.</p>";
    }
}

// ------------------------------
// Exibir resultados
// ------------------------------
function mostrarResultados(lista, tipo) {
    searchResult.innerHTML = "";

    if (!lista || lista.length === 0) {
        searchResult.innerHTML = "<p>Nenhum dado encontrado para este usuário e tipo.</p>";
        return;
    }

    const idosoNome = selectRelative.options[selectRelative.selectedIndex]?.textContent || "Usuário";

    lista.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("resultBox");

        let content = "";
        switch (tipo) {
            case "diario":
                content = `
                    <p><strong>Idoso:</strong> ${idosoNome}</p>
                    <p><strong>Tipo:</strong> Diário</p>
                    <p><strong>Emoção:</strong> ${item.emocao || "-"}</p>
                    <p><strong>Texto:</strong> ${item.texto || "-"}</p>
                    <p><strong>Data:</strong> ${formatarData(item.data_registro)}</p>
                `;
                break;

            case "gratidao":
                content = `
                    <p><strong>Idoso:</strong> ${idosoNome}</p>
                    <p><strong>Tipo:</strong> Gratidão</p>
                    <p><strong>Texto:</strong> ${item.texto || "-"}</p>
                    <p><strong>Data:</strong> ${formatarData(item.data_registro)}</p>
                `;
                break;

            case "atividade":
                content = `
                    <p><strong>Idoso:</strong> ${idosoNome}</p>
                    <p><strong>Tipo:</strong> Atividade</p>
                    <p><strong>Nome:</strong> ${item.nome || "-"}</p>
                    <p><strong>Dias:</strong> ${formatarDiasDaSemana(item.dias_da_semana)}</p>
                    <p><strong>Horário:</strong> ${item.horario || "-"}</p>
                `;
                break;

            case "lembrete":
                content = `
                    <p><strong>Idoso:</strong> ${idosoNome}</p>
                    <p><strong>Tipo:</strong> Lembrete</p>
                    <p><strong>Mensagem:</strong> ${item.mensagem_do_lembrete || "-"}</p>
                    <p><strong>Data:</strong> ${formatarData(item.data_criacao)}</p>
                `;
                break;

            default:
                content = "<p>Tipo inválido.</p>";
        }

        div.innerHTML = content;
        searchResult.appendChild(div);
    });
}

// ------------------------------
// Funções auxiliares
// ------------------------------
function formatarData(dataStr) {
    if (!dataStr) return "-";
    const date = new Date(dataStr);
    return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function formatarDiasDaSemana(dias) {
    if (!dias) return "-";
    const diasArray = Array.isArray(dias) ? dias : [dias];
    const mapDias = {
        "sunday": "Domingo",
        "monday": "Segunda",
        "tuesday": "Terça",
        "wednesday": "Quarta",
        "thursday": "Quinta",
        "friday": "Sexta",
        "saturday": "Sábado"
    };
    return diasArray.map(d => mapDias[d.toLowerCase()] || d).join(", ");
}
