(function () {
    let rowStart = 2;
    const rowLength = 4;
    const rowOffset = 1;

    const columnOrigin = 4;
    let columnStart = 4;
    const columnLength = 1;
    const columnOffset = 1;

    const columnLimit = 8;
    const socket = io();
    const user = JSON.parse(sessionStorage.getItem("user"))[0];
    console.log(user);
    function createChatBox(name) {
        /* Check to see if a window already exists with that person*/
        if ($(`#${name}`).length!=0){
            return;
        }
        
        /* Create the actual chat window */
        const chatWindow = $("<div>").addClass("chat-window");
        const header = $("<div>").addClass("chat-window-header").text(name);
        const messageWindow = $("<div>").addClass("chat-message-container");
        messageWindow.attr("id", name);
        const submitWindow = $("<div>").addClass("send-message-container");
        const textarea = $("<textarea>").addClass("chat-message-entry");
        const submitButton = $("<div>").addClass("submit-button");

        chatWindow.append(header).append(messageWindow).append(submitWindow);
        submitWindow.append(textarea).append(submitButton);

        /* Set the proper coordinates for the window */
        chatWindow.css("grid-column", `${columnStart} / ${columnStart + columnLength}`);
        chatWindow.css("grid-row", `${rowStart} / ${rowStart + rowLength}`);
        columnStart += columnOffset + columnLength;
        if (columnStart > columnLimit) {
            columnStart = columnOrigin;
            rowStart += rowLength + rowOffset;
        }
        /* Add socket connection to the submit buttons*/

        submitButton.on('click', function () {
            if ($(textarea).val()==""){
                return false;
            }
            socket.emit('chat message out', name, user.name, textarea.val());
            //addOutgoingMessage(`#${name}`, $(textarea).val());
            //set text value to blank
            $(textarea).val("");
        });

        

        /* Append the window to the clobal content container. */
        $(".content-container").append(chatWindow);
    }
    //defining socket functionality for chats page
    socket.on('chat message in', function(newName, msg){
        console.log("received incoming message from " + newName);
        addIncomingMessage(newName, msg);
    });

    socket.on('chat message out', function (newName, msg){
        addOutgoingMessage(newName, msg);
    });

    socket.on('destroy', function(name){
		console.log("Destroy");
        $(`#${name}`).children().first().remove();
    });

    $(document).ready(function () {
        //create chat links
        const friendlist = $('.friends-list-content');
        user.friends.forEach(function(name) {
            friendlist.append($('<div>').addClass('chat-link').text(name));
        }, this);
        socket.emit('booyakasha', user.name);
        //assign chat-links
        $.each($(".chat-link"), (index, value) => {
            $(value).on('click', () => {
                createChatBox($(value).text().trim());
            });
        });
    });

    function addIncomingMessage(id, msg){
        let chatWindow = $(id);
        if (chatWindow.length==0){
            createChatBox(id);
        }
		console.log(msg);
        chatWindow = $("#"+id);
        const $message = $("<div>").addClass("incoming-chat-message").text(msg);
        chatWindow.append($message);
    }
    function addOutgoingMessage(id, msg){
        chatWindow = $("#"+id);
        chatWindow.append($("<div>").addClass("outgoing-chat-message").text(msg));
    }
	
})();