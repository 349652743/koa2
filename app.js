const fs = require('fs');
const Koa = require('koa');
const path = require('path');
const WebSocket = require('ws');
const bodyParser = require('koa-bodyparser');
const isProduction = process.env.NODE_ENV === 'production';
var app = new Koa();
var files = fs.readdirSync(__dirname + '/controllers');

// 控制器
const controller = require('./controller.js');

//静态文件Koa-static
if (! isProduction) {
    let KoaStatic = require('koa-static');
    app.use(KoaStatic(path.join(__dirname,'./static')));
}

app.use(bodyParser());
app.use(controller());

const server =app.listen(3000);


// 引用Server类:
const WebSocketServer = WebSocket.Server;

// 实例化:
const wss = new WebSocketServer({
    server: server
});
wss.on('connection',function (ws,req) {
    console.log(`[SERVER] connection()`);
    //设置心跳检测
    ws.isAlive = true;
    ws.on('pong', function(){
        this.isAlive = true;
    });

    ws.on('message', function (message) {
        console.log(`[SERVER] Received: ${message}`);
        wss.clients.forEach(function(client){
            var number = wss.clients.size;
            var data = `当前在线人数为${number}人`;
            // console.log(message);
            client.send( message);
        });
    });

});

const interval = setInterval(function ping() {//三秒钟进行一次心跳检测
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate();
   
      ws.isAlive = false;
      ws.ping(noop);
    });
}, 30000);

wss.on('close', function close() {
    console.log('disconnected');
});
console.log('app started at port 3000...');
