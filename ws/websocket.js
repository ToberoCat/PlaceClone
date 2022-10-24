const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const socket = require('socket.io');

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
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());


        this.server = this.app.listen(port, () => {
            console.log(`Websocket listening on port ${this.server.address().port}`);
        });

        this.io = socket(this.server);
        this.registerRoots();
    }

    registerRoots() {
        this.app.get('/', (req, res) => {
            res.render('index', {
                title: "Hello"
            });
        });

        this.io.on('connection', this.userConnect);
    }

    userConnect(socket) {
        socket.on("message", (data) => {
            console.log(data);
        })
    }
}

module.exports = WebSocket;
