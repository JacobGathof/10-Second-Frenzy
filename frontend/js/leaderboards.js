(function () {
    $("#most-likes").on("click", mostLikesButtonClicked);
    $("#most-dislikes").on("click", mostDislikesButtonClicked);

    var socket = io("https://ten-second-frenzy-api.herokuapp.com");
    const name = JSON.parse(sessionStorage.getItem("user"))[0].name;
    socket.emit("booyakasha", name);

    function mostLikesButtonClicked(){
        $("#most-likes").css("background-color", "lightgreen");
        $("#most-dislikes").css("background-color", "#D3DFD3");
        $("#most-shares").css("background-color", "#D3DFD3");
        socket.emit("get most liked posts");
    }
    
    socket.on("most liked posts", function(posts){
        console.log("got posts");
        if (posts.length < 10){
            console.log("ERROR POSTs");
            return;
        }
        populateTable(posts);
    });
    socket.on("least liked posts", function(posts){
        console.log("got posts");
        if (posts.length < 10){
            console.log("ERROR POSTS");
            return;
        }
        populateTable(posts);
    });
    function populateTable(posts){
        const table = $('#posts');
        table.empty();
        const head = $('<tr>').append($('<th>').text('No.')).append($('<th>').text('Author')).append($('<th>').text('Content')).append($('<th>').text('Likes'));
        table.append(head);
        for (let i = 0; i < 10; i++){
            const row = $('<tr></tr>');
            row.append($('<td>').text(i+1));
            row.append($('<td>').text(posts[i].author));
            row.append($('<td>').text(posts[i].content));
            row.append($('<td>').text(posts[i].likes));
            table.append(row);
        }
        console.log(table);
    }
    
    function mostDislikesButtonClicked(){
        $("#most-likes").css("background-color", "#D3DFD3");
        $("#most-dislikes").css("background-color", "lightgreen");
        $("#most-shares").css("background-color", "#D3DFD3");
        socket.emit('get least liked posts');
    }
})();
