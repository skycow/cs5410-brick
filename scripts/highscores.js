MyGame.screens['high-scores'] = (function(game) {
	'use strict';
	
	function initialize() {
		document.getElementById('id-high-scores-back').addEventListener(
			'click',
			function() { game.showScreen('main-menu'); });
		document.getElementById('id-high-scores-reset').addEventListener(
			'click',
			function() { localStorage.scores = JSON.stringify([]);
			game.showScreen('high-scores'); });
	}
	
	function run() {
		var tosort = [];
		tosort = localStorage.getItem('scores');
		if(tosort !== null){
			tosort = JSON.parse(tosort);
			var sorted = [];
			sorted = tosort.sort().reverse();
			var str = "";
			for(var s in sorted){
				str += "<li>" + sorted[s] + "</li>";
			}
			var hse = document.getElementById('highscorelist');
			hse.innerHTML = str;
		}
	}
	
	return {
		initialize : initialize,
		run : run
	};
}(MyGame.game));
