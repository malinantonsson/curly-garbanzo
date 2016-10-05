(function (window, document) {
  
	var swipe = {
		init: function() {
			swipeTime = 800;
			setTime = 3500;

			var wrapper = document.querySelector('.grid');
			//var firstEl = document.querySelector('#grid-3x3_1');
			//var secondEl = document.querySelector('#grid-3x3_3');
			var firstEl = document.querySelector('.grid__animated--1');
			var secondEl = document.querySelector('.grid__animated--2');

			var start = function(){

				firstEl.classList.add('swipe-down');

				window.setTimeout(function() {
					firstEl.classList.add('swipe-right');
				}, swipeTime);

				window.setTimeout(function() {
					secondEl.classList.add('swipe-down');
				}, swipeTime * 2);

				window.setTimeout(function() {
					reverse();
				}, setTime);
			};



			var reverse = function() {
				secondEl.classList.remove('swipe-down');

				window.setTimeout(function() {
					firstEl.classList.remove('swipe-right');
				}, swipeTime);

				window.setTimeout(function() {
					firstEl.classList.remove('swipe-down');
				}, swipeTime * 2);

				window.setTimeout(function() {
					start();
				}, setTime);
			};

			start();

			

			//this.getClone(wrapper, firstCol);
		},
		getClone: function(wrapper, colToClone) {
			/*var self = this;

			var original = {
				el: colToClone,
				height: colToClone.offsetHeight
			}
			
			var cloned = original.el.cloneNode();

			cloned.id = 'grid-3x3_1--cloned';
			cloned.className = cloned.className + ' grid__item--cloned';
			cloned.style.height = original.height + 'px';

			wrapper.appendChild(cloned);
			console.log(cloned);

			window.setTimeout(function() {
				self.startSwipe(cloned);
			}, 500);*/
		}, 
		startSwipe: function(el) {
			/*el.style.height = "100%";

			window.setTimeout(function() {
				el.style.width = "66.6%";
			}, 500);*/
		}
	}


	window.onload = function() {
	  swipe.init();
	};
})(window, document);