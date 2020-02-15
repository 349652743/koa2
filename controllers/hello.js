const nunjucks = require('nunjucks');
const isProduction = process.env.NODE_ENV === 'production';
var fn_hello = async (ctx, next) => {
    var name = ctx.params.name;
    nunjucks.configure('./views', { autoescape: true ,noCache : !isProduction });
    ctx.response.body = nunjucks.render('hello.html', { name: 'fucker' });
};

module.exports = {
    'GET /hello/:name': fn_hello
};