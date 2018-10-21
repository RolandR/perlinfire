

var canvasContainer = document.getElementById("canvasContainer");

var canvas = document.getElementById("renderCanvas");
var context = canvas.getContext("2d");

var scale = 1/5;

var height = ~~(canvasContainer.clientHeight*scale);
var width = ~~(canvasContainer.clientWidth*scale);

canvas.height = height;
canvas.width = width;

canvas.style.height = height +"px";
canvas.style.width = width +"px";

var seed = Math.random();
noise.seed(seed);

var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
var data = imageData.data;
var pos = 0;

var colorsR = new Uint8Array(256);
var colorsG = new Uint8Array(256);
var colorsB = new Uint8Array(256);

var colorMapCanvas = document.createElement("canvas");
var colorMapImg = document.createElement("img");
colorMapImg.onload = function(){
	colorMapCanvas.width = 256;
	colorMapCanvas.height = 1;
	var cContext = colorMapCanvas.getContext("2d");
	cContext.drawImage(colorMapImg, 0, 0);
	var imageData = cContext.getImageData(0, 0, 256, 1);
	for(var i = 0; i < 256; i++){
		colorsR[i] = imageData.data[i*4];
		colorsG[i] = imageData.data[i*4+1];
		colorsB[i] = imageData.data[i*4+2];
	}
}
colorMapImg.src = "incandescent.png";

step();

function step(){
	render();
	requestAnimationFrame(step);
}

function render(){
	
	for(var i = 0; i < data.length; i += 4){
		
		var x = (i/4) % width;
		var y = ~~((i/4)/width);
		
		res = ((width+height)/2)*0.2;
		value = 0;
		
		value += (noise.simplex3(x/res, y/res+2*pos, pos)/2+0.5) /2;
		res = res/2;
		value += (noise.simplex3(x/res, y/res+4*pos, pos)/2+0.5) /4;
		res = res/2;
		value += (noise.simplex3(x/res, y/res+8*pos, pos)/2+0.5) /8;
	
		value = value * Math.pow(y/height, 2);
		
		value = value * 1.4;
		value = Math.max(0, value);
		value = Math.min(1, value);
		
		data[i] = colorsR[~~((value)*255)];
		data[i+1] = colorsG[~~((value)*255)];
		data[i+2] = colorsB[~~((value)*255)];
		data[i+3] = 255;
		
	}
	
	pos+= 0.02;
	
	context.putImageData(imageData, 0, 0);
	
}

window.addEventListener("resize", function(e){
	height = ~~(canvasContainer.clientHeight*scale);
	width = ~~(canvasContainer.clientWidth*scale);

	canvas.height = height;
	canvas.width = width;

	canvas.style.height = height/scale +"px";
	canvas.style.width = width/scale +"px";
	
}, false);