// ------------------------------------------------------------------
//
//
// ------------------------------------------------------------------

MyGame.graphics = (function() {
	'use strict';
	
	var canvas = document.getElementById('canvas-main'),
		context = canvas.getContext('2d');
	
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
			spec.center.x -= spec.moveRate * (elapsedTime / 1000);
		};
		
		that.moveRight = function(elapsedTime) {
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
		};
		
		that.drawBall = function() {
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
	};

	that.moveBall = (elapsedTime) => {
		

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
