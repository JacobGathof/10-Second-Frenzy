(function () {
    $("#generate-friend-code-button").on("click", generateFriendCode);

    function generateFriendCode(){
        let friendCode = "";
        for(let i = 0; i < 4; i++){
            friendCode += Math.floor(Math.random() * 9) + 1;
        }
        console.log(friendCode);
        $("#generate-friend-code").text(friendCode);
    }
})();
