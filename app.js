const fs = require('fs');

const keypath="ssl.key";
const crtpath="ssl.crt";
const port=3000;

const cfg = {
    port: port,
    ssl_key: keypath,
    ssl_cert: crtpath
};
function broadcast(data) {
    //所有的窗口都储存在connections里面，所以用循环把消息发给所有的窗口 
    connect.clients.forEach((connect) => { 								
        connect.send(data);  //sendText 服务端发送给客户端方法
    })
} 
const httpServ = require('https');
const WebSocketServer = require('ws').Server;
const processRequest = (req, res) => {
    res.writeHead(403);
    res.end('<h1>403 Forbideen.</h1>');
};
const app = httpServ.createServer({
    key: fs.readFileSync(cfg.ssl_key),
    cert: fs.readFileSync(cfg.ssl_cert)
}, processRequest).listen(cfg.port);
const connect = new WebSocketServer({
    server: app
});
connect.on('connection', function (ws) {
    console.log(`[SERVER] connection()`);
    ws.on('message', function (message) {
        broadcast(message);
        console.log(`[SERVER] Broadcast: ${message}`);
//        ws.send(`ECHO: ${message}`, (err) => {
//            if (err) {
//                console.log(`[SERVER] error: ${err}`);
//            }
//        });
    })
});