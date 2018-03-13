MyGame.screens['game-play'] = (function(game, graphics, input) {
	'use strict';
	
	var mouseCapture = false,
		myMouse = input.Mouse(),
		myKeyboard = input.Keyboard(),
		myTexture = null,
		cancelNextRequest = false,
		lastTimeStamp,
		bricks = [],
		ball = null;
	
	function initialize() {
		console.log('game initializing...');

		myTexture = graphics.Texture( {
			center : { x : 650, y : 750 },
			width : 200, height : 50,
			rotation : 0,
			moveRate : 400,			// pixels per second
			rotateRate : 3.14159,	// Radians per second
			color : "black"
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
						color : colors[colorCount] 
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
					color : "black"
					})
				);
			};
		};

		ball = graphics.Texture( {
			center : { x : 750, y : 725 },
			width : 50, height : 50,
			rotation : 3.14159/4,
			moveRate : 400,			// pixels per second
			rotateRate : 0,	// Radians per second
			color : "red"
		});



		//
		// Create the keyboard input handler and register the keyboard commands
		myKeyboard.registerCommand(KeyEvent.DOM_VK_A, myTexture.moveLeft);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_D, myTexture.moveRight);
		// myKeyboard.registerCommand(KeyEvent.DOM_VK_W, myTexture.moveUp);
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
		ball.moveBall();
		// myMouse.update(elapsedTime);
	}
	
	function render() {
		graphics.clear();
		myTexture.draw();
		for(var brick in bricks){
			bricks[brick].draw();
		}
		ball.drawBall();
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
