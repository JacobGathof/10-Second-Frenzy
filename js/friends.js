(function () {
	const socket = io();
	const name = JSON.parse(sessionStorage.getItem("user"))[0].name;
    $("#generate-friend-code-button").on("click", generateFriendCode);
	$('#add-friend-button').on('click', addFriend);

    function generateFriendCode(){
        let friendCode = "";
        for(let i = 0; i < 4; i++){
            friendCode += Math.floor(Math.random() * 9) + 1;
        }
        console.log(friendCode);
		const v = $("<p>"+friendCode+"</p>").fadeOut(10000);
        $("#generate-friend-code").empty().append(v);
		
		socket.emit('set my friend code', name, friendCode);
    }
	
	function addFriend(){
		const code = $('#add-friend-code').val();
		console.log(code);
		socket.emit('add friend', name, code);
	}
	
	socket.emit('booyakasha', name);
	
	$(window).on("unload", function(){
		socket.emit('sayonara', name);
	});


	$(document).ready( () => {
		// get contacts from api
		console.log("Sent request for friends.");
        socket.emit('display friends', name);
	});
	
	socket.on("sending friends list", function(friends){
		console.log("Got friends.");
		console.log(friends);
		const friendsContainer = $('#friends-container');
		friends.forEach((friend) => {
			friendsContainer.append(`<p> ${friend} </p>`);
		});
	});
	
	socket.on("added friend", function(name){
		alert("Congrats! You are now friends with " + name);
	});
	
	
})();
