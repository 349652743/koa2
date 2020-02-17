var app = new Vue({
    el:"#app",
    delimiters: ['${', '}'],
    data:function(){
        return {
            message:'',
            text:'',
            userlist:'',
            dialogVisible:true,
            username:''
        }
    },
    mounted:function(){
        var url =  String(window.location.href).substr(7);
        this.ws = new WebSocket("ws://"+url);
        this.ws.onopen = function () {
            console.log("连接成功")
        }
        var _this = this;
        this.ws.onmessage = function (ev) {
            var item = JSON.parse(ev.data)
            //_this.chatList.push(item)
            //console.log(item);
            if(item.type===0){
                _this.updatetext(item.data);
                //console.log(ev.data)
            }else if(item.type===1){
                _this.userlist='';
                for(user of item.userlist){
                    _this.userlist +="\n·"+user;
                }
                if(item.data!="")
                _this.updatetext(item.data);
            }
        }
    },
    methods:{
        submit:function(){
                var data = {
                	username: this.username,
                	message: this.message
                }
                //将信息发送到后端
                console.log(this.message);
                if(this.message===""){
                    this.$message('请不要输入空消息');
                }else {
                    this.ws.send(JSON.stringify(data));
                    this.message='';
                }
        },
        dialogclose:function(){
            this.dialogVisible=false;
            var data = {
                username: this.username,
                message: ''
            }
            //将信息发送到后端
            this.ws.send(JSON.stringify(data));
            this.message='';

        },
        updatetext:function(str){
            if(this.text===""){
                this.text+="·"+str;
            }else {
                this.text+='\n·'+str;
            }
        }
    }
});