const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);

require('./models/user');
const USER = mongoose.model('User');

const port = process.env.PORT || 3000;
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

    socket.on('sayonara', function(){
        removeUser(socket);
    });

    socket.on("post to global feed", function(name, msg){
        new GlobalPost(name, msg);
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

    socket.on('add friend', function(name, code){
        const potentialFriend = users.filter((user) =>{
            return user.code ==code;
        });
        if (!potentialFriend||code=="-1"){
            return;
        }
        const realPotentialFriend = potentialFriend[0];
        USER.findOne({name: name}, function(err, user){
            if (!err){
                user.friends.push(realPotentialFriend.name);
                user.save();
            }
        });
        USER.findOne({name: realPotentialFriend.name}, function(err, user){
            if (!err){
                user.friends.push(name);
                user.save();
            }
        });

        
    });

    socket.on('set my friend code', function(name, code){
        new FriendCode(name, code);
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
    users.forEach((user)=>{
        console.log(user.name);
    });
}

function removeUser(socket){
    users.splice(users.indexOf(users.filter((u)=>{
        return u.socket.id == socket.id;
    })[0]), 1);
    console.log('user disconnected');
    users.forEach((user)=>{
        console.log(user.name);
    });
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
    
    constructor(name, msg){
        this.name = name;
        this.msg = msg;
        
        this.sendMessage(name, msg);
        setTimeout(()=>{
            this.selfDestruct(this.name, this.msg);
        }, 5000);
    }

    sendMessage(name, msg){
        USER.findOne({name:name}, (err, user)=>{
            if(!err){
                const fr = user.friends;

                const friendObjects = users.filter((f)=>{
                    return fr.findIndex(f.name) != -1;
                });
                
                friendObjects.forEach((user)=>{
                    io.to(user.socket.id).emit('local post', name, msg);
                });
            }
        });
       
    }

    selfDestruct(name, msg){
        io.emit("destroy local post", msg);
    }
}


class ChatConnection{
    constructor(u){
        this.users = u;
    }
}
class FriendCode{
    constructor(name, code){
        this.user = users.filter((user)=>{
            return name==user.name;
        })[0];
        this.user.code = code;
        setTimeout(()=>{
            this.selfDestruct();
        }, 10000);
    }

    selfDestruct(){
        this.user.friendCode = -1;
    }
}

class User{
    constructor(username, socket){
        this.name = username;
        this.socket = socket;
        this.code = -1;
    }
}

class GlobalPost{

    constructor(name, msg){
        this.name = name;
        this.msg = msg;
        
        this.sendMessage(name, msg);
        setTimeout(()=>{
            this.selfDestruct(this.name, this.msg);
        }, 5000);
    }

    sendMessage(name, msg){
        io.emit('global post', name, msg);
    }

    selfDestruct(name, msg){
        io.emit("destroy global post", msg);
    }
}
