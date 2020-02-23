const jwt = require('jsonwebtoken');
const serect = "custacm";
const Sequelize = require('sequelize');
const sequelize = new Sequelize('database_development', 'root', '123456', {
    host: 'localhost',
    dialect:'mysql'
  });
const User = require('../models/user.js')(sequelize,Sequelize);
const Contest = require('../models/contest.js')(sequelize,Sequelize);

async function addUser(ctx, next){//添加用户
    // var token = ctx.request.body.token;
    var reqData = ctx.request.body.user;
    var resData = {status:400};
    console.log(reqData);
    // try{
    //     var decoded = await jwt.verify(token, serect);
    // }catch(err){
    //     status = 400;
    // }
    // if(decoded){
        // console.log(reqData);
    reqData.id = null;
    reqData.haveQueried = false;
    await User.create(reqData).then(user => {
        console.log("user's auto-generated ID:", user.id);
        resData.status= 200;
        resData.id = user.id;
    });
    // }
    ctx.response.type = 'application/json';
    ctx.response.body = resData;
}
async function editUserStatus(ctx, next){//修改用户状态
    var token = ctx.request.body.token;
    var reqData = ctx.request.body.user;
    // console.log(reqData);
    var resData = {status:400};
    try{
        var decoded = await jwt.verify(token, serect);
    }catch(err){
        status = 400;
    }
    if(decoded){
        try{
        await User.update({ haveQueried: reqData.haveQueried }, {
            where: {
            id: reqData.id
        }
        }).then(() => {
            resData.status=200;
        });
        }catch(err){
            console.log(err);
        }   
    }
    ctx.response.type = 'application/json';
    ctx.response.body = resData;
}
async function deleteUser(ctx, next){//删除用户
    var token = ctx.request.body.token;
    var reqData = ctx.request.body.user;
    var resData = {status:400};
    // console.log(reqData);
    try{
        var decoded = await jwt.verify(token, serect);
    }catch(err){
        status = 400;
    }
    if(decoded){
        // console.log(reqData);
        await User.destroy({
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
async function getUser(ctx, next){//获取用户列表
    var token = ctx.request.body.token;
    var resData = {status:400,userlist:[]};
    try{
        var decoded = await jwt.verify(token, serect);
    }catch(err){
        status = 400;
    }
    if(decoded){
        var contestlist = [];
        await Contest.findAll().then(contests => {
            contestlist = JSON.parse(JSON.stringify(contests,null,4)); 
        });
        // console.log(contestlist);
        for(contest of contestlist){
            await User.findAll({ where: { contestId: contest.id } }).then(userlist => {
                contest.userlist  = JSON.parse(JSON.stringify(userlist,null,4)); 
            });
        }
        // console.log(contestlist);
        resData.contestlist = contestlist;
        resData.status = 200;
    }
    // console.log(resData);
    ctx.response.type = 'application/json';
    ctx.response.body = resData;
}
async function editUser(ctx, next){//修改用户
    var token = ctx.request.body.token;
    var reqData = ctx.request.body.user;
    var resData = {status:400};
    try{
        var decoded = await jwt.verify(token, serect);
    }catch(err){
        status = 400;
    }
    if(decoded){
        // console.log(reqData);
        await User.update({name:reqData.name,
            sex:reqData.sex,
            studentId:reqData.studentId,
            department:reqData.department,
            username:reqData.username,
            password:reqData.password,
            contestId:reqData.contestId}, {
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
async function queryUser(ctx, next){//获取用户
    var reqData = ctx.request.body.user;
    var resData = {status:400};
    console.log(reqData);
    await User.findOne({where:{studentId:reqData.studentId}}).then(user => {
        var user = JSON.parse(JSON.stringify(user,null,4));
        if(user.haveQueried!==true){//这里需要查询一下用户是否存在，待填坑
            resData.user = user;
            resData.status = 200;
        }
    });
    await User.update({ haveQueried: 1 }, {
        where: {
        studentId:reqData.studentId
    }
    });
    // console.log(resData);
    ctx.response.type = 'application/json';
    ctx.response.body = resData;
}
module.exports = {
    'POST /api/addUser' : addUser,
    'POST /api/editUserStatus' : editUserStatus,
    'POST /api/deleteUser' : deleteUser,
    'POST /api/getUser' : getUser,
    'POST /api/editUser' : editUser,
    'POST /api/queryUser': queryUser
}
