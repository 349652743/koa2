const fs = require('fs');
const Koa = require('koa');
const path = require('path');
const cors = require('koa2-cors');
const WebSocket = require('./websocker.js');
const bodyParser = require('koa-bodyparser');
const isProduction = process.env.NODE_ENV === 'production';
var app = new Koa();

// 控制器
var files = fs.readdirSync(__dirname + '/controllers');
const controller = require('./controller.js');

//静态文件Koa-static
if (! isProduction) {
    let KoaStatic = require('koa-static');
    app.use(KoaStatic(path.join(__dirname,'./static')));
}

app.use(bodyParser());
app.use(cors({ //处理跨域服务 
    origin: function (ctx) {
        return '*';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  }));
app.use(controller());

const server = app.listen(3000);

WebSocket(server);//聊天室服务共用3000端口

console.log('app started at port 3000...');
