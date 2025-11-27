const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"))
const noActivities = document.getElementById("noActivities")
const myActivities = document.getElementById("myActivities")

/* ===== INÍCIO DO CÓDIGO TEMPORÁRIO ===== */
let tempActivities = JSON.parse(localStorage.getItem("tempActivities")) || []
renderActivities()
/* ===== FIM DO CÓDIGO TEMPORÁRIO ===== */

function renderActivities() {
    const items = tempActivities

    noActivities.style.display = items.length === 0 ? "flex" : "none"

    const oldItems = document.querySelectorAll(".userActivity")
    oldItems.forEach(el => el.remove())

    items.forEach(item => {
        const div = document.createElement("div")
        div.classList.add("userActivity")
        div.style.background = "white"
        div.style.border = "1px solid #bfcbd9"
        div.style.borderRadius = "5vw"
        div.style.padding = "5vw"
        div.style.display = "flex"
        div.style.flexDirection = "column"
        div.style.gap = "2vw"

        const daysText = item.days
            .map(d => translateDay(d))
            .join(", ")

        div.innerHTML = `
            <p style="font-size:calc(0.6rem + 0.7vw);color:#264770;">${item.name}</p>
            <p style="font-size:calc(0.6rem + 0.6vw);">${daysText}</p>
            <p style="font-size:calc(0.6rem + 0.6vw);opacity:0.6;">${item.time}</p>
        `

        myActivities.appendChild(div)
    })
}

function translateDay(d) {
    if (d === "monday") return "Segunda"
    if (d === "tuesday") return "Terça"
    if (d === "wednesday") return "Quarta"
    if (d === "thursday") return "Quinta"
    if (d === "friday") return "Sexta"
    if (d === "saturday") return "Sábado"
    return "Domingo"
}

/*
fetch("http://localhost:8000/activities/user/" + usuarioLogado.id_usuario)
    .then(res => res.json())
    .then(data => {
        tempActivities = data
        renderActivities()
    })
    .catch(() => {})
*/
