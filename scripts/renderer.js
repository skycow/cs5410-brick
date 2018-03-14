// ------------------------------------------------------------------
//
//
// ------------------------------------------------------------------

MyGame.graphics = (function() {
	'use strict';
	
	var canvas = document.getElementById('canvas-main'),
		context = canvas.getContext('2d');

	var score = 0;
	
	//
	// Place a 'clear' function on the Canvas prototype, this makes it a part
	// of the canvas, rather than making a function that calls and does it.
	CanvasRenderingContext2D.prototype.clear = function() {
		this.save();
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.clearRect(0, 0, canvas.width, canvas.height);
		this.restore();
	};
	
	//------------------------------------------------------------------
	//
	// Public method that allows the client code to clear the canvas.
	//
	//------------------------------------------------------------------
	function clear() {
		context.clear();
	}
	
	//------------------------------------------------------------------
	//
	// This is used to create a texture object that can be used by client
	// code for rendering.
	//
	//------------------------------------------------------------------
	function Texture(spec) {
		var that = {};

		that.getSpec = function(){
			return spec;
		};
			
		that.updateRotation = function(angle) {
			spec.rotation += angle;
		};
		
		that.rotateRight = function(elapsedTime) {
			spec.rotation += spec.rotateRate * (elapsedTime / 1000);
		};
		
		that.rotateLeft = function(elapsedTime) {
			spec.rotation -= spec.rotateRate * (elapsedTime / 1000);
		};
		
		that.moveLeft = function(elapsedTime) {
			if(spec.center.x - spec.moveRate * (elapsedTime / 1000) > 25)
			spec.center.x -= spec.moveRate * (elapsedTime / 1000);
		};
		
		that.moveRight = function(elapsedTime) {
			if(spec.center.x + spec.moveRate * (elapsedTime / 1000) < 1275)
			spec.center.x += spec.moveRate * (elapsedTime / 1000);
		};
		
		that.moveUp = function(elapsedTime) {
			spec.center.y -= spec.moveRate * (elapsedTime / 1000);
		};
		
		that.moveDown = function(elapsedTime) {
			spec.center.y += spec.moveRate * (elapsedTime / 1000);
		};
		
		that.moveTo = function(center) {
			spec.center = center;
		};
		
		that.draw = function() {
			if(!spec.broken){
				context.save();
				
				context.translate(spec.center.x, spec.center.y);
				context.rotate(spec.rotation);
				context.translate(-spec.center.x, -spec.center.y);
				
				// context.drawImage(
				// 	image, 
				// 	spec.center.x - spec.width/2,
				// 	spec.center.y - spec.height/2,
				// 	spec.width, spec.height);

				context.beginPath();
				context.fillStyle = spec.color;
				context.rect(spec.center.x, spec.center.y, spec.width, spec.height);
				context.fill();

				// context.beginPath();
				// context.fillStyle = "#435a6b";
				// context.font = "48px serif";
				// context.fillText("Hello",40,200);

				// context.beginPath();
				// context.fillStyle = "#435a6b";
				// context.font = "20px Georgia";
				// context.fillText("Hello World!", 10, 200);
				// context.fill();
				
				context.restore();
			}
		};

		function getPoints(brickColor) {
			switch(brickColor){
				case "yellow":
					return 1;
					break;
				case "orange":
					return 2;
					break;
				case "blue":
					return 3;
					break;
				case "green":
					return 5;
					break;
				default:
					return 0;
			}
		};

		that.checkCollisions = function(ballSpec, paddle){
			if((spec.color != "black" || paddle) && !spec.broken){

				//north/south hit
				if(ballSpec.center.x > spec.center.x && ballSpec.center.x < spec.center.x+spec.width){
					//north hit
					if(ballSpec.center.y+ballSpec.height/2 > spec.center.y && ballSpec.center.y+ballSpec.height/2 < spec.center.y+spec.height){
						if(!paddle)
						spec.broken = true;
						ballSpec.direction.y = -ballSpec.direction.y;	
						ballSpec.center.y = spec.center.y-ballSpec.height/2;
						score += getPoints(spec.color);
					}else if(ballSpec.center.y-ballSpec.height/2 > spec.center.y && ballSpec.center.y-ballSpec.height/2 < spec.center.y+spec.height){
						if(!paddle)						
						spec.broken = true;
						ballSpec.direction.y = -ballSpec.direction.y;	
						score += getPoints(spec.color);
					}
				} 
				if(ballSpec.center.y > spec.center.y && ballSpec.center.y < spec.center.y+spec.height){
					//north hit
					if(ballSpec.center.x+ballSpec.width/2 > spec.center.x && ballSpec.center.x+ballSpec.width/2 < spec.center.x+spec.width){
						if(!paddle)
						spec.broken = true;
						ballSpec.direction.x = -ballSpec.direction.x;	
						ballSpec.center.x = spec.center.x-ballSpec.width/2;
						score += getPoints(spec.color);
					}else if(ballSpec.center.x-ballSpec.width/2 > spec.center.x && ballSpec.center.x-ballSpec.width/2 < spec.center.x+spec.width){
						if(!paddle)
						spec.broken = true;
						ballSpec.direction.x = -ballSpec.direction.x;	
						ballSpec.center.x = spec.center.x+spec.width+ballSpec.width/2;
						score += getPoints(spec.color);
					}
				}
			}

		};

		that.checkBounce = function() {


		};
		
		that.drawBall = function() {
			if(spec.active){

				context.save();
				
				context.translate(spec.center.x, spec.center.y);
				context.rotate(spec.rotation);
				context.translate(-spec.center.x, -spec.center.y);
				
				// context.drawImage(
				// 	image, 
				// 	spec.center.x - spec.width/2,
				// 	spec.center.y - spec.height/2,
				// 	spec.width, spec.height);
	
				context.beginPath();
				context.fillStyle = spec.color;
				context.arc(spec.center.x, spec.center.y, spec.width/2, 0, 2*Math.PI);
				context.fill();
	
				// context.beginPath();
				// context.fillStyle = "#435a6b";
				// context.font = "48px serif";
				// context.fillText("Hello",40,200);
	
				// context.beginPath();
				// context.fillStyle = "#435a6b";
				// context.font = "20px Georgia";
				// context.fillText("Hello World!", 10, 200);
				// context.fill();
				
				context.restore();
			}
	};

	that.moveBall = (elapsedTime) => {
		
		spec.center.x += (elapsedTime * spec.moveRate * spec.direction.x);
		if(spec.center.x+spec.width/2 < 100 || spec.center.x+spec.width/2 > 1450 )
			spec.direction.x = -spec.direction.x;
		spec.center.y += (elapsedTime * spec.moveRate * spec.direction.y);
		if(spec.center.y+spec.width/2 < 100)
		spec.direction.y = -spec.direction.y;
		if( spec.center.y+spec.width/2 > 800 ){
			spec.center.x = 750;
			spec.center.y = 725;
			spec.direction.x = Math.cos(-3.14159/4);
			spec.direction.y = Math.sin(-3.14159/4);
		}

	}

		return that;
	}

	// function Brick(spec) {

	// 	var that = {};

	// 	that.draw = () => {
	// 		context.save();

			
	// 	}

	// };

	return {
		clear : clear,
		Texture : Texture
	};
}());
