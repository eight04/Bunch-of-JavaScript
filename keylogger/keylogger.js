
(function(){
	var color = [150,150,255];
			
	function fadeloop(){
		var els = document.querySelectorAll(".key");
		var el;
		var fadespeed = 2;
		
		if(els[0]){
			for(var i=0; i<els.length; i++){
				el = els[i];
				if(el.reset){
					el.color = color.concat();
					el.reset = false;
				}else{
					el.color[0] += fadespeed;
					el.color[1] += fadespeed;
					el.color[2] += fadespeed;
				}
				// console.log(el.color.toString());
				el.style.backgroundColor = "rgb(" + el.color.join(",") + ")";
			}
		}
		
		requestAnimationFrame(fadeloop);
	}
			
	function keydown(e){
		var id = "key" + e.keyCode;
		var el = document.querySelector("#" + id);
		if(!el){
			el = document.createElement("div");
			el.setAttribute("id", id);
			el.className = "key";
			// el.style.backgroundColor = "rgb(" + color.join(",") + ")";
			el.innerHTML = e.keyCode;
			// el.color = color.concat();
			document.querySelector("#container").appendChild(el);
		}else{
			el.className = "";
			el.offsetWidth = el.offsetWidth;
			el.className = "key";
		}
	}
	
	function keyup(e){
		var id = "key" + e.keyCode;
		var el = document.querySelector("#" + id);
		if(el){
			el.parentNode.removeChild(el);
		}
	}
	
	document.addEventListener("keyup", keyup, false);
	document.addEventListener("keydown", keydown, false);
	// setInterval(fadeloop, 1);
	// requestAnimationFrame(fadeloop);
}());