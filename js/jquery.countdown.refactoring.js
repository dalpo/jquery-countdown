/*
 * jquery-counter plugin
 *
 * Refactoring of http://jquery-countdown.googlecode.com
 */

(function($){

	var default_options = {
		stepTime: 60,
    // startTime and format MUST follow the same format.
    // also you cannot specify a format unordered (e.g. hh:ss:mm is wrong)
    format: "dd:hh:mm:ss",
    startTime: "01:12:32:55",
    digitImages: 6,
    digitWidth: 53,
    digitHeight: 77,
    timerEnd: function() {},
    image: "img/digits.png",
		spacer: ":"
	}

	var moveStep = function(elem) {
	
    digits[elem]._digitInitial = - (digits[elem].__max * options.digitHeight * options.digitImages);

    return function _move() {

      mtop = yBackground(elem) + options.digitHeight;
      if (mtop == options.digitHeight) {
        yBackground(elem, digits[elem]._digitInitial);

        if (elem > 0) {
					moveStep(elem - 1)();
				} else {
				
          clearInterval(interval);
          for (var i=0; i < digits.length; i++) {
						yBackground(i, 0);
					}
          options.timerEnd();

          return;
        }

        if ((elem > 0) && (digits[elem].__condmax !== undefined) &&  (digits[elem - 1]._digitInitial == yBackground(elem - 1))) {
					yBackground(elem, -(digits[elem].__condmax * options.digitHeight * options.digitImages));
				}
      
        return;
      }

      yBackground(elem, mtop);
      if (yBackground(elem) / options.digitHeight % options.digitImages != 0) {
				setTimeout(_move, options.stepTime);
			}
    
    }
  };

  // Set or get element backgroundPosition
  function yBackground(elem, val) {
    if (val !== undefined) {
			if(jQuery.browser.msie) {

				return elem.css({
					'background-position-y': val + "px"
				});

			} else {

				return elem.css({ 
					'backgroundPosition': "0px " + val + "px"
				});

			}
		} else {
			if (jQuery.browser.msie) {

				var backgroundPos = elem.css('background-position-y');
				return parseInt(backgroundPos.replace('px', ''), 10);

			} else {

				var backgroundPos = elem.css('backgroundPosition').split(' ');
				return parseInt(backgroundPos[1].replace('px', ''), 10);

			}
		}
  };


	var methods = {
		init : function( options ) {
			
			options = $.extend({}, default_options, options);
			
			return this.each(function(){

				var $this = $(this),
						data = $this.data('countdown'),
						countdown = null,
						digits = [], 
						interval = null;

				// If the plugin hasn't been initialized yet
				if ( ! data ) {
					/*Do more setup stuff here*/
					var c = 0;
					var offset = Math.abs(options.format.length - options.startTime.length);
					
					options.startTime = options.startTime.split('');
					options.format = options.format.split('');
					
				  $this.css({
						height: options.digitHeight, 
						overflow: 'hidden'
					});

			    // Iterate each startTime digit, if it is not a digit
			    // we'll asume that it's a separator
			    for (var i = 0; i < options.startTime.length; i++) {
						var digitValue = parseInt(options.startTime[i], 10);
						var $elem = $('<div/>');
						
			      if (!isNaN( digitValue )) {

			        $elem.css({
								height: options.digitHeight,
								float: 'left', 
								background: 'url(\'' + options.image + '\') 0 0 no-repeat',
								width: options.digitWidth
							}).addClass('cntDigit').attr('id', 'cnt_' + i);

							digits.push($elem);
							yBackground(c, -(digitValue * options.digitHeight * options.digitImages));

							// Add max digits, for example, first digit of minutes (mm) has 
							// a max of 5. Conditional max is used when the left digit has reach
							// the max. For example second "hours" digit has a conditional max of 4 
							digits[c].__max = 9;
							
			        switch (options.format[i - offset]) {
								case 'd': 
			            digits[c].__max = 9;
			            break;

			          case 'h':
									if (c % 2 == 0) {
										digits[c].__condmax = 4;
										digits[c].__max = 2;
									} else {
										digits[c].__max = 9;
									}
			            break;
			          case 'm':
			          case 's':
			            digits[c].__max = (c % 2 == 0) ? 5 : 9;
			        }
			        c++;

			      } else {

							$elem.css({
								float: 'left'
							}).addClass('cntSpacer')
							.text(options.spacer);

						}

			      $this.append( $elem );

			    }//endFor
					
					
					interval = setInterval( moveStep(digits.length - 1), 1000 );
				
					$this.data('countdown', {
						target: $this,
						options: options,
						countdown: countdown
					});

				}
			});
		},
		destroy : function( ) {

			return this.each(function(){

				var $this = $(this),
				data = $this.data('countdown');

				// Namespacing FTW
				// $(window).unbind('.countdown');
				data.countdown.remove();
				$this.removeData('countdown');

			});

		}

	};

	$.fn.countdown = function( method ) {
  
	  if ( methods[method] ) {
	    return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
	  } else if ( typeof method === 'object' || ! method ) {
	    return methods.init.apply( this, arguments );
	  } else {
	    $.error( 'Method ' +  method + ' does not exist on jQuery.countdown' );
	  }    

	};

})(jQuery);
