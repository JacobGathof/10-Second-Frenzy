const express = require("express");
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 3000;

app.use('/', express.static(path.join(__dirname, "/../")));

app.get("/", (req, res)=>{
    res.sendFile("index.html");
});

io.on('connection', function(socket){
    console.log("A user connected");
    
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        new ChatMessage(0,0,msg);
    });
});

http.listen(port, function(){
    console.log('listening on *:3000');
});


class ChatMessage{

    constructor(to, from, msg){
        this.to = to;
        this.from = from;
        this.msg = msg;
        this.id = 
        this.sendMessage(msg);
        setTimeout(()=>{
            this.selfDestruct(this.msg);
        }, 5000);
    }

    sendMessage(msg){
        io.emit('chat message', msg);
    }

    selfDestruct(msg){
        io.emit('destroy', msg);
    }
}
