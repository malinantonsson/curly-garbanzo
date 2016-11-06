var timeCnt = 0;
	var maxNodeNum;
	var forceAmp;
	var frictionAmp;
	
	var maxTimeCnt = 150;
	var maxNum = 0;
	var maxNumBase = 100;
	var maxNumAmp = 90;
	var maxNumRad = 0;
	var maxNumRadV = 0.001;
	
	//var baseHue = 0;
	
	var voronoi;	//Voronoi Generator
	var points;		//Series of Points
	var diagram;	//Result Voronoi Map
	var margin;		//Margin
	var boundingBox;	//BoundingBox
	
	var mouseX;
	var mouseY;

	var rgb = [
		{
			r: 0.447,
			g: 0.76,
			b: 0.678
		},
		{
			r: 0.529,
			g: 0.78,
			b: 0.63
		},
		{
			r: 0.627,
			g: 0.803,
			b: 0.56
		},
		{
			r: 0.713,
			g: 0.827,
			b: 0.482
		}
	]
	var colours = ['#72c2ad', '#87c7a3', '#a0cd8f', '#b6d37b', '#c5d76a', '#c5d76a', '#efefee', '#d9d9d6', '#27347b', '#2260ab', '#298dcc', '#52aedd', '#7ccdf3', '#7ccdf3', '#e8d3e7', '#e8d3e7'];

	function randomIntFromInterval(min,max) {
	    return Math.floor(Math.random()*(max-min+1)+min);
	}

	var hex;

	
	function setup(){
		voronoi = new Voronoi();

		//black background
	    var rect = new Path.Rectangle({
	        point: [0, 0],
	        size: [view.size.width, view.size.height],
	        strokeColor: '#fff',
	        selected: true
	    });

	    rect.sendToBack();
	    rect.fillColor = '#fff';

		reset();
	}
	
	function reset(){
		timeCnt = 0;
		//baseHue += 20 + Math.random()*120;
		if(Math.random()<0.3){
			maxNodeNum = Math.random()* 5+1;
		}else if(Math.random()<0.5){
			maxNodeNum = Math.random()* 10+10;
		}else{
			maxNodeNum = Math.random()* 20+40;
		}
		forceAmp = (Math.random()<0.8)? Math.random()*3 + 0.05 : Math.random()*-10-5;
		frictionAmp = Math.random()*0.4 + 0.5;
		
		//Seup Voronoi
		boundingBox = {xl:0, xr:view.size.width, yt:0, yb:view.size.height};
		points = [];
		
		for(var i=0; i<maxNodeNum; i++){
			var pt = new Node(Math.random()*view.size.width, Math.random()*view.size.height);
			var v = Math.random()*.2; //used to be 3
			var rad = Math.random()*360*Math.PI/180;
			pt.vx = Math.cos(rad)*v;
			pt.vy = Math.sin(rad)*v;
			points.push(pt);
		}
		diagram = voronoi.compute(points, boundingBox);
	}
	
	
	function onMouseDown(event){
		reset();
	}
	
	
	function onMouseUp(event){
	}
	
	function onMouseMove(event){
		var mpos = event.point;
		mouseX = mpos.x;
		mouseY = mpos.y;
	}


	function onFrame(event){
		/*
		timeCnt++;
		if(timeCnt>maxTimeCnt){
			reset();
			return;
		}*/
		
		applyForce();
		
		update();
		draw();
	}
	
	function applyForce(){

	}


	function onResize(event){
		reset();
	}
	
	function update(){
		createNode();
		for(var i=0; i<points.length; i++){
			var nd = points[i];
			
			nd.x += nd.vx;
			nd.y += nd.vy;
			
			if(nd.x<0){
				nd.x = 0;
				nd.vx = Math.abs(nd.vx);
			}else if(nd.x > view.size.width){
				nd.x = view.size.width;
				nd.vx = -Math.abs(nd.vx);
			}
			
			if(nd.y<0){
				nd.y = 0;
				nd.vy = Math.abs(nd.vy);
			}else if(nd.y > view.size.height){
				nd.y = view.size.height;
				nd.vy = -Math.abs(nd.vy);
			}
			
			//nd.fx = 0;
			//nd.fy = 0;
		}
	}
	
	function draw(){
		if(diagram){
			voronoi.recycle(diagram);
		}
		diagram = voronoi.compute(points, boundingBox);
		project.activeLayer.removeChildren();
		
		var cells = diagram.cells;
		
		var n = cells.length;
		for(var i=0; i<n; i++){
			var cell = cells[i];
			var cellPath = new Path();
			cellPath.closed = true;
			cellPath.fillColor = cell.site.color;
			cellPath.fillColor.alpha = cell.site.alpha;
			//cellPath.strokeColor = cell.site.color;
			//cellPath.strokeColor.alpha = cell.site.alpha;
			var halfEdges = cell.halfedges;
			for(j=0; j<halfEdges.length; j++){
				var pt = halfEdges[j].getEndpoint();
				cellPath.add(new Point(pt));
			}	
		}
		
	}


	function createNode(){	
	}
	
	
	var Node = function(x, y){
		this.x = x;
		this.y = y;
		this.vx = 0;
		this.vy = 0;
		this.fx = 0;
		this.fy = 0;
		this.friction = frictionAmp;
		/*var r = Math.random()*1;
		var g = Math.random()*r;
		var b = Math.random()*g;*/

		var i = randomIntFromInterval(0, (colours.length -1));
		//var col = new Color(r, g, b );
		//col.hue = baseHue;
		this.alpha = Math.random();
		//this.color = col;
		this.color = colours[i];
	}
	
	Node.prototype.update = function(){
	}
	
	
	setup();