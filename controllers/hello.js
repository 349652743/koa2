const nunjucks = require('nunjucks');
const isProduction = process.env.NODE_ENV === 'production';
var fn_hello = async (ctx, next) => {
    nunjucks.configure('./views', { autoescape: true ,noCache : !isProduction });
    ctx.response.body = nunjucks.render('hello.html');
};

module.exports = {
    'GET /chat': fn_hello
};