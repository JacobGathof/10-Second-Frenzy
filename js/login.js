(function () {
    const socket = io();
    $("#new-user-submit").on("click", newUserSubmit);
    $('#existing-user-submit').on("click", existingUserSubmit);
	
	
    function newUserSubmit(){
        const username = $("#new-username").val();
        const password = $("#new-password").val();
        const displayName = $("#new-display-name").val();
        socket.emit('register', displayName, username, password);
        $("#new-username").val("");
        $("#new-password").val("");
        $("#new-repeated-password").val("");
        $("#new-display-name").val("");
        window.alert("You are registered!");
    }

    function existingUserSubmit(){
        const username = $("#existing-username").val();
        const password = $("#existing-password").val();
        socket.emit('login', username, password);
    }

    socket.on('sendUserBack', function(user){
        try{
            sessionStorage.setItem("user", JSON.stringify(user));
			window.location.href = "index.html";
        }
        catch(e){
            console.log(e);
        }
    });

})();
