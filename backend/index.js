const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);

require('./models/user');
require('./models/post');
const USER = mongoose.model('User');
const POST = mongoose.model('Post');

const port = process.env.PORT || 3000;
const users = [];
const posts = [];
let currentId = 6453;

const timer = 10000;

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
        posts.push(new GlobalPost(name, msg));
    });

    socket.on("post to local feed", function(name, msg){
        posts.push(new LocalPost(name, msg));
    });

    socket.on('register', function(name, username, password){
        
        USER.findOne({name: name}, (err, obj)=>{
            let error=false;
            if (err){
                console.log("some error");
                return;
            }
            else{
                if (obj){
                    if (obj.name==name){
                        console.log("display name");
                        socket.emit('register message', "Display name unavailable.");
                    }
                    else if (obj.username==username){
                        console.log("username");
                        socket.emit('register message', "Username unavailable");
                    }
                    error = true;
                }
            }
            if (!error){
                USER.create({
                    name: name,
                    username: username,
                    password : password,
                    friends: [],
                });
                socket.emit('register message', "Successful registration!");
            }
        });
        
        
    }); 

    function loginCallback(err, user){
        if(err){
            console.log(err);
        }
        else{
            if (user.length==0){
                socket.emit('register message', "Invalid Login Credentials");
                return;
            }
            const foundUser = user;
            console.log(foundUser);
            socket.emit('register message', "Welcome to 10 Second Frenzy!")
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

    socket.on("display friends", function(name){
        socket.emit("sending friends list", users.filter((u)=>{return u.name==name;})[0].friends);
    });

    socket.on("like post", function(id){
        if (!id){
            return;
        }
        const post = getPostByID(id);
        if(!post){
            return;
        }
        post.like();
    });
    //chat functionality
    socket.on('chat message out', function(to, from, msg){
        new ChatMessage(to, from, msg);
    });
});

class ChatMessage {
    constructor(to, from, msg) {
        this.toUser = getUserByName(to);
        this.fromUser = getUserByName(from);
        this.msg = msg;
        this.toName = to;
        this.fromName = from;

        console.log(to + " " + from  + " " + msg);

        this.sendMessage();
        setTimeout(()=>{
            this.destroyChatMessages();
        },timer);
    }

    sendMessage(){
        if(this.toUser)
            io.to(this.toUser.socket.id).emit('chat message in', this.fromName, this.msg);
        if(this.fromUser)
            io.to(this.fromUser.socket.id).emit('chat message out', this.toName, this.msg);
    }

    destroyChatMessages(){
        if(this.toUser)
            io.to(this.toUser.socket.id).emit('destroy', this.fromName);
        if(this.fromUser)
            io.to(this.fromUser.socket.id).emit('destroy', this.toName);
    }

}


io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        new ChatMessage(socket,msg);
    });

});


http.listen(port, function(){
    console.log('listening on *:3000');
});


function addUser(name, socket){
    const u = new User(name, socket);
    USER.findOne({name:name}, (err, user)=>{
        if(!err){
            u.friends = user.friends;
        }
    });
    users.push(u);
    console.log("A user connected");
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

function removePost(id){
    posts.splice(getPostByID(id), 1);
}

class LocalPost{
    
    constructor(name, msg){
        this.id = currentId++;
        this.name = name;
        this.msg = msg;
        this.to = [];
        this.likes = 0;
        
        this.sendMessage(name, msg);
        setTimeout(()=>{
            this.selfDestruct(this.name, this.msg);
        }, timer);
    }

    sendMessage(name, msg){
        const user = users.filter((u)=>{return u.name==name;})[0];
        io.to(user.socket.id).emit('local post', name, msg, this.id);
        this.to.push(user.socket.id);
        const friends = user.friends;

        friends.forEach((fr)=>{
            const ff = users.filter((f)=>{return fr==f.name;})[0];
            if(ff){
                const fs = ff.socket.id;
                this.to.push(fs);
                io.to(fs).emit('local post', name, msg, this.id);
            }
        });

    }

    selfDestruct(name, msg){
        this.to.forEach((user)=>{
            io.to(user).emit("destroy local post", msg, this.id);
        });
        removePost(this.id);
    }

    like(){
        this.likes++;
        io.emit('like post return', this.id, this.likes);
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
        }, timer);
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
        this.friends = [];
    }
}

class GlobalPost{

    constructor(name, msg){
        this.id = currentId++;
        this.name = name;
        this.msg = msg;
        this.likes = 0;
        
        this.sendMessage(name, msg);
        setTimeout(()=>{
            this.selfDestruct(this.name, this.msg);
        }, timer);
    }

    sendMessage(name, msg){
        io.emit('global post', name, msg, this.id);
    }

    selfDestruct(name, msg){
        io.emit("destroy global post", msg, this.id);
        removePost(this.id);

        POST.create({
            timestamp: null,
            content: this.msg,
            link: null,
            author: this.name,
            likes: this.likes,
            dislikes: null,
            shares: null,
            reports: null,
            comments: [null]
        });

    }

    like(){
        this.likes++;
        io.emit('like post return', this.id, this.likes);
    }
}

function getPostByID(id){
    return posts.filter((p)=>{return p.id==id;})[0];
}

function getUserByName(name){
    return users.filter((u)=>{return u.name==name;})[0];
}