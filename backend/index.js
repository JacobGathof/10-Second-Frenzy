const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);

require('./models/user');
const USER = mongoose.model('User');

const port = 3000;
const users = [];
let globalId = 0;

const dbURI = 'mongodb://user:user@ds243085.mlab.com:43085/ten-second-frenzy';
mongoose.connect(dbURI, {
    useMongoClient: true
}, (err, res) => {
    if (err) {
        console.log(`ERROR connecting to ${dbURI}. ${err}`);
    } else {
        console.log(`Successfully connected to ${dbURI}.`);
    }
});


app.get("/", (req, res)=>{
    console.log("Here");
    res.sendFile("login.html", { root: __dirname + "/../"});
});

app.use('/', express.static(path.join(__dirname, "/../")));

io.on('connection', function(socket){

    socket.on('booyakasha', function(name){
        addUser(name, socket);
    });

    socket.on('disconnect', function(){
        removeUser(socket);
    });

    socket.on('register', function(name, username, password){
        console.log("User Registered");
        USER.create({
            name: name,
            username: username,
            password : password,
            friends: [],
        });
    }); 

    function loginCallback(err, user){
        if(err){
            console.log(err);
        }
        else{
            const foundUser = user;
            console.log(foundUser);
            socket.emit('sendUserBack', foundUser);
        }
    }

    socket.on('login', function(username, password){
        USER.find({username: username, password: password}, loginCallback);
    });
});


io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        new ChatMessage(socket,msg);
    });

});


http.listen(port, function(){
    console.log('listening on *:3000');
});


function addUser(name, socket){
    users.push(new User(name, socket));
    console.log("A user connected");
    console.log(users);
}

function removeUser(socket){
    users.splice(users.indexOf(users.filter((u)=>{
        u.socket.id = socket.id;
    })[0]), 1);
    console.log('user disconnected');
    console.log(users);
}

class ChatMessage{

    constructor(socket, msg){
        this.id = globalId++;
        this.to = to;
        this.from = from;
        this.msg = msg;
        this.id = 
        this.sendMessage(msg, to, from);
        setTimeout(()=>{
            this.selfDestruct(this.msg, to, from);
        }, 5000);
    }

    sendMessage(msg, to, from){
        io.to(to).emit('chat message', msg);
        io.to(from).emit('chat message', msg);
    }

    selfDestruct(msg, to, from){
        io.to(to).emit('destroy', msg);
        io.to(from).emit('destroy', msg);
    }
}


class LocalPost{
    constructor(socket, to, msg){
        this.id = globalId++;
        this.origin = socket;
        this.to = to;
        this.msg = msg;
        this.sendMessage(msg, to);
        setTimeout(()=>{
            this.selfDestruct(this.msg, to);
        }, 5000);
    }

    sendMessage(msg, to){
        $.each(to, (f)=>{
            io.to(f).emit('local post', msg);
        });
    }

    selfDestruct(msg, to){
        $.each(to, (f)=>{
            io.to(f).emit('destroy local post');
        });
    }
}


class ChatConnection{
    constructor(u){
        this.users = u;
    }
}


class User{
    constructor(username, socket){
        this.name = username;
        this.socket = socket;
        this.friends = [];
    }

    // post(msg){
    //     $.each(this.friends, (f)=>{
    //         new LocalPost(this.socket, this.friends);
    //     });
    // }

}


function updateUser(name, socketid){
    USER.findOne({name: name}, (err, usr)=>{
        if(err){
            //do nothing
        }else{
            usr.socketId = socketid;
            usr.save();
        }
    });
}
