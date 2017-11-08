

(function () {
    "use strict";
	
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
	
	const name = JSON.parse(sessionStorage.getItem("user"))[0].name;
	
	var socket = io();
	
	
	socket.on('local post', function(name, msg){
		createPost(name, msg);
	});
	
	
	socket.on('destroy local post', function(msg){
		$('#feed-area').children().last().remove();
	});
	
	socket.emit("booyakasha", name);
	
	function setup(){
		$('#b').on("click", function(){
			socket.emit('post to global feed', name, $('#m').val());
		});
	}
	
	$(document).ready(()=>{
		setup();
	});
	
	
})();
