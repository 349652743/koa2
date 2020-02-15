const nunjucks = require('nunjucks');
const isProduction = process.env.NODE_ENV === 'production';

nunjucks.configure('./views', { autoescape: true ,noCache : !isProduction });

async function fn_index(ctx, next){
    ctx.response.body = nunjucks.render('index.html');
}
async function fn_signin(ctx, next){
    console.log(ctx.request.body);
    var password = ctx.request.body.password || '';
    var name = ctx.request.body.name || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    if (name === 'koa' && password === '12345') {
        ctx.response.body = nunjucks.render('signin-ok.html',{ name : 'Ning'});
    } else {
        ctx.response.body = nunjucks.render('signin-failed.html');
    }
}
module.exports = {
    'GET /' : fn_index,
    'POST /signin' : fn_signin
}
