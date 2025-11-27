const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
const mostMoodSpan = document.getElementById('mostMood');
const weeklyCtx = document.getElementById('weeklyChart').getContext('2d');
const emotionCtx = document.getElementById('emotionChart').getContext('2d');

/* ===== INÍCIO DO CÓDIGO TEMPORÁRIO ===== */
let diarios = JSON.parse(localStorage.getItem('diarios')) || [];
diarios = diarios.filter((d) => d.id_usuario === usuarioLogado.id_usuario);
/* ===== FIM DO CÓDIGO TEMPORÁRIO ===== */

/* ===== CÓDIGO PARA CONSUMO DA API (comentado) =====
fetch("http://localhost:8000/diarios/user/" + usuarioLogado.id_usuario)
    .then(res => res.json())
    .then(data => {
        diarios = data;
        renderHumor();
    })
    .catch(() => {})
===== FIM CÓDIGO API ===== */

function renderHumor() {
    if (diarios.length === 0) {
        mostMoodSpan.textContent = 'Nenhum registro';
        return;
    }

    const emotionCount = {};
    diarios.forEach((d) => {
        if (!emotionCount[d.emocao]) emotionCount[d.emocao] = 0;
        emotionCount[d.emocao]++;
    });
    const mostMoodEmoji = document.getElementById('mostMoodEmoji');

    const emotionMap = {
        triste: '😢',
        cansado: '😴',
        neutro: '😐',
        feliz: '😀',
        apaixonado: '😍',
    };

    const mostEmotion = Object.entries(emotionCount).sort((a, b) => b[1] - a[1])[0][0];
    mostMoodSpan.textContent = mostEmotion;
    mostMoodEmoji.textContent = emotionMap[mostEmotion] || '❓';

    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];

    diarios.forEach((d) => {
        const dayIndex = new Date(d.data_registro).getDay();
        dayCounts[dayIndex]++;
    });

    new Chart(weeklyCtx, {
        type: 'bar',
        data: {
            labels: weekDays,
            datasets: [
                {
                    label: 'Registros por dia',
                    data: dayCounts,
                    backgroundColor: '#2C5282',
                },
            ],
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0,
                        stepSize: 1,
                    },
                },
            },
        },
    });

    const emotions = ['triste', 'cansado', 'neutro', 'feliz', 'apaixonado'];
    const emotionData = emotions.map((e) => emotionCount[e] || 0);

    new Chart(emotionCtx, {
        type: 'pie',
        data: {
            labels: ['Triste', 'Cansado', 'Neutro', 'Feliz', 'Apaixonado'],
            datasets: [
                {
                    data: emotionData,
                    backgroundColor: ['#91c1ffff', '#debfffff', '#d8e5ffff', '#fff79eff', '#ffceeaff'],
                },
            ],
        },
        options: { responsive: true },
    });
}

renderHumor();
