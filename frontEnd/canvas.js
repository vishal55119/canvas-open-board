
let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let tool = canvas.getContext("2d"); // API


// tool.strokeStyle = "blue";
// tool.lineWidth = "3";

let mouseDown = false;

let pencilColorElem = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");

let penColor = "red";
let eraserColor = "white";

let penWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

let download = document.querySelector(".download");

let undoRedoTracker = []; //Data
let track = 0;  // Represents which action from tracker array

let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");

// tool.beginPath(); // new graphic line (path)
// tool.moveTo(100, 300); // start point
// tool.lineTo(300, 200); // end point 
// tool.stroke() // fill color // fill graphics

canvas.addEventListener("mousedown", (e) => {
    mouseDown = true;
    let strokeObj = {
        x: e.clientX,
        y: e.clientY
    }
    // beginPath(strokeObj);

    let data = strokeObj;
    socket.emit("beginPath", data);
})

canvas.addEventListener("mousemove", (e) => {
    let strokeObj = {
        x: e.clientX,
        y: e.clientY,
        color: eraserFlag ? eraserColor : penColor,
        width: eraserFlag ? eraserWidth : penWidth
    }
    let data = strokeObj;
    if (mouseDown) {
        // drawStroke(strokeObj);
        socket.emit("drawStroke", data);
    }
})

canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;

    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1;
})

function beginPath(strokeObj) {
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}

function drawStroke(strokeObj) {
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}

pencilColorElem.forEach((colorElem) => {
    colorElem.addEventListener("click", (e) => {
        let color = colorElem.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    })
})

pencilWidthElem.addEventListener("change", (e) => {
    penWidth = pencilWidthElem.value;
    tool.lineWidth = penWidth;
    tool.strokeStyle = penColor;
})

eraserWidthElem.addEventListener("change", (e) => {
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
    tool.strokeStyle = eraserColor;
})

eraser.addEventListener("click", (e) => {
    if (eraserFlag) {
        eraserWidth = eraserWidthElem.value;
        tool.lineWidth = eraserWidth;
        tool.strokeStyle = eraserColor;
    }
    else {
        penWidth = pencilWidthElem.value;
        tool.lineWidth = penWidth; 
        tool.strokeStyle = penColor;
    }
})

download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();
    
    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})

undo.addEventListener("click", (e) => {
    if (track >= 0) track--;
    let trackObj = {
        track,
        undoRedoTracker
    }
    // undoRedoCanvas(trackObj);
    let data = trackObj;
    socket.emit("undoRedoCanvas", data);
})

redo.addEventListener("click", (e) => {
    if (track <= undoRedoTracker.length - 1) track++;
    let trackObj = {
        track,
        undoRedoTracker
    }
    // undoRedoCanvas(trackObj);
    let data = trackObj;
    socket.emit("undoRedoCanvas", data);
})

function undoRedoCanvas(trackObj) {
    track = trackObj.track;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];
    let img = new Image(); // new image reference element
    tool.clearRect(0, 0, canvas.width, canvas.height);
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

socket.on("beginPath", (data) => {
    //data ->> data from server
    beginPath(data);
})

socket.on("drawStroke", (data) => {
    drawStroke(data);
})

socket.on("undoRedoCanvas", (data) => {
    undoRedoCanvas(data);
})


