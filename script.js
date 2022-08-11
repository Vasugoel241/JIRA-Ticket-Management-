let addBtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".remove-btn");
let modalCont = document.querySelector(".modal-cont");
let mainCont = document.querySelector(".main-cont");
let textAreaCont = document.querySelector(".textarea-cont");
let toolBoxColors = document.querySelectorAll(".color");

let allPriorityColors = document.querySelectorAll(".priority-color");
let colors = ["red", "orange", "green", "blue"];
let modalPriorityColor = colors[colors.length - 1];

let addFlag = false;
let removeFlag = false;

let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";

let ticketsArr = [];

//Listener for Color Filtering
for (let i = 0; i < toolBoxColors.length; i++) {
    toolBoxColors[i].addEventListener("click", (e) => {
        let currentToolBoxColor = toolBoxColors[i].classList[0];

        let filteredTicket = ticketsArr.filter((ticketObj, idx) => {
            return currentToolBoxColor === ticketObj.ticketColor;
        })

        //  Remove previous ticket
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for (let i = 0; i < allTicketsCont.length; i++) {
            allTicketsCont[i].remove();
        }

        //  Display new filtered tickets
        filteredTicket.forEach((ticketObj, idx) => {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketId);
        })
    })

    toolBoxColors[i].addEventListener("dblclick", (e) => {
        //  Remove previous tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for (let i = 0; i < allTicketsCont.length; i++) {
            allTicketsCont[i].remove();
        }

        ticketsArr.forEach((ticketObj) => {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketId);
        })
    })
}

// Listener for Modal Priority colouring
allPriorityColors.forEach((colorElem, idx) => {
    colorElem.addEventListener("click", (e) => {
        
        allPriorityColors.forEach((priorityColorElem, idx) => {
            priorityColorElem.classList.remove("border")
        })

        colorElem.classList.add("border");
        modalPriorityColor = colorElem.classList[0];
    })
});

addBtn.addEventListener("click", (e) => {
    //Display Modal
    //Generate Ticket

    // addFlag = true [Modal Display]
    // addFlag = false [Modal Remove]

    addFlag = !addFlag;
    console.log(addFlag);
    if (addFlag) {
        setModalToDefault();
        modalCont.style.display = "flex";
    } else {
        modalCont.style.display = "none";
    }
});

removeBtn.addEventListener("click", (e) => {
    removeFlag = !removeFlag
})

modalCont.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key === "Shift") {
        createTicket(modalPriorityColor, textAreaCont.value);
        addFlag = false;
        setModalToDefault();
    }
})

function createTicket(ticketColor, ticketTask, ticketId) {
    let id = ticketId || shortid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `
        <div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">#${id}</div>
        <div class="task-area">${ticketTask}</div>
        <div class="ticket-lock">
            <i class="fa-solid fa-lock"></i>
        </div>
    `;
    mainCont.appendChild(ticketCont);

    //Create object of ticket and add to array (for color filtering)
    if (!ticketId) {
        ticketsArr.push({ ticketColor, ticketTask, ticketId: id });
    }

    handelRemoval(ticketCont);
    handelLock(ticketCont);
    handelColor(ticketCont);
}

function handelRemoval(ticket) {
    // RemoveFlag = true => Remove
    if (removeFlag)
        ticket.remove();
}

function handelLock(ticket) {
    let ticketLockElem = ticket.querySelector(".ticket-lock");
    let ticketTaskArea = ticket.querySelector(".task-area")
    let ticketLock = ticketLockElem.children[0];
    ticketLock.addEventListener("click", (e) => {
        if (ticketLock.classList.contains(lockClass)) {
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskArea.setAttribute("contenteditable", true);
        } else {
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable", false);
        }
    })
}

function handelColor(ticket) {
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click", (e) => {
        //get ticket current color
        let currentTicketColor = ticketColor.classList[1];

        //get ticket color index
        let currentTicketColorIdx = colors.findIndex((color) => {
            return currentTicketColor === color;
        })
        currentTicketColorIdx++; //go to the next color
        let newTicketColorIdx = currentTicketColorIdx % colors.length;
        let newTicketColor = colors[newTicketColorIdx];

        // Remove prev color
        ticketColor.classList.remove(currentTicketColor);
        // Set new color
        ticketColor.classList.add(newTicketColor);
    })
}

function setModalToDefault() {
    modalCont.style.display = "none";
    textAreaCont.value = "";
    modalPriorityColor = colors[colors.length - 1];
    
    allPriorityColors.forEach((priorityColorElem, idx) => {
        priorityColorElem.classList.remove("border")
    })

    allPriorityColors[allPriorityColors.length - 1].classList.add("border");
}