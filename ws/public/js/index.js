import {io} from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const socket = io();

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

socket.on("update", (data) => drawReceivedData(data));

document.addEventListener('mousemove', e => {
    socket.emit("mouseDown", {
        "x": e.clientX,
        "y": e.clientY,
        "radius": 20,
        "color": `rgb(${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)})`
    });
});

function drawReceivedData(data) {
    data.forEach(shape => drawCircle(shape.x, shape.y, shape.radius, shape.color));
}

function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.rect(x - (radius / 2), y - (radius / 2), radius, radius);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}