MyGame.screens['game-play'] = (function(game, graphics, input) {
	'use strict';
	
	var mouseCapture = false,
		myMouse = input.Mouse(),
		myKeyboard = input.Keyboard(),
		myTexture = null,
		cancelNextRequest = false,
		lastTimeStamp,
		bricks = [],
		balls = [],
		ball = null,
		countdown = 3,
		second = 0,
		score = 0;
	
	function initialize() {
		console.log('game initializing...');

		myTexture = null;
		bricks = [];
		ball = null;
		countdown = 3;
		second = 0;
		score = 0;
		balls = [];

		graphics.reset();

		myTexture = graphics.Texture( {
			center : { x : 650, y : 750 },
			width : 200, height : 50,
			rotation : 0,
			moveRate : 2000,			// pixels per second
			rotateRate : 3.14159,	// Radians per second
			color : "black",
			broken: false 
		});

		var colors = ["black", "green", "green", "blue", "blue", "orange", "orange", "yellow", "yellow"];
		var colorCount = 0;
		for(var y = 0; y < 800; y += 50){
			for(var x = 50; x < 1500-50; x += 100){
				if(y < 50 || (y > 100 && y < 550)){
					bricks.push(graphics.Texture( {
						center : { x : x, y : y },
						width : 100-2, height : 50-2,
						rotation : 0,
						moveRate : 0,			// pixels per second
						rotateRate : 0,	// Radians per second
						color : colors[colorCount],
						broken: false 
						})
					);
				}
				
			};
			if(y < 50 || (y > 100 && y < 550))
			colorCount++;
		};

		var sides = [0,1500-50];
		for(var y = 0; y < 800; y += 100){
			for(var x in sides ){
				bricks.push(graphics.Texture( {
					center : { x : sides[x], y : y },
					width : 50-2, height : 100-2,
					rotation : 0,
					moveRate : 0,			// pixels per second
					rotateRate : 0,	// Radians per second
					color : "black",
					broken: false 
					})
				);
			};
		};

		balls.push(graphics.Texture( {
			center : { x : 750, y : 725 },
			width : 50, height : 50,
			rotation : -3.14159/4,
			direction: {x: Math.cos(-3.14159/4), y: Math.sin(-3.14159/4)},
			moveRate : .3,			// pixels per second
			rotateRate : 0,	// Radians per second
			color : "red",
			active: true
		}));



		//
		// Create the keyboard input handler and register the keyboard commands
		myKeyboard.registerCommand(KeyEvent.DOM_VK_A, myTexture.moveLeft);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_D, myTexture.moveRight);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_LEFT, myTexture.moveLeft);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, myTexture.moveRight);
		// myKeyboard.registerCommand(KeyEvent.DOM_VK_S, myTexture.moveDown);
		// myKeyboard.registerCommand(KeyEvent.DOM_VK_Q, myTexture.rotateLeft);
		// myKeyboard.registerCommand(KeyEvent.DOM_VK_E, myTexture.rotateRight);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
			//
			// Stop the game loop by canceling the request for the next animation frame
			cancelNextRequest = true;
			//
			// Then, return to the main menu
			game.showScreen('main-menu');
		});
		
		//
		// Create an ability to move the logo using the mouse
		// myMouse = input.Mouse();
		// myMouse.registerCommand('mousedown', function(e) {
		// 	mouseCapture = true;
		// 	myTexture.moveTo({x : e.clientX, y : e.clientY});
		// });

		// myMouse.registerCommand('mouseup', function() {
		// 	mouseCapture = false;
		// });

		// myMouse.registerCommand('mousemove', function(e) {
		// 	if (mouseCapture) {
		// 		myTexture.moveTo({x : e.clientX, y : e.clientY});
		// 	}
		// });
	}
	
	function update(elapsedTime) {
		myKeyboard.update(elapsedTime);
		if(!countdown){

			var keep = [];
			for(var ball in balls){
				if(balls[ball].getActive()){
					keep.push(balls[ball]);
				}
			}
			balls = keep;
			for(var ball in balls){
				balls[ball].moveBall(elapsedTime, balls.length);
				for(var brick in bricks){
					bricks[brick].checkCollisions(balls[ball].getSpec(),false, brick-14);
				}
				myTexture.checkCollisions(balls[ball].getSpec(),true, -1);
			}

			if(graphics.getShrink()){
				myTexture.updateWidth(100);
			}

			if(graphics.getAddBall()){
				balls.push(graphics.Texture( {
				center : { x : 750, y : 725 },
				width : 50, height : 50,
				rotation : -3.14159/4,
				direction: {x: Math.cos(-3.14159/4), y: Math.sin(-3.14159/4)},
				moveRate : .3,			// pixels per second
				rotateRate : 0,	// Radians per second
				color : "red",
				active: true
				}));
			}

			//myTexture.checkBounce(ball.getSpec());
		}else{
			second += elapsedTime/1000;
			if(second >= 1){
				countdown--;
				second = 0;
			}
		}
		// myMouse.update(elapsedTime);
	}
	
	function render() {
		graphics.clear();
		myTexture.draw();
		for(var brick in bricks){
			bricks[brick].draw();
		}
		for(var ball in balls){
			balls[ball].drawBall();;
		}
		graphics.drawScore();
		graphics.drawPads();
		countdown += graphics.getCountdown();
		if(countdown){
			myTexture.updateWidth(200);
			var canvas = document.getElementById("canvas-main");
			var ctx = canvas.getContext("2d");
			ctx.font = "300px Comic Sans MS";
			ctx.fillStyle = "red";
			ctx.textAlign = "center";
			ctx.fillText(countdown, canvas.width/2, canvas.height/2); 
		} else if (graphics.getPads() === 0 || graphics.getEnd()){
			var canvas = document.getElementById("canvas-main");
			var ctx = canvas.getContext("2d");
			ctx.font = "200px Comic Sans MS";
			ctx.fillStyle = "red";
			ctx.textAlign = "center";
			ctx.fillText("Game Over", canvas.width/2, canvas.height/2);
			ctx.font = "30px Comic Sans MS";
			ctx.fillText("Press ESC key to contine", canvas.width/2, canvas.height/2+80);
		}
		
	}
	
	//------------------------------------------------------------------
	//
	// This is the Game Loop function!
	//
	//------------------------------------------------------------------
	function gameLoop(time) {
		
		update(time - lastTimeStamp);
		lastTimeStamp = time;
		
		render();

		if (!cancelNextRequest) {
			requestAnimationFrame(gameLoop);
		}
	}
	
	function run() {
		lastTimeStamp = performance.now();
		//
		// Start the animation loop
		cancelNextRequest = false;
		requestAnimationFrame(gameLoop);
	}
	
	return {
		initialize : initialize,
		run : run
	};
}(MyGame.game, MyGame.graphics, MyGame.input));
