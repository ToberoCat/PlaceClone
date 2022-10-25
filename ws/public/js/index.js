import {io} from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const socket = io();

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

socket.on("update", drawReceivedData);

document.addEventListener('mousedown', e => {
    socket.emit("mouseDown", {
        "x": e.clientX,
        "y": e.clientY,
        "radius": 25,
        "color": "green"
    });
});

function drawReceivedData(data) {
    ctx.beginPath();
    data.forEach(shape => drawCircle(shape.x, shape.y, shape.radius, shape.color));
    ctx.closePath();
}

function drawCircle(x, y, radius, color) {
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}