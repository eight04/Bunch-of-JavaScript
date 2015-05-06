

function maze(width, height, workers, mazeid, fillcolor){
	"use strict";
	/* 
	maze(width, height, workers, mazeid, fillcolor) -> maze Object
	
	int width, set the maze size.
	int height, set the maze size.
	int workers, number of workers.
	string mazeid, query string, the element where maze to render.
	bool fillcolor, fill the maze with workers color.
	*/
	
	// dfs make map traceback
	var map = [],
		i = 0;
	for(i=0; i<width; i++){
		map[i] = [];
	}
	dfs(map, width, height);
	
	// draw maze init
	var mazediv = document.querySelector(mazeid),
		container = document.createDocumentFragment(),
		l = 0,
		line = null,
		c = null;
		
	for(l=0; l<height; l++){
		line = document.createElement("div");
		line.classList.add("line");
		for(i=0; i<width; i++){
			c = document.createElement("div");
			c.classList.add("cell");
			line.appendChild(c);
		}
		container.appendChild(line);
	}
	
	// erase edge
	var cells = container.querySelectorAll(".cell"),
		j = 0,
		cur = 0;
	for(i=0; i<width; i++){
		for(j=0; j<height; j++){
			cur = i + j*width;
			cells[cur].classList.add(map[i][j]);
			switch(map[i][j]){
			case "w":
				cells[cur - 1].classList.add("e");
				break;
			case "n":
				cells[cur - width].classList.add("s");
				break;
			case "e":
				cells[cur + 1].classList.add("w");
				break;
			case "s":
				cells[cur + width].classList.add("n");
				break;
			}
		}
	}
	
	// worker walking
	var workerlist = [];
	for(i=0; i<workers; i++){
		workerlist.push(worker(cells, width, height));
	}
	
	// show maze
	mazediv.appendChild(container);
	
	return {
		size: {
			x: width,
			y: height
		},
		workers: {
			get: function(){
				return workerlist;
			},
			stop: function(){
				for(var i=0; i<workerlist.length; i++){
					workerlist[i].stop();
				}
			},
			start: function(){
				for(var i=0; i<workerlist.length; i++){
					workerlist[i].start();
				}
			}
		}
	};
	
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

	function worker(cells, width, height){
		// worker(cells, width, height) -> worker object
		
		var x = Math.floor(Math.random()*width),
			y = Math.floor(Math.random()*height),
			color = randcolor(),
			premove = "",
			timerid = setInterval(walk, 200);
	
		return {
			color: function(){
				return color;
			},
			stop: function(){
				clearInterval(timerid);
			},
			start: function(){
				timerid = setInterval(walk, 200);
			}
		};
		
		function walk(){
			// deside move
			var d = shuffle(["n", "e", "s", "w"]),
				move = null,
				opposite = {
					n: "s",
					w: "e",
					s: "n",
					e: "w"
				},
				cur = x + width*y,
				i = 0;
			
			for(i = 0; i < d.length; i++){
				if(opposite[premove] != d[i] && cells[cur].classList.contains(d[i])){
					move = d[i];
					break;
				}
				if(!move){
					move = opposite[premove];
				}
			}
			
			// walk a cell
			switch(move){
			case "w":
				cells[cur-1].style.backgroundColor = color;
				x--;
				break;
			case "e":
				cells[cur+1].style.backgroundColor = color;
				x++;
				break;
			case "n":
				cells[cur-width].style.backgroundColor = color;
				y--;
				break;
			case "s":
				cells[cur+width].style.backgroundColor = color;
				y++;
				break;
			}
			if(!fillcolor)
				cells[cur].style.backgroundColor = "";
			premove = move;
		}

	}

	function randcolor(){
		// randcolor() -> hex color string: #FFFFFF
		
		var z = "000000";
		var h = Math.floor(Math.random()*16777215).toString(16);
		return "#" + (z+h).slice(-6);
	}
	
	function dfs(map, width, height){
		// dfs(map, width, height) -> map array
		
		// dfs init
		var traceback = [],
			x = Math.floor(Math.random()*width),
			y = Math.floor(Math.random()*height);
		traceback.push([x, y]);
		
		while(1){
			// traceback empty
			if(!traceback.length){
				break;
			}
			
			// position, next position
			var pos = traceback[traceback.length-1],
				posn = getvalidcell(map, pos);
				
			// no valid cell
			if(!posn){
				traceback.pop();
				continue;
			}
			
			// push next pos
			traceback.push(posn);
			if(posn[0]>pos[0])
				map[posn[0]][posn[1]] = "w";
			if(posn[0]<pos[0])
				map[posn[0]][posn[1]] = "e";
			if(posn[1]>pos[1])
				map[posn[0]][posn[1]] = "n";
			if(posn[1]<pos[1])
				map[posn[0]][posn[1]] = "s";
		}
		
		function getvalidcell(map, pos){
			// getvalidcell(map, position) -> [x, y]
			
			var d = shuffle(["n", "e", "s", "w"]),
				x = pos[0],
				y = pos[1];
				
			// randomly check each edge
			for(var i=0; i<d.length; i++){
				if(d[i] == "w" && x>0 && !map[x-1][y]){
					return [x-1, y];
				}else if(d[i] == "n" && y>0 && !map[x][y-1]){
					return [x, y-1];
				}else if(d[i] == "e" && x+1<width && !map[x+1][y]){
					return [x+1, y];
				}else if(d[i] == "s" && y+1<height && !map[x][y+1]){
					return [x, y+1];
				}
			}
			
			// no valid edge
			return false;
		}
	}


}
