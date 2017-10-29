$(function () {
	var socket = io();
	$('form').submit(function(){
		socket.emit('chat message', $('#m').val());
		$('#m').val('');
		return false;
	});

	socket.on('chat message', function(msg){
		$('#messages').append($('<li>').text(msg));
	});
});


(function () {
    "use strict";

    function setup() {
      duplicateNode();
    }

    $(window).on('load', setup);

    $("#title").on("click", duplicateNode);

    setInterval(reduceTimes, 100);

    function reduceTimes(){
      let containers = $(".post-container");

      containers.each(function(){
        let counter = $(this).find("#post-counter");
        let val = counter.text();
        let newNum = Number(val) - .1;
        if(newNum < 0.0){
          $(this).remove();
        }
        counter.text(newNum.toFixed(1));
      })
    }

    function duplicateNode(){
      let node = $("#post-container-template");
      let node1 = node.clone();
      node1.addClass("post-container").removeAttr("id");
      node1.find("#post-counter").text("10");
      $("#feed-area").append(node1);
    }
	
	
})();
