import {io} from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const socket = io();
const radius = 20;

let colorPicker = new iro.ColorPicker('#picker');
const colorPickerElement = document.getElementById("picker");

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

socket.on("update", (data) => {
    data.forEach((yMap, x, map) => {
       yMap.forEach((xMap, y, map) => {
            drawReceivedData({data})
       });
    });
});

document.addEventListener("keydown", e =>  {
    if (e.code !==  "ControlLeft") return;
    console.log(colorPicker.color.rgbString);
    colorPickerElement.style.visibility = "visible";
});

document.addEventListener("keyup", e =>  {
    if (e.code !==  "ControlLeft") return;
    colorPickerElement.style.visibility = "hidden";
});

let placing = false;
document.addEventListener("mousedown", e => {
    placing = true;
    place(e);
});

document.addEventListener("mouseup", e => {
    placing = false;
});

document.addEventListener("mousemove", e => {
    if (placing)
        place(e);
});

function place(e) {
    if (colorPickerElement.style.visibility === "visible")
        return;
    socket.emit("mouseDown", {
        "x": Math.round(e.clientX / radius) * radius,
        "y": Math.round(e.clientY / radius) * radius,
        "radius": radius,
        "color": colorPicker.color.rgbString
    });
}

function drawReceivedData(data) {
    data.forEach(shape => drawRect(shape.x, shape.y, shape.radius, shape.color));
}

function drawRect(x, y, radius, color) {
    ctx.beginPath();
    ctx.rect(x - (radius / 2), y - (radius / 2), radius, radius);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}