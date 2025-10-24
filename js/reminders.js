const markAsRead = document.querySelectorAll('.markAsRead')

markAsRead.forEach(e => {
    e.addEventListener('click', markAsReadFunc)
});

function markAsReadFunc(){
    let target;
    if(event.target.nodeName != "BUTTON"){
        target = event.target.parentElement
    } else{
        target = event.target
    }
    let targetParent = target.parentElement.parentElement;
    if(targetParent.classList.length == 1){
        targetParent.classList.add('reminderRead')
        targetParent.lastElementChild.firstElementChild.firstElementChild.innerText = "notifications"
        targetParent.lastElementChild.firstElementChild.lastElementChild.innerText = "Reativar"
    } else{
        targetParent.classList.remove('reminderRead')
        targetParent.lastElementChild.firstElementChild.lastElementChild.innerText = "Marcar como lido"
        targetParent.lastElementChild.firstElementChild.firstElementChild.innerText = "check"
    }
}
