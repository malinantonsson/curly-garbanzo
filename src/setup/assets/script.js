(function (window, document) {

	var art = [
	  	{
	  		'name': 'veronio',
	  		'src': './assets/scripts/veronio.js',
	  		'type': 'text/paperscript',
	  		'id': 'paperscope-1',
	  		'attrs': {
	  			'canvas': 'canvas'
	  		},
	  		'start': 'setup()',
	  		'reset': '',
	  		'kill': ''
	  	},
	  	{
	  		'name': 'fillfillfill2',
	  		'src': './assets/scripts/fillfillfill2.js',
	  		'type': 'text/paperscript',
	  		'id': 'paperscope-1',
	  		'attrs': {
	  			'canvas': 'canvas'
	  		},
	  		'start': 'setup()',
	  		'reset': '',
	  		'kill': ''
	  	},
	  	{
	  		'name': 'moire',
	  		'src': './assets/scripts/moire.js',
	  		'type': 'text/paperscript',
	  		'id': 'paperscope-1',
	  		'attrs': {
	  			'canvas': 'canvas'
	  		},
	  		'start': 'setup()',
	  		'reset': '',
	  		'kill': ''
	  	},
	  	{
	  		'name': 'proliferate',
	  		'src': './assets/scripts/proliferate.js',
	  		'type': 'text/paperscript',
	  		'id': 'paperscope-1',
	  		'attrs': {
	  			'canvas': 'canvas'
	  		},
	  		'start': 'setup()',
	  		'reset': '',
	  		'kill': ''
	  	},
	  	{
	  		'name': 'dot-parade',
	  		'src': './assets/scripts/dot-parade.js',
	  		'type': 'text/javascript',
	  		'id': 'paperscope-1',
	  		'attrs': {
	  			'canvas': 'canvas'
	  		},
	  		'start': 'setup()',
	  		'reset': '',
	  		'kill': ''
	  	}

	];

	/*{
	  		'name': 'three-rects',
	  		'src': './assets/scripts/three-rects.pde',
	  		'id': 'processing-code',
	  		'type': 'application/processing',
	  		'attrs': {
	  			'data-processing-target': 'canvas',
	  		},
	  		'start': 'setup()',
	  		'reset': '',
	  		'kill': ''
	  	},*/

	function getRandomInt(min, max) {
	  min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min)) + min;
	}

	var mappedArt = {};

	var digitalArt = {
		ui: {
			canvas: '',
			script: ''
		},
		start: function(animation){
			var s = this.ui.script;
			var canvas = this.ui.canvas;

			//console.log(paper.project);
			
			/*if( paper) {
				if(paper.project) {
					paper.project.activeLayer.removeChildren();
					
				}
			}*/

			var animation = animation;

			s.type = animation.type;
			s.id = animation.id;
			if(animation.attrs) {
				for (attr in animation.attrs) {
					s.setAttribute(attr, animation.attrs[attr]);
				}
			}

			s.setAttribute('src', animation.src);

			if( animation.type === 'text/paperscript' ) {
				//if paperscript, append script to DOM, remove ignore attribute and force paper to reload
				//document.head.appendChild(s);
				s.removeAttribute('data-paper-ignore');
				var res = paper.PaperScript.load(s);

			} else if ( animation.type === 'application/processing' ) {
				//if processing.js load the sketch 
				Processing.loadSketchFromSources(canvas, [animation.src]);

			} else if ( animation.type === 'text/javascript' ) {

				window.DotAnimate = true;
				if(window.DotInit) {
					window.DotInit();
				}
				/*window.setTimeout(function(){
					window.DotInit();

				}, 500);*/
				//if javascript, append file
				//document.head.appendChild(s);
			}

		},
		end: function() {

		},
		init: function(){
			var self = this;
			this.ui.canvas = document.querySelector('#canvas');
			this.ui.script = document.createElement('script');

			document.head.appendChild(this.ui.script);
			
			this.start(art[0]);

			var current = art[0];

			window.setInterval(function(){

				if(current.type  === 'text/paperscript') {
					paper.view.remove();
					var ctx = self.ui.canvas.getContext('2d');
					ctx.clearRect(0, 0, canvas.width, canvas.height);
				}
				
				if(current.type  === 'application/processing') {
					var proccessId = Processing.getInstanceById('canvas');
					if(proccessId) {
						proccessId.exit();
					}
				}

				if(current.type  === 'text/javascript') {
					//remove dot canvas element
					document.getElementById('dot-canvas').innerHTML = '';
				}

				var num = getRandomInt(0, art.length);
				//start a random animation
				self.start(art[num]);
				current = art[num];
				//self.start(art[num]);
			//}, 10000);
			}, 3000);

		
		}
	}
 
	window.onload = function() {
		digitalArt.init();
		window.digitalArt = digitalArt;
		
	};
})(window, document);