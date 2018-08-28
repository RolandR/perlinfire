

var canvasContainer = document.getElementById("canvasContainer");

var canvas = document.getElementById("renderCanvas");
var context = canvas.getContext("2d");

var scale = 1/5;

var height = ~~(canvasContainer.clientHeight*scale);
var width = ~~(canvasContainer.clientWidth*scale);

canvas.height = height;
canvas.width = width;

canvas.style.height = height/scale +"px";
canvas.style.width = width/scale +"px";

var seed = Math.random();
noise.seed(seed);

var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
var data = imageData.data;
var pos = 0;

step();

function step(){
	render();
	requestAnimationFrame(step);
}

var colorsR = new Uint8Array(256);
var colorsG = new Uint8Array(256);
var colorsB = new Uint8Array(256);

function render(){
	
	for(var i = 0; i < data.length; i += 4){
		
		var x = (i/4) % width;
		var y = ~~((i/4)/width);
		
		res = ((width+height)/2)*0.2;
		value = 0;
		
		value += (noise.simplex3(x/res, y/res+3*pos, pos)/2+0.5) /2;
		res = res/2;
		value += (noise.simplex3(x/res, y/res+3*pos, pos)/2+0.5) /2;
		
		value = value * Math.pow(y/height, 2);
		
		data[i] = ~~((value*1.5)*255);
		data[i+3] = 255;
		
	}
	
	pos+= 0.01;
	
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