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

    function createChatBox() {
        /* Check to see if a window already exists with that person*/

        /* Create the actual chat window */
        const chatWindow = $("<div>").addClass("chat-window");
        const header = $("<div>").addClass("chat-window-header").text();
        const messageWindow = $("<div>").addClass("chat-message-container");
        const submitWindow = $("<div>").addClass("send-message-container");
        const textarea = $("<textarea>").addClass("chat-message-entry");
        const submitButton = $("<div>").addClass("submit-button").attr("rows", "2").attr("cols", "26");

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

        /* Append the window to the clobal content container. */
        $(".content-container").append(chatWindow);
    }
    $(document).ready(function () {
        $.each($(".chat-link"), (index, value) => {
            $(value).on('click', () => {
                createChatBox($(this).text());
            });
        });
    });
})();