const API_URL = window.location.hostname + ':8000';

const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
if (!usuarioLogado) {
    alert('Usuário não encontrado. Faça login para continuar.');
    window.location.href = './login.html';
}

let userDiaries = await getUserDiary();
let userGratefuls = await getUserGrateful();
let userActivities = await getUserActivities();
let userReminders = await getUserReminders();

let userToShare;
let logType;

async function getUserDiary() {
    let diariesRes = await fetch(`http://${API_URL}/diarios/usuario/${usuarioLogado.id_usuario}`);
    return await diariesRes.json();
}

async function getUserGrateful() {
    let gratefulsRes = await fetch(`http://${API_URL}/gratidoes/usuario/${usuarioLogado.id_usuario}`);
    return await gratefulsRes.json();
}

async function getUserActivities() {
    let activitiesRes = await fetch(`http://${API_URL}/atividades/usuario/${usuarioLogado.id_usuario}`);
    return await activitiesRes.json();
}

async function getUserReminders() {
    let reminderRes = await fetch(`http://${API_URL}/lembretes/usuario/${usuarioLogado.id_usuario}`);
    return await reminderRes.json();
}

// Função para buscar o usuário pelo e-mail
async function fetchUserByEmail(email) {
    try {
        const response = await fetch(`http://${API_URL}/usuarios/email/${email}`);
        if (response.ok) {
            const userData = await response.json();
            return userData;
        } else {
            alert('Usuário não encontrado com esse e-mail.');
            return null;
        }
    } catch (error) {
        console.error('Erro ao buscar o usuário:', error);
        alert('Houve um erro na busca. Tente novamente.');
        return null;
    }
}

// Event listener para o formulário de busca
document.getElementById('userShare').addEventListener('submit', async (event) => {
    event.preventDefault();
    const emailInput = document.getElementById('email').value;
    if (!emailInput) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }

    userToShare = await fetchUserByEmail(emailInput);
    if (userToShare) {
        console.log('Usuário encontrado:', userToShare);
        document.getElementById('userSharing').innerHTML = `Compartilhando com: <b>${userToShare.nome}</b>`;
    }
});

function renderShareOption() {
    document.querySelectorAll('.shareType')[0].lastElementChild.innerText = `(${userDiaries.length})`;
    document.querySelectorAll('.shareType')[0].addEventListener('click', () => {
        logType = 'diario';
        if(document.querySelector('.shareTypeSelected') != null){
            document.querySelector('.shareTypeSelected').classList.remove('shareTypeSelected')
        }
        document.querySelectorAll('.shareType')[0].classList.add('shareTypeSelected')
    });
    document.querySelectorAll('.shareType')[1].lastElementChild.innerText = `(${userGratefuls.length})`;
    document.querySelectorAll('.shareType')[1].addEventListener('click', () => {
        logType = 'emocao';
        if(document.querySelector('.shareTypeSelected') != null){
            document.querySelector('.shareTypeSelected').classList.remove('shareTypeSelected')
        }
        document.querySelectorAll('.shareType')[1].classList.add('shareTypeSelected')
    });
    document.querySelectorAll('.shareType')[2].lastElementChild.innerText = `(${userActivities.length})`;
    document.querySelectorAll('.shareType')[2].addEventListener('click', () => {
        logType = 'atividade';
        if(document.querySelector('.shareTypeSelected') != null){
            document.querySelector('.shareTypeSelected').classList.remove('shareTypeSelected')
        }
        document.querySelectorAll('.shareType')[2].classList.add('shareTypeSelected')
    });
    document.querySelectorAll('.shareType')[3].lastElementChild.innerText = `(${userReminders.length})`;
    document.querySelectorAll('.shareType')[3].addEventListener('click', () => {
        logType = 'lembrete';
        if(document.querySelector('.shareTypeSelected') != null){
            document.querySelector('.shareTypeSelected').classList.remove('shareTypeSelected')
        }
        document.querySelectorAll('.shareType')[3].classList.add('shareTypeSelected')
    });
}

renderShareOption();

document.getElementById('shareButton').addEventListener('click', async () => {

    if (!logType) {
        alert("Selecione um tipo de dado para compartilhar.");
        return;
    }

    if (!userToShare) {
        alert("Selecione um usuário para compartilhar.");
        return;
    }

    const body = {
        id_idoso: usuarioLogado.id_usuario,
        id_familiar: userToShare.id_usuario,
        tipo_dado: logType,       // DIARIO | GRATIDAO | ATIVIDADE | LEMBRETE
        pode_ler: true,
        pode_ver: true
    };

    try {
        const response = await fetch(`http://${API_URL}/compartilhamento/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Compartilhamento criado:", result);
            alert("Compartilhamento realizado com sucesso!");
        } else {
            const err = await response.json();
            console.error(err);
            alert("Erro ao compartilhar: " + (err.detail || "Verifique os dados."));
        }

    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro ao tentar compartilhar. Tente novamente.");
    }

});