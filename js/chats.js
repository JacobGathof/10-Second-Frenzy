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
        
        const socket = io();
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
            socket.emit('chat message', $(".chat-message-entry").val());
            addOutgoingMessage(`#${name}`, $(textarea).val());
            //set text value to blank
            $(textarea).val("");
            return false;
        });

        socket.on('chat message', function(msg){
            addIncomingMessage(`#${name}`, msg);
        });

        socket.on('destroy', function(){
            $(messageWindow).children().first().remove();
        });

        /* Append the window to the clobal content container. */
        $(".content-container").append(chatWindow);
    }
    $(document).ready(function () {
        //create chat links
        const friendlist = $('.friends-list-content');
        user.friends.forEach(function(name) {
            friendlist.append($('<div>').addClass('chat-link').text(name));
        }, this);
        //assign chat-links
        $.each($(".chat-link"), (index, value) => {
            $(value).on('click', () => {
                createChatBox($(value).text().trim());
            });
        });
    });

    function addIncomingMessage(id, msg){
        chatWindow = $(id);
        chatWindow.append($("<div>").addClass("incoming-chat-message").text(msg));
    }

    function addOutgoingMessage(id, msg){
        chatWindow = $(id);
        chatWindow.append($("<div>").addClass("outgoing-chat-message").text(msg));
    }
})();