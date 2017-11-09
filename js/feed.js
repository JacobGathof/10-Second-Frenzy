

(function () {
    "use strict";
	function createPostElement(name, message, id){
		
	}
	
	function duplicateNode(name, message, id){
      let node = $("#post-container-template");
      let node1 = node.clone();
      node1.addClass("post-container").removeAttr("id");
	  node1.data("post-id", id);
	  node1.find("#post-content-name").html(name);
	  node1.find("#post-content-source").html(message);
	  node1.find("#post-content-id").html(id);
	  node1.find('.blike').on("click", function(){
			const id = node1.data().postId;
			socket.emit('like post', id);
		});
	  node1.fadeOut(10000);
      $("#feed-area").prepend(node1);
	  
    }
	
	function createPost(name, message, id){
		duplicateNode(name, message, id);
	}
	
	const name = JSON.parse(sessionStorage.getItem("user"))[0].name;
	
	var socket = io();
	
	
	socket.on('local post', function(name, msg, id){
		createPost(name, msg, id);
	});
	
	
	socket.on('destroy local post', function(msg, id){
		
		let currP = null;
		$.each($(".post-container"), function(i, p){
			if($(p).data().postId == ""+id){
				currP = $(p);
				return;
			}
		});
		
		if(!currP){
			return;
		}
		currP.remove();
		
	});
	
	socket.on("like post return", function(id, likes){
		let currP = null;
		$.each($(".post-container"), function(i, p){
			if($(p).data().postId == ""+id){
				currP = $(p);
				return;
			}
		});
		
		if(!currP){
			return;
		}
		currP.find("#post-content-likes").text(""+likes);
		
	});
	
	socket.emit("booyakasha", name);
	
	function setup(){
		$('#b').on("click", function(){
			socket.emit('post to local feed', name, $('#m').val());
		});
	}
	
	$(document).ready(()=>{
		setup();
	});
	
	
})();
