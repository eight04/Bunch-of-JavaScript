
function bounceball(width, height, radius, containerId){
	// bounceball(width, height, radius, containerId) -> void
	
	"use strict";
	
	function randColor(){
		// randColor() -> hex color string: #FFFFFF
		
		var z = "000000";
		var h = Math.floor(Math.random()*16777215).toString(16);
		return "#" + (z+h).slice(-6);
	}
	
	function animation(ball){
		
		var init = {
			timestamp: 0,
			pos: {
				x: ball.pos.x,
				y: ball.pos.y
			},
			speed: {
				x: 0,
				y: 0
			}
		};
		var gravity = 1.5 / 1000,
			turnTime = Math.sqrt((height - radius - init.pos.y) * 2 / gravity);
		
		requestAnimationFrame(loop);
		
		function loop(timestamp){
			var period = timestamp - init.timestamp,			
				time = period % turnTime,
				turn = Math.floor(period / turnTime),
				move = 0;
			
			if(!(turn % 2)){
				// down
				move = (gravity * time * time) / 2;
				ball.pos.y = init.pos.y + move;
			}else{
				// up
				time = turnTime - time;
				move = (gravity * time * time) / 2;
				ball.pos.y = init.pos.y + move;
			}
			
			var rx = init.pos.x - radius + period * ball.speed.x,
				x = rx % (width - radius * 2),
				turn = (rx - x) / (width - radius * 2);
				
			if(!(turn % 2)){
				// right
				ball.pos.x = x + radius;
			}else{
				// left
				ball.pos.x = width - x - radius;
			}
			
			// draw
			ball.draw();
			
			requestAnimationFrame(loop);
		}
	}
	
	// create svg
	// why namespace?
	var ns = "http://www.w3.org/2000/svg",
		svg = document.createElementNS(ns, "svg"),
		container = document.querySelector(containerId);
	svg.setAttribute("width", width);
	svg.setAttribute("height", height);
	container.appendChild(svg);
	
	// create circle
	var ball = {
		element: document.createElementNS(ns, "circle"),
		radius: radius,
		speed: {
			x: 500/1000,
			y: 0
		},
		pos: {
			x: width/2,
			y: radius
		},
		color: randColor(),
		draw: function(){
			var e = this.element;
			e.setAttribute("cx", this.pos.x);
			e.setAttribute("cy", this.pos.y);
		}
	}
	ball.element.setAttribute("r", radius);
	ball.element.setAttribute("fill", randColor());
	svg.appendChild(ball.element);
		
	// animate
	animation(ball);
}