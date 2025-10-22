const closeSidebar = document.querySelector("#sidebar button")
const sidebar = document.querySelector('#sidebar')
const sidebarBackground = document.querySelector('#sidebarBackground')
const openSidebar = document.querySelector('#sidebarButton')
const root = document.querySelector(':root');
const emotionsButtons = document.querySelectorAll('.emotion')
const selectedEmotion = document.getElementById('selectedEmotion')

closeSidebar.addEventListener('click', ()=>{
    sidebar.classList.replace('sidebarOpened', 'sidebarClosed')
    sidebarBackground.style.display = "none"
    root.style.overflowY = 'scroll'
});

openSidebar.addEventListener('click', ()=>{
    sidebar.classList.replace('sidebarClosed', 'sidebarOpened')
    sidebarBackground.style.display = "block"
    root.style.overflowY = 'hidden'
})

sidebarBackground.addEventListener('click', ()=>{
    sidebar.classList.replace('sidebarOpened', 'sidebarClosed')
    sidebarBackground.style.display = "none"
    root.style.overflowY = 'scroll'
});

emotionsButtons.forEach((e)=>{
    e.addEventListener('click', changeSelectedEmotion)
})

function changeSelectedEmotion(){
    let emotionTarget;
    if(event.target.nodeName == "A"){
        emotionTarget = event.target;
    }else{
        emotionTarget = event.target.parentElement;
    }
    emotionsButtons.forEach((e)=>{
        if(e.classList.length > 1){
            e.classList.remove(e.id + "Selected")
        }
    })
    emotionTarget.classList.add(emotionTarget.id + "Selected")
    selectedEmotion.children[0].innerText = emotionTarget.children[0].innerText;
    selectedEmotion.children[1].innerHTML = `Você está se sentindo <b>${emotionTarget.children[1].innerText}</b> hoje`;
}