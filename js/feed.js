

(function () {
    "use strict";
	
	const name = JSON.parse(sessionStorage.getItem("user"))[0].name;
	
	var socket = io();
	$('#b').on("click", function(){
		//socket.emit('chat message', $('#m').val());
		//$('#m').val('');
		const msg = $("#m").val();
		console.log(name + " " + msg);
		createPost(name, msg);
		return false;
	});

	socket.emit("booyakasha", name);
	
	socket.on('chat message', function(msg){
		$('#messages').append($('<li>').text(msg));
	});
	
	socket.on('destroy', function(msg){
		$('#messages').children().first().remove();
	});
	
	function setup(){
		
	}

    $(window).on('load', setup);


    function duplicateNode(name, message){
      let node = $("#post-container-template");
      let node1 = node.clone();
      node1.addClass("post-container").removeAttr("id");
	  node1.find("#post-content-name").html(name);
	  node1.find("#post-content-source").html(message);
      $("#feed-area").append(node1);
    }
	
	function createPost(name, message){
		duplicateNode(name, message);
	}
	
	
})();
