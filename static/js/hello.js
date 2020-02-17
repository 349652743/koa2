var app = new Vue({
    el:"#app",
    delimiters: ['${', '}'],
    data:function(){
        return {
            message:'',
            text:''
        }
    },
    mounted:function(){
        this.ws = new WebSocket("ws://localhost:3000")
        this.ws.onopen = function () {
            console.log("连接成功")
        }
        var _this = this
        this.ws.onmessage = function (ev) {
            // var item = JSON.parse(ev.data)
            //_this.chatList.push(item)
            var newmessage = ev.data;
            _this.text += "\n·用户："+newmessage;
            console.log(ev.data)
        }
    },
    methods:{
        submit:function(){
                // var data = {
                // 	nickName: this.nickName,
                // 	content: this.content
                // }
                //将信息发送到后端
                this.ws.send(JSON.stringify(this.message))
                this.message='';
        }
    }
});