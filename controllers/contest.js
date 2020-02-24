const jwt = require('jsonwebtoken');
const serect = "custacm";
const Sequelize = require('sequelize');
const sequelize = new Sequelize('database_development', 'root', '123456', {
    host: 'localhost',
    dialect:'mysql'
  });
const User = require('../models/user.js')(sequelize,Sequelize);
const Contest = require('../models/contest.js')(sequelize,Sequelize);

async function addContest(ctx, next){//添加比赛
    var token = ctx.request.body.token;
    var reqData = ctx.request.body.contest;
    var resData = {status:400};
    console.log(reqData.endTime);
    try{
        var decoded = await jwt.verify(token, serect);
    }catch(err){
        status = 400;
    }
    if(decoded){
        // console.log(reqData);
        reqData.id = null;
        await Contest.create(reqData).then(contest => {
            console.log("user's auto-generated ID:", contest.id);
            resData.status= 200;
            resData.id = contest.id;
        });
    }
    ctx.response.type = 'application/json';
    ctx.response.body = resData;
}
async function editContestStatus(ctx, next){//修改比赛状态
    var token = ctx.request.body.token;
    var reqData = ctx.request.body.contest;
    var resData = {status:400};
    try{
        var decoded = await jwt.verify(token, serect);
    }catch(err){
        status = 400;
    }
    if(decoded){
        // console.log(reqData);
        await Contest.update({ openRegister: reqData.openRegister }, {
            where: {
            id: reqData.id
        }
        }).then(() => {
            resData.status=200;
        });
    }
    ctx.response.type = 'application/json';
    ctx.response.body = resData;
}
async function deleteContest(ctx, next){//删除比赛
    var token = ctx.request.body.token;
    var reqData = ctx.request.body.contest;
    var resData = {status:400};
    try{
        var decoded = await jwt.verify(token, serect);
    }catch(err){
        status = 400;
    }
    if(decoded){
        // console.log(reqData);
        await Contest.destroy({
            where: {
              id: reqData.id
            }
        }).then(() => {
            resData.status=200;
        });
    }
    ctx.response.type = 'application/json';
    ctx.response.body = resData;
}
async function getContest(ctx, next){//获取比赛列表
    var token = ctx.request.body.token;
    var resData = {status:400,contestlist:[]};
    try{
        var decoded = await jwt.verify(token, serect);
    }catch(err){
        status = 400;
    }
    if(decoded){
         await Contest.findAll().then(contestlist => {
            resData.contestlist = JSON.parse(JSON.stringify(contestlist,null,4));
            resData.status = 200;
        });
    }
    ctx.response.type = 'application/json';
    ctx.response.body = resData;
}
async function editContest(ctx, next){//修改比赛
    var token = ctx.request.body.token;
    var reqData = ctx.request.body.contest;
    var resData = {status:400};
    try{
        var decoded = await jwt.verify(token, serect);
    }catch(err){
        status = 400;
    }
    if(decoded){
        // console.log(reqData);
        console.log(reqData.contestName);
        await Contest.update({contestName:reqData.contestName,endTime:reqData.endTime}, {
            where: {
            id: reqData.id
        }
        }).then(() => {
            resData.status=200;
        });
    }
    ctx.response.type = 'application/json';
    ctx.response.body = resData;
}
async function queryContest(ctx, next){//获取比赛
    var reqData = ctx.request.body.contest;
    var resData = {status:400};
    await Contest.findOne({where:{id:reqData.contestId}}).then(contest=> {
        var contest = JSON.parse(JSON.stringify(contest,null,4));
        
        resData.contest = contest;
        resData.status = 200;
    });
    
    // console.log(resData);
    ctx.response.type = 'application/json';
    ctx.response.body = resData;
}
module.exports = {
    'POST /api/addContest' : addContest,
    'POST /api/editContestStatus' : editContestStatus,
    'POST /api/deleteContest' : deleteContest,
    'POST /api/getContest' : getContest,
    'POST /api/editContest' : editContest,
    'POST /api/queryContest': queryContest
}
