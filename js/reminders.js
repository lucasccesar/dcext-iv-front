const remindersContainer = document.getElementById("reminders")
const remindersActive = document.querySelector("#remindersActive .remindersNum")
const remindersDone = document.querySelector("#remindersDone .remindersNum")

/* ===== INÍCIO DO CÓDIGO TEMPORÁRIO ===== */
let reminders = JSON.parse(localStorage.getItem("tempActivities")) || []
reminders = reminders.map(r => ({ ...r, done: r.done || false }))
renderReminders()
/* ===== FIM DO CÓDIGO TEMPORÁRIO ===== */

function renderReminders() {
    remindersContainer.innerHTML = ""

    let activeCount = 0
    let doneCount = 0

    const now = new Date()
    const weekDaysEN = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]
    const weekDaysPT = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"]
    const todayIndex = now.getDay()

    reminders.forEach((reminder) => {
        // encontra o próximo dia da semana da atividade em relação a hoje
        const reminderDaysIndex = reminder.days.map(d => weekDaysEN.indexOf(d.toLowerCase()))
        if (reminderDaysIndex.length === 0) return

        let minDiff = 7
        let nextDayIndex = reminderDaysIndex[0]
        reminderDaysIndex.forEach(d => {
            let diff = (d - todayIndex + 7) % 7
            if (diff < minDiff) {
                minDiff = diff
                nextDayIndex = d
            }
        })

        const div = document.createElement("div")
        div.classList.add("reminder")
        if (reminder.done) div.classList.add("reminderRead") 

        const [hours, minutes] = reminder.time.split(":").map(Number)
        let displayDay = weekDaysPT[nextDayIndex]
        let displayTime = reminder.time

        div.innerHTML = `
            <div class="reminderDesc">
                <div class="reminderDescDiv">
                    <span class="material-symbols-outlined">${reminder.done ? "notifications" : "notifications"}</span>
                    <p>${reminder.name}</p>
                </div>
                <div class="activityDuration">
                    <span class="material-symbols-outlined">nest_clock_farsight_analog</span>
                    <p>${displayDay} - ${displayTime}</p>
                </div>  
            </div>
            <div class="reminderButtons">
                <button class="markAsRead reminderButton">
                    <span class="material-symbols-outlined">${reminder.done ? "notifications" : "check"}</span>
                    <p>${reminder.done ? "Reativar" : "Marcar como concluído"}</p>
                </button>
                <button class="delete reminderButton">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        `

        const markBtn = div.querySelector(".markAsRead")
        markBtn.addEventListener("click", () => {
            reminder.done = !reminder.done
            localStorage.setItem("tempActivities", JSON.stringify(reminders))
            renderReminders()
        })

        const delBtn = div.querySelector(".delete")
        delBtn.addEventListener("click", () => {
            reminders.splice(reminders.indexOf(reminder), 1)
            localStorage.setItem("tempActivities", JSON.stringify(reminders))
            renderReminders()
        })

        remindersContainer.appendChild(div)

        if (reminder.done) doneCount++
        else activeCount++
    })

    remindersActive.textContent = activeCount
    remindersDone.textContent = doneCount
}

/* ===== CÓDIGO PARA CONSUMO DA API (comentado) =====
fetch("http://localhost:8000/reminders/user/" + usuarioLogado.id_usuario)
    .then(res => res.json())
    .then(data => {
        reminders = data
        reminders = reminders.map(r => ({ ...r, done: r.done || false }))
        renderReminders()
    })
    .catch(() => {})
*/
