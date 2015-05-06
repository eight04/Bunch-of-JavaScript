
function snake(width, height, size, linewidth, containerId, speed){
	/* snake(width, height, size, containerId, speed) -> void
	
	containerId     query id, something like "#snake"
	linewidth       the border width.
	speed           move speed, pixel/million seconds.
	*/
	"use strict";
	
	// set DOM
	var container = document.querySelector(containerId),
		canvas = document.createElement("canvas"),
		cw = width*(size + linewidth) + linewidth,
		ch = height*(size + linewidth) + linewidth;
		
	canvas.setAttribute("width", cw);
	canvas.setAttribute("height", ch);
	container.appendChild(canvas);
	
	// canvas init and border
	var ctx = canvas.getContext("2d");
	var halflw = linewidth/2;
	ctx.lineWidth = linewidth;
	ctx.moveTo(halflw, halflw);
	ctx.lineTo(cw - halflw, halflw);
	ctx.lineTo(cw - halflw, ch - halflw);
	ctx.lineTo(halflw, ch - halflw);
	ctx.closePath();
	ctx.stroke();
	
	// worker init
	worker(speed);

	function worker(speed){
		// worker(speed) -> void
		
		// _x, _y   real coordinate.
		// step     value n, e, w, s. set where to move.
		var _x = linewidth,
			_y = linewidth,
			step = "n";
		
		init();
		function init(){
			// random select the start point.
			
			step = shuffle("news".split(""))[0];
			var x = 0,
				y = 0;
			
			// deside way and start pos
			if(step == "n"){
				x = Math.floor(Math.random()*width);
				y = height - 1;
			}else if(step == "s"){
				x = Math.floor(Math.random()*width);
				y = 0;
			}else if(step == "w"){
				x = width - 1;
				y = Math.floor(Math.random()*height);
			}else if(step == "e"){
				x = 0;
				y = Math.floor(Math.random()*height);
			}
			_x = linewidth + x*(linewidth + size);
			_y = linewidth + y*(linewidth + size);
		
			// init draw
			ctx.beginPath();
			ctx.lineWidth = linewidth;
			ctx.moveTo(_x - halflw, _y - halflw);
			ctx.lineTo(_x + size + halflw, _y - halflw);
			ctx.lineTo(_x + size + halflw, _y + size + halflw);
			ctx.lineTo(_x - halflw, _y + size + halflw);
			ctx.closePath();
			ctx.stroke();
		}
		
		// select a valid step according to x, y.
		var _vx = 0, _vy = 0;
		function validstep(x, y, step){
			// validstep(x, y, step) -> step string
			
			// to avoid duplicate step. explain below
			if(_vx == x && _vy == y)
				return step;
			_vx = x;
			_vy = y;
			
			// random step
			var s = shuffle("news".split("")),
				op = {n: "s", e: "w", w: "e", s: "n"};
			
			for(var i=0; i<s.length; i++){
				// no backward
				if(s[i] == op[step])
					continue;
				
				// out of range
				if(s[i] == "n" && y < linewidth + size)
					continue;
				if(s[i] == "e" && x >= cw - linewidth - size)
					continue;
				if(s[i] == "w" && x < linewidth + size)
					continue;
				if(s[i] == "s" && y >= ch - linewidth - size)
					continue;
				
				return s[i];
			}
			return step;
		}
		
		// timestamp and decimal handling. 
		var ptimestamp = 0,
			dec = 0;
		
		// setTimeout replacement. note that opera 12 doesn't support
		if(window.requestAnimationFrame){
			requestAnimationFrame(walk);
		}else{
			ptimestamp = new Date();
			setTimeout(function(){
				walk(new Date());
			}, 1);
		}
		
		function walk(timestamp){
			// call by requestAnimationFrame.
			// http://is.gd/3UxRjx
			
			// if _x, _y out of range, then init again.
			if(_x < linewidth || _x > cw - linewidth - size ||
					_y < linewidth || _y > cw - linewidth - size)
				init();
				
			// actual pixels to move
			var period = (timestamp - ptimestamp)*speed + dec;
			dec = period % 1;
			period -= dec;
			ptimestamp = timestamp;

			// cross grid
			if(crossgrid(_x, _y, step, period)){
				/*
				13 182 "e" 1 snake.js:87
				14 182 "n" 1 snake.js:87
				2 182 "w" 1 snake.js:87
				
				some situation will cause duplicately select new step.
				eg. move(1) -> new step "n" -> move(0) -> move(0) -> 
						new step "w" -> move(1)
				so we have to check if duplicate in validstep()
				*/
				
				// caculate p to move to grid
				var p = ((_y - linewidth) % (size + linewidth)) ||
					((_x - linewidth) % (size + linewidth));
				if(step == "e" || step == "s"){
					p = (size + linewidth - p) % (size + linewidth);
				}
				movestep(step, p);
				// now _x, _y should on the grid, select a new step
				step = validstep(_x, _y, step);
				period -= p;
			}
			movestep(step, period);
			
			function crossgrid(x, y, step, period){
				/* crossgrid(x, y, step, period) -> boolean
				
				if x, y with spec step and period will cross the grid,
				then return true. otherwise return false.
				*/
				
				if(!period)
					return false;
					
				var p;
				switch(step){
				case "n":
					p = (y - linewidth) % (size + linewidth);
					return p < period;
				case "e":
					p = (x - linewidth) % (size + linewidth);
					return p + period >= linewidth + size;
				case "w":
					p = (x - linewidth) % (size + linewidth);
					return p < period;
				case "s":
					p = (y - linewidth) % (size + linewidth);
					return p + period >= linewidth + size;
				}
			}
						
			function movestep(step, period){
				/* movestep(step, period) -> void
				
				this function will draw the hollow line.
				*/
				switch(step){
				case "n":
					_y -= period;
					ctx.fillRect(_x - linewidth, _y - linewidth, size + 2*linewidth, period);
					ctx.clearRect(_x, _y, size, period + linewidth);
					break;
				case "e":
					_x += period;
					ctx.fillRect(_x - period + size + linewidth, _y - linewidth, period, size + 2*linewidth);
					ctx.clearRect(_x - period + size, _y, period, size);
					break;
				case "w":
					_x -= period;
					ctx.fillRect(_x - linewidth, _y - linewidth, period, size + 2*linewidth);
					ctx.clearRect(_x, _y, period + linewidth, size);
					break;
				case "s":
					_y += period;
					ctx.fillRect(_x - linewidth, _y - period + size + linewidth, size + 2*linewidth, period);
					ctx.clearRect(_x, _y - period + size, size, period);
					break;
				}
				ctx.clearRect(_x, _y, size, size);
			}
					
			// recurve
			if(window.requestAnimationFrame){
				requestAnimationFrame(walk);
			}else{
				setTimeout(function(){
					walk(new Date());
				}, 1);
			}
			
			return;
		}
		
		function shuffle(ar){
			// shuffle(array) -> array
			
			var i,
				p,
				t;
				
			for(i=0; i<ar.length; i++){
				p = Math.floor(Math.random()*(ar.length-i) + i);
				t = ar[i];
				ar[i] = ar[p];
				ar[p] = t;
			}
			return ar;
		}
		
		return;
	}
	return;
}

