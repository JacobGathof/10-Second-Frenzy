(function (){
    const socket = io();
    socket.emit('booyakasha');
    const user = sessionStorage.getItem("user")[0];
    if (!user){
        window.location.href = "/";
    }
    

    function submitUrl(){
        console.log($('#url').val());
        socket.emit('update user url', user.name, $('#url').val());
    }

    $(document).ready(()=>{
        $('#url-button').on('click', submitUrl);
    });
})();