//For Setup Pixi

var scale = 2;
var triangleRadius = 20 * scale;
var dotRadius = 4 * scale;
var triW = 34.641 * scale;
var triH = 30 * scale;
var dots;
var time;


function reset(){
	resize();
	time = 0;
	dots = [];
	
	var n = (width / triW) + 2;
	var m = (height / triH) + 2;
	
	for(var i=-2; i<n; i++){
		for(var j=-2; j<m; j++){
			var d = new Dot();
			d.x = i * triW + j%2 * triW *0.5;
			d.y = j * triH;
			dots.push(d);
		}
	}
}


function animate(){
	graphics.clear();

	if(!window.DotAnimate) { return; }

	
	time += 0.02;
	if(time>3){
		time = 0;
	}
	var n = dots.length;
	for(var i=0; i<n; i++){
		dots[i].loop = Math.floor(time);
		dots[i].interpolation = time - dots[i].loop;
		dots[i].update();
		dots[i].draw();
	}
	
	renderer.render(stage);
    requestAnimationFrame( animate );
}



function Dot(){
	this.x = 0;
	this.y = 0;
	this.loop = 0;
	this.radius;
	this.interpolation = 0;
}

Dot.prototype.update = function(){
}

Dot.prototype.draw = function(){
	graphics.blendMode = PIXI.BLEND_MODES.MULTIPLY;
	
	var distRad = this.interpolation * Math.PI;
	
	var dist = Math.cos(distRad)*20 + 20;
	var rad0 = 90 * Math.PI / 180;
	var offsetX0 = Math.cos(rad0) * dist;
	var offsetY0 = Math.sin(rad0) * dist;
	
	var rad1 = -30 * Math.PI / 180;
	var offsetX1 = Math.cos(rad1) * dist;
	var offsetY1 = Math.sin(rad1) * dist;
	
	var rad2 = 210 * Math.PI / 180;
	var offsetX2 = Math.cos(rad2) * dist;
	var offsetY2 = Math.sin(rad2) * dist;
	offsetX0 -= Math.cos(rad0) * 40 * this.loop;
	offsetY0 -= Math.sin(rad0) * 40 * this.loop;
	offsetX1 -= Math.cos(rad1) * 40 * this.loop;
	offsetY1 -= Math.sin(rad1) * 40 * this.loop;
	offsetX2 -= Math.cos(rad2) * 40 * this.loop;
	offsetY2 -= Math.sin(rad2) * 40 * this.loop;
	
	this.radius = Math.sin(distRad)*4+8;
	
	graphics.beginFill(0x00a0e9, 1);
	//graphics.drawCircle(this.x + offsetX0, this.y + offsetY0, this.radius);

	graphics.moveTo(this.x + offsetX0,this.y + offsetY0); //top point
	graphics.lineTo(this.x + offsetX0 +15, this.y + offsetY0 + 20); //left
	graphics.lineTo(this.x + offsetX0 -15, this.y + offsetY0 + 20); //right

	graphics.endFill();
	
	graphics.beginFill(0xe4007f, 1);
	//graphics.drawCircle(this.x + offsetX1, this.y + offsetY1, this.radius);
	
	graphics.moveTo(this.x + offsetX1,this.y + offsetY1);
	graphics.lineTo(this.x + offsetX1 +15, this.y + offsetY1 + 20);
	graphics.lineTo(this.x + offsetX1 -15, this.y + offsetY1 + 20);

	graphics.endFill();
	
	graphics.beginFill(0xfff100, 1);
	//graphics.drawCircle(this.x + offsetX2, this.y + offsetY2, this.radius);
	

	graphics.moveTo(this.x + offsetX2,this.y + offsetY2);
	graphics.lineTo(this.x + offsetX2 +15, this.y + offsetY2 + 20);
	graphics.lineTo(this.x + offsetX2 -15, this.y + offsetY2 + 20);
	graphics.endFill();
}


/*
------------------------------------------------
  GENERAL SETUP
------------------------------------------------
*/
var renderer;
var stage;
var graphics;
var background;
var width;
var height;

window.onresize = function(){
	reset();
}

document.onmousedown = function(){
	reset();
}

function resize(){
	width = window.innerWidth;
	height = window.innerHeight;
	renderer.view.style.width = width + "px";
	renderer.view.style.height = height + "px";
	renderer.resize(width,height);
	
	background.beginFill(0xffffff,1);
	background.drawRect(0,0,width,height);
	background.endFill();
}

function init(){

	renderer = PIXI.autoDetectRenderer(window.innerWidth,window.innerHeight, null, true);
	document.getElementById('dot-canvas').appendChild(renderer.view);
	window.DotCanvas = renderer.view;
	
	stage = new PIXI.Container();


	window.DotContainer = stage;
	window.DotAnimate = true;
	
	background = new PIXI.Graphics();
	stage.addChild(background);

	graphics = new PIXI.Graphics();
	stage.addChild(graphics);
	
	
	reset();
	animate();
}



init();

window.DotInit = init;

