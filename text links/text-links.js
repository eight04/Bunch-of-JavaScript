(function(){
	"use strict";
	
	function select(e){
		var sel = window.getSelection();
		if(sel.anchorNode.nodeType != 3){
			return;
		}
		
		var otext = sel.anchorNode.data;
		var pos = sel.anchorOffset;
		var output = "";
		
		// var text = otext.slice(0, pos);
		var reg = /(?:https?|ftp):\/\/$[^\.\/]/;
		while(text){
			if(/er/.test(text)){
				var m = test.match(/(?:https?|ftp):\/\/$/)[0];
				output = m + output;
				break;
			}else if(/[\S]+?(?:\.|\/)$/.test(text)){
				var m = test.match(/[\S]+?(?:\.|\/)$/)[0];
				output = m + output;
				text = text.slice(0, -m.length);
			}else{
				break;
			}
		}
		
		
		console.log(sel);
	}
	
	
	var clicking = {
		count: 0,
		x: 0,
		y: 0,
		id: 0,
		handleEvent: function(e){
		
			var text = e.explicitOriginalTarget;
			
			this.count++;
			if(text.nodeType != 3){
				this.count = 0;
			}else if(this.x != e.pageX || this.y != e.pageY){
				this.count = 1;
			}
			
			clearTimeout(this.id);
			var self = this;
			this.id = setTimeout(function(){
				self.count = 0;
			}, 1000);

			if(this.count == 2){
				select(e);
			}
			
			self.x = e.pageX;
			self.y = e.pageY;
			
			// console.log(self.x, self.y);
			
		}
	}
	
	document.addEventListener("click", clicking, false);
})()