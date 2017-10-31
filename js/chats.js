(function () {
    let rowStart = 2;
    let rowLength = 4;
    let rowOffset = 1;

    let columnOrigin = 4;
    let columnStart = 4;
    let columnLength = 1;
    let columnOffset = 1;

    let columnLimit = 8;
    console.log("HELLO");

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
        $.each($(".submit-button"), (index, val) =>{
            $(val).on('click', function (){
                socket.emit('chat message', $(".chat-message-entry").text());
                //set text value to blank
                return false;
            });
        });
        

        /* Append the window to the clobal content container. */
        $(".content-container").append(chatWindow);
    }
    $(document).ready(function () {
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
        chatWindow.append($("<div>").addClass("incoming-chat-message").text(msg));
    }
})();