(function () {
    $("#most-likes").on("click", mostLikesButtonClicked);
    $("#most-dislikes").on("click", mostDislikesButtonClicked);
    $("#most-shares").on("click", mostSharesButtonClicked);
    $("#ten-minutes").on("click", tenMinutesButtonClicked);
    $("#ten-hours").on("click", tenHoursButtonClicked);
    $("#ten-days").on("click", tenDaysButtonClicked);

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
        if (posts.length < 10){
            console.log("ERROR POSTs");
            return;
        }
        populateTable(posts);
    });
    socket.on("least liked posts", function(posts){
        if (posts.length < 10){
            console.log("ERROR POSTS");
            return;
        }
        populateTable(posts);
    });
    function populateTable(posts){
        const table = $('#table')
        for (let i = 0; i < 10; i++){
            const row = $('<tr></tr>');
            row.append($('<td>').text(i+1));
            row.append($('<td>').text(posts[i].author));
            row.append($('<td>').text(posts[i].content));
            row.append($('<td>').text(posts[i].likes));
            table.append(row);
        }
    }
    
    function mostDislikesButtonClicked(){
        $("#most-likes").css("background-color", "#D3DFD3");
        $("#most-dislikes").css("background-color", "lightgreen");
        $("#most-shares").css("background-color", "#D3DFD3");
    }

    function mostSharesButtonClicked(){
        $("#most-likes").css("background-color", "#D3DFD3");
        $("#most-dislikes").css("background-color", "#D3DFD3");
        $("#most-shares").css("background-color", "lightgreen");
    }

    function tenMinutesButtonClicked(){
        $("#ten-minutes").css("background-color", "lightgreen");
        $("#ten-hours").css("background-color", "#D3DFD3");
        $("#ten-days").css("background-color", "#D3DFD3");
    }

    function tenHoursButtonClicked(){
        $("#ten-minutes").css("background-color", "#D3DFD3");
        $("#ten-hours").css("background-color", "lightgreen");
        $("#ten-days").css("background-color", "#D3DFD3");
    }

    function tenDaysButtonClicked(){
        $("#ten-minutes").css("background-color", "#D3DFD3");
        $("#ten-hours").css("background-color", "#D3DFD3");
        $("#ten-days").css("background-color", "lightgreen");
    }
})();
