

(function () {
    "use strict";
	function createPostElement(name, message, id){
		
	}
	
	function duplicateNode(name, message, id){
      let node = $("#post-container-template");
      let node1 = node.clone();
      node1.addClass("post-container").removeAttr("id");
	  node1.attr("data-post-id", id);
	  node1.find("#post-content-name").html(name);
	  node1.find("#post-content-source").html(message);
	  node1.find("#post-content-id").html(id);
	  node1.find('.blike').on("click", function(){
			console.log(node1.find(".post-container"));
			const id = node1.find(".post-container").attr("data-post-id");
			console.log(id);
			socket.emit('like post', id)
		});
      $("#feed-area").prepend(node1);
	  
    }
	
	function createPost(name, message, id){
		duplicateNode(name, message, id);
	}
	
	const name = JSON.parse(sessionStorage.getItem("user"))[0].name;
	
	var socket = io();
	
	
	socket.on('global post', function(name, msg, id){
		createPost(name, msg, id);
	});
	
	
	socket.on('destroy global post', function(msg, id){
		
		let feed = document.getElementById("feed-area");
		let children = feed.children;
		
		for(let i = 0; i < children.length; i++){
			let child = children[i];
			if(child.getAttribute("data-post-id") == id){
				child.parentNode.removeChild(child);
				return;
			}
		}
	});
	
	socket.on("like post return", function(id, likes){
		let feed = document.getElementById("feed-area");
		let children = feed.children;
		
		for(let i = 0; i < children.length; i++){
			let child = children[i];
			if(child.getAttribute("data-post-id") == id){
				child.children[0].children[2].innerHTML = ""+likes;
				return;
			}
		}
		
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
