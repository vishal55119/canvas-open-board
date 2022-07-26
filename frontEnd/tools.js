let optionsCont = document.querySelector(".options-cont");

let toolsCont = document.querySelector(".tools-cont");
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let pencilFlag = false;
let eraserFlag = false;
let sticky = document.querySelector(".sticky");
let upload = document.querySelector(".upload");


let optionsFlag = true;

// true ->> tools show
// false ->> tools hide

optionsCont.addEventListener("click", (e) => {
    optionsFlag = !optionsFlag;

    if (optionsFlag) openTools();
    else closeTools();
})

function openTools() {
    let iconElem = optionsCont.children[0];
    iconElem.classList.remove("fa-xmark");
    iconElem.classList.add("fa-bars");
    toolsCont.style.display = "flex";
}

function closeTools() {
    let iconElem = optionsCont.children[0];
    iconElem.classList.remove("fa-bars");
    iconElem.classList.add("fa-xmark");
    toolsCont.style.display = "none";
    pencilToolCont.style.display = "none";
    eraserToolCont.style.display = "none";
    pencilFlag = false;
    eraserFlag = false;
}

pencil.addEventListener("click", (e) => {
    pencilFlag = !pencilFlag;
    
    if (pencilFlag) {
        pencilToolCont.style.display = "block";
        
        
    }
    else {
        pencilToolCont.style.display = "none";
    }
})

eraser.addEventListener("click", (e) => {
    eraserFlag = !eraserFlag;
    
    if (eraserFlag) {
        eraserToolCont.style.display = "flex";
        
        
    }
    else {
        eraserToolCont.style.display = "none";
    }
})

sticky.addEventListener("click", (e) => {
    let stickyHtml = `
    <div class="header-cont">
            <div class="minimize">
                <i class="fa-solid fa-minus"></i>
            </div>
            <div class="remove">
                <i class="fa-solid fa-xmark"></i>
            </div>
        </div>
        <div class="note-cont">
            <textarea spellcheck = "false" ></textarea>
        </div>
    `;

    createSticky(stickyHtml);
})

function noteAction(minimize, remove, stickyCont) {
    remove.addEventListener("click", (e) => {
        stickyCont.remove();
    })
    minimize.addEventListener("click", (e) => {
        let noteCont = stickyCont.querySelector(".note-cont");
        let display = getComputedStyle(noteCont).getPropertyValue("display");
        if (display === "none") noteCont.style.display = "block";
        else noteCont.style.display = "none";
    })
}

function dragAndDrop(stickyCont, event) {
    let shiftX = event.clientX - stickyCont.getBoundingClientRect().left;
    let shiftY = event.clientY - stickyCont.getBoundingClientRect().top;

    stickyCont.style.position = 'absolute';
    stickyCont.style.zIndex = 1000;
    // document.body.append(ball);

    moveAt(event.pageX, event.pageY);

    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        stickyCont.style.left = pageX - shiftX + 'px';
        stickyCont.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the ball, remove unneeded handlers
    stickyCont.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        stickyCont.onmouseup = null;
    };
}

upload.addEventListener("click", (e) => {
    // Open File Explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickyHtml = `
        <div class="header-cont">
            <div class="minimize">
                <i class="fa-solid fa-minus"></i>
            </div>
            <div class="remove">
                <i class="fa-solid fa-xmark"></i>
            </div>
        </div>
        <div class="note-cont">
            <img src="${url}"/>
        </div>
    `;
        createSticky(stickyHtml);
    })
})

function createSticky(stickyHtml) {
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont");
    stickyCont.innerHTML = stickyHtml;

    document.body.appendChild(stickyCont);

    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");

    noteAction(minimize, remove, stickyCont);

    stickyCont.onmousedown = function (event) {

        dragAndDrop(stickyCont, event);

    };

    stickyCont.ondragstart = function () {
        return false;
    };
}
