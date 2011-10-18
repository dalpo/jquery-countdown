/*
 * jquery-counter plugin
 *
 * Copyright (c) 2009 Martin Conte Mac Donell <Reflejo@gmail.com>
 * Dual licensed under the MIT and GPL licenses.
 *
 * http://docs.jquery.com/License
 *
 * IE fix by Andrea Cardinale <a.cardinale@webandtech.it> [23 September 2009]
 * IE fix added by Giguashvili, Levan <levangig@gmail.com> [04 April 2011]
 */

(function($){

	jQuery.fn.countdown = function(userOptions) {
	
	  // Default options
	  var options = {
	    stepTime: 60,
	    // startTime and format MUST follow the same format.
	    // also you cannot specify a format unordered (e.g. hh:ss:mm is wrong)
	    format: "dd:hh:mm:ss",
	    startTime: "01:12:32:55",
	    digitImages: 6,
	    digitWidth: 53,
	    digitHeight: 77,
	    timerEnd: function(){},
	    image: "digits.png"
	  };

	  var digits = [], interval;

	  // Draw digits in given container
	  var createDigits = function(where) {

	    var c = 0;
			var tempStartTime = options.startTime = options.startTime.split('');
			var tempFormat = options.format = options.format.split('');

	    // Iterate each startTime digit, if it is not a digit
	    // we'll asume that it's a separator
	    for (var i = 0; i < tempStartTime.length; i++) {
	      if (parseInt(tempStartTime[i], 10) >= 0) {

	        elem = jQuery('<div/>').css({
	          // height: options.digitHeight * options.digitImages * 10, 
						height: options.digitHeight,
	          float: 'left', 
						background: 'url(\'' + options.image + '\') 0 0 no-repeat',
	          width: options.digitWidth
					}).addClass('cntDigit').attr('id', 'cnt_' + i);

	        digits.push(elem);
	        margin(c, -((parseInt(tempStartTime[i], 10) * options.digitHeight * options.digitImages)));
	        digits[c].__max = 9;
	        // Add max digits, for example, first digit of minutes (mm) has 
	        // a max of 5. Conditional max is used when the left digit has reach
	        // the max. For example second "hours" digit has a conditional max of 4 
	        switch (tempFormat[i]) {
	          case 'h':
	            digits[c].__max = (c % 2 == 0) ? 2: 9;
	            if (c % 2 == 0)
	              digits[c].__condmax = 4;
	            break;
	          case 'd': 
	            digits[c].__max = 9;
	            break;
	          case 'm':
	          case 's':
	            digits[c].__max = (c % 2 == 0) ? 5: 9;
	        }
	        ++c;
	      } else {
	        elem = jQuery('<div class="cntSeparator"/>').css({
						float: 'left'
					}).text(tempStartTime[i]);
				}
			
	      where.append(
					elem.wrap(
						jQuery('<div/>').addClass("cnt-itemWrapper")
					)
				);
	    }
	  };
  
	  // Set or get element margin
	  var margin = function(elem, val) {
	    if (val !== undefined) {
				if(jQuery.browser.msie) {
					return digits[elem].css({
						// marginTop: val+ 'px' 
						'background-position-y': val + "px"
					});
				} else {
					return digits[elem].css({
						// marginTop: val+ 'px' 
						'backgroundPosition': "0px " + val + "px"
					});
				}
			} else {
				if (jQuery.browser.msie) {
					var backgroundPos = digits[elem].css('background-position-y');
					// alert(backgroundPos);
					return parseInt(backgroundPos.replace('px', ''), 10);
				} else {
					var backgroundPos = digits[elem].css('backgroundPosition').split(' ');
					console.log("asd: " + backgroundPos[1]);
					return parseInt(backgroundPos[1].replace('px', ''), 10);
				}
			}
	    // return parseInt(digits[elem].css('marginTop').replace('px', ''), 10);
	  };

	  // Makes the movement. This is done by "digitImages" steps.
	  var moveStep = function(elem) 
	  {
	    digits[elem]._digitInitial = - (digits[elem].__max * options.digitHeight * options.digitImages);
	    return function _move() {
	      mtop = margin(elem) + options.digitHeight;
	      if (mtop == options.digitHeight) {
	        margin(elem, digits[elem]._digitInitial);
	        if (elem > 0) {
						moveStep(elem - 1)();
					} else {
					
	          clearInterval(interval);
	          for (var i=0; i < digits.length; i++) {
							margin(i, 0);
						}
	          options.timerEnd();

	          return;
	        }

	        if ((elem > 0) && (digits[elem].__condmax !== undefined) &&  (digits[elem - 1]._digitInitial == margin(elem - 1))) {
						margin(elem, -(digits[elem].__condmax * options.digitHeight * options.digitImages));
					}
        
	        return;
	      }

	      margin(elem, mtop);
	      if (margin(elem) / options.digitHeight % options.digitImages != 0) {
					setTimeout(_move, options.stepTime);
				}
      

	      if (mtop == 0) {
					digits[elem].__ismax = true;
				}
	    }
	  };

	  jQuery.extend(options, userOptions);
	  this.css({height: options.digitHeight, overflow: 'hidden'});
	  createDigits(this);
	  interval = setInterval(moveStep(digits.length - 1), 1000);
	};

})(jQuery);