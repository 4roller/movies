var lazyloadJS = (function(){
	var ww, wh, imageArr2;
	var imageArr = [];
	return {
		getWindowSize: function() {
			ww = window.innerWidth;
			wh = window.innerHeight;
			//console.log(ww,wh);
		},
		init: function() {
			lazyloadJS.getWindowSize();
			imageArr2 = document.getElementsByTagName('img');
			
			for(var i = 0; i<imageArr2.length; i++) {
				imageArr.push(imageArr2[i]);
			} 
			
			lazyloadJS.check();
			lazyloadJS.addListeners();
		},
		getArr: function() {
			return imageArr;
		},
		check: function() {

			for(var i = imageArr.length-1; i>= 0; i--) {
				if( lazyloadJS.calcOffsets(imageArr[i]).left <= ww  ) {
					var src = imageArr[i].getAttribute('data-src');
					if(src != 'undefined' && src != null) { 
						imageArr[i].setAttribute('src', src);
						imageArr.splice(i,1);
					}
				}

			}

		},
		calcOffsets: function(el) {
			var offset = {};
			offset.left = 0;
			offset.top = 0;

			while(el.tagName != 'HTML') {
				offset.left += el.offsetLeft;
				offset.top += el.offsetTop;
				el = el.parentNode;
			}
			return offset;
		},
		addListeners: function() {
			window.addEventListener('resize',lazyloadJS.getWindowSize, false);
			window.addEventListener('scroll',lazyloadJS.check, false);
		}


	}

})();

