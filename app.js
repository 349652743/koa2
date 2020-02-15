const fs = require('fs');
const Koa = require('Koa');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const isProduction = process.env.NODE_ENV === 'production';
var app = new Koa();
var files = fs.readdirSync(__dirname + '/controllers');

// 控制器
const controller = require('./controller.js');

//静态文件Koa-static
if (! isProduction) {
    let KoaStatic = require('Koa-static');
    app.use(KoaStatic(path.join(__dirname,'./static')));
}

app.use(bodyParser());
app.use(controller());

app.listen(3000);
console.log('app started at port 3000...');
