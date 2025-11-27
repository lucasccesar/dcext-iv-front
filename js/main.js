const emotions = document.querySelectorAll(".emotion");
const selectedEmoji = document.getElementById("selectedEmoji");
const selectedText = document.getElementById("selectedText");
const selectedButton = document.getElementById("selectedButton");

let currentEmotion = null;

emotions.forEach(emotion => {
    emotion.addEventListener("click", (e) => {
        e.preventDefault();

        // Remove seleção anterior
        emotions.forEach(em => em.classList.remove("sadSelected", "neutralSelected", "happySelected", "inLoveSelected", "tiredSelected"));

        // Marca a nova seleção
        emotion.classList.add(`${emotion.id}Selected`);

        // Atualiza o display da emoção selecionada
        const emoji = emotion.querySelector(".emotionEmoji").textContent;
        const text = emotion.querySelector(".emotionText").textContent;

        selectedEmoji.textContent = emoji;
        selectedText.textContent = text;

        currentEmotion = text; // armazenar emoção em português
    });
});

// Configura o botão para abrir a página com a emoção selecionada
selectedButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (!currentEmotion) {
        alert("Selecione uma emoção antes de continuar!");
        return;
    }

    const url = `./diary.html?emocao=${encodeURIComponent(currentEmotion)}`;
    window.location.href = url;
});
