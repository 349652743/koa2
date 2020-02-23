const WebSocket = require('ws');
module.exports = function(server){
    const WebSocketServer = WebSocket.Server;

    // 实例化:
    const wss = new WebSocketServer({
        server: server
    });

    //广播
    const broadcast = function(type,message){//0代表文字消息 1代表文字消息+用户名单

        var data = {
            type:type,
            data:message,
            userlist:[]
        }
        wss.clients.forEach(function (ws) {
            data.userlist.push(ws.user);
        });
        
        wss.clients.forEach(function (ws) {
            ws.send(JSON.stringify(data));
        });
    }

    wss.on('connection',function (ws,req) {
        console.log(`[SERVER] connection()`);

        const ip = req.connection.remoteAddress;//获取ip
        ws.user = -1;
        broadcast(1,`有新用户加入，当前在线人数为${wss.clients.size}人`);
        //设置心跳检测
        
        ws.isAlive = true;
        ws.on('pong', function(){
            this.isAlive = true;
        });

        


        ws.on('message', function (data) {
            console.log(`[SERVER] Received: ${data}`);
            var data = JSON.parse(data);
            if(ws.user===-1){
                ws.user=data.username;
                broadcast(1,"");
            }else broadcast(0,data.username+":"+data.message);
            
        });

        ws.on('close', function (message) {
            console.log(`[SERVER] quit(): ${message}`);
            var message = `有用户退出，当前在线人数为${wss.clients.size}人`;
            broadcast(1,message);
        });
        
        ws.on('error',function () {
            console.log('error');
        })
    });
    const interval = setInterval(function ping() {//三十秒钟进行一次心跳检测
        wss.clients.forEach(function each(ws) {
            if (ws.isAlive === false) {
                console.log(ws.user+'heart_disconnected');
                var message = `有用户断开，当前在线人数为${wss.clients.size}人`;
                broadcast(message);
                return ws.close();
            }
            ws.isAlive = false;
            ws.ping(function(){});
        });
    }, 30000);
}