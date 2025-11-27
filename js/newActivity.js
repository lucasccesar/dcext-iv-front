const form = document.getElementById("newActivityForm");
const nameInput = document.getElementById("activityName");
const timeInput = document.getElementById("time");

form.addEventListener("submit", e => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const time = timeInput.value;
    const dayInputs = document.querySelectorAll("input[name='day']:checked");
    const days = Array.from(dayInputs).map(d => d.value);

    if (!name || !time || days.length === 0) {
        alert("Preencha todos os campos!");
        return;
    }

    const activity = {
        name,
        days,
        time
    };

    /* CONSUMO REAL DA API
    fetch("http://localhost:8000/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activity)
    })
    .then(res => res.json())
    .then(data => {
        alert("Atividade salva com sucesso!");
        window.location.href = "./activities.html";
    })
    .catch(() => alert("Erro ao salvar atividade!"));
    */

    /* ====== INÍCIO DO CÓDIGO TEMPORÁRIO (REMOVER DEPOIS) ====== */
    const tempActivities = JSON.parse(localStorage.getItem("tempActivities")) || [];
    tempActivities.push(activity);
    localStorage.setItem("tempActivities", JSON.stringify(tempActivities));

    alert("Atividade salva com sucesso!");
    window.location.href = "./activities.html";
    /* ====== FIM DO CÓDIGO TEMPORÁRIO (REMOVER DEPOIS) ====== */
});
