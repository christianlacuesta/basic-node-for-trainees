const app = require("./app");
const http = require('http');

const { debug } = require('console');


const normalizePort = val => {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        //pipe
        return val;
    }

    if (port >= 0) {
        //port
        return port;
    }

    return false;
}

const onError = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind  = typeof port === "string" ? "pipe " + port : "port " + port;
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
        default:
            throw error;     
    }

};

const onListening = () => {
    const addr = server.address();
    const bind = typeof port === "string" ? "pipe " + port: "port " + port;
    debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);