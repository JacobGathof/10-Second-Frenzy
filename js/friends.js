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
        $("#generate-friend-code").text(friendCode);
		
		socket.emit('set my friend code', name, friendCode);
    }
	
	function addFriend(){
		const code = $('#add-friend');
		socket.emit('add friend', name, code);
	}
	
	socket.emit('booyakasha', name);
	
	$(window).on("unload", function(){
		socket.emit('sayonara', name);
	});
	
})();
