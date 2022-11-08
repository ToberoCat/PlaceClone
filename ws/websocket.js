const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const socket = require('socket.io');

const paths = new Map();
let io;

class WebSocket {

    constructor(port) {
        this.port = port;
        this.app = express();

        this.app.engine('hbs', hbs.engine({
            extname: "hbs",
            defaultLayout: "layout",
            layoutsDir: __dirname + "/layouts"
        }));

        this.app.set('views', path.join(__dirname, "views"));
        this.app.set('view engine', "hbs");
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(bodyParser.json());


        this.server = this.app.listen(port, () => {
            console.log(`Websocket listening on port ${this.server.address().port}`);
        });

        io = socket(this.server);
        this.registerRoots();
    }

    registerRoots() {
        this.app.get('/', (req, res) => {
            res.render('index', {
                title: "Hello"
            });
        });

        io.on('connection', this.userConnect);
    }

    userConnect(socket) {
        socket.emit("update", paths);
        socket.on("mouseDown", (data) => {
            const shape = {
                "radius": data.radius,
                "color": data.color
            };
            if (!paths.has(data.x))
                paths[data.x] = new Map();
            paths[data.x][data.y] = shape;
            io.emit("update", [shape]);
        })
    }
}

module.exports = WebSocket;
