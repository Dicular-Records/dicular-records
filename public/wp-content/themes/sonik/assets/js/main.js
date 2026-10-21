/**
 *
 *
 *
 *  Main Theme Script File
 *  ATTENTION: SOME EXTERNAL LIBRARIES MAY BE IMPORTED WITH CODEKIT IMPORT FUNCTION
 *  THE ORIGINAL FILES ARE IN THE THEME SUBFOLDERS SPECIFIED IN THE IMPORT STATEMENT
 *
 *
 *
 *  THIS FILE IS COMBINED AND MINIFIED INTO js/min/main-min.js
 *  TO USE THE OPEN VERSION, SET QT_DEBUG TO FALSE IN FUNCTIONS.PHP OR SET DEBUG TO YES IN THE THEME'S CUSTOMIZER
 *
 *
 * 	Dependencies:
 * 	==============================================
 * 	../soundmanager/script/berniecode-animator.js
 * 	../soundmanager/script/soundmanager2-nodebug-jsmin.js
 * 	../soundmanager/script/360player.js
 * 	../soundmanager/script/excanvas.js
 * 	materialize.min.js
 *  qt-360player.js
 *  modernizr.js
 *  classie.js
 *  flipclock.js
 *  particles.js
 *  qt-skywheel.js
 *  prettysocial.js
 *  qt-autoembedding.js
 *  owl.carousel.js
 *  jquerycookie.js
 *  skrollr.min.js
 *
 *
 * 	Parts of this file:
 * 	==================================================
 * 	01. Helpers
 * 	02. Check images loaded in a container
 * 	03. Tripleview Layout (moved in external file)
 * 	04. Parallax Backgrounds with blur by QantumThemes
 * 	05. Poly Decor (The polygons used as background in some pages) invented by QantumThemes. 
 * 	06. Detect when page is scrolled
 * 	07. Masonry templates 
 * 	08. Squared items
 * 	09. Responsive video resize
 * 	10. Load more
 * 	11. Gradient Overlay
 * 	12. Mobile navigation
 * 	13. Generic class switcher (toggle class or toggleclass)
 * 	14. Qt Tabs function powered vy velocity.js used in the menu extra tabs
 * 	15. Smooth scrolling
 *  16. media links transformation 
 *  17. Dynamic backgrounds
 *  18. Scroll Fire
 *  19. Dynamic maps
 *  20. Schedule grid switcher
 *  21. Add tab animation
 *  22. Collapsible items
 *  23. Gridstack Slideshow
 *  24. Gridstack Materialize Carousel
 *  25. Gridstack Owl Carousel
 *  26. Gridstack Skywheel
 *  27. Particles.js
 *  28. FlipClock
 *  29. Titles decoration
 *  30. Radio music player
 *  31. Sound destroy
 *  32. Preloader
 *  33. On screen resize reload page to reset functions
 *  34. qwLoadedTheme: Functions to execute once the contents are fully loaded 
 *  35. qwInitTheme
 *  36. Page Ready Trigger
 *  
 *  
 **/

/*====================================================================

CODEKIT PREPENDS:
THESE BELOW ARE NOT COMMENTS, BUT THE CODEKIT'S PREPEND FILES ENQUEUED IN MAIN-MIN.JS

====================================================================*/

// @codekit-prepend "../soundmanager/script/berniecode-animator.js";
// @codekit-prepend "../soundmanager/script/soundmanager2-nodebug.js";
// @codekit-prepend "../soundmanager/script/360player.js";
// @codekit-prepend "../soundmanager/script/excanvas.js";
// @codekit-prepend "jquerycookie.js";
// @codekit-prepend "materialize.min.js";
// @codekit-prepend "qt-360player.js";
// @codekit-prepend "modernizr.js";
// @codekit-prepend "classie.js";
// @codekit-prepend "flipclock.js";
// codekit-prepend "particles.js";
// @codekit-prepend "qt-skywheel.js";
// @codekit-prepend "prettysocial.js";
// @codekit-prepend "qt-autoembedding.js";
// @codekit-prepend "owl.carousel.js";
// @codekit-prepend "skrollr.min.js";
// codekit-prepend jquery.tripleview.js





// var $ = jQuery.noConflict(); // just in case

(function($){

	"use strict";

	/**====================================================================
	 *
	 *
	 * 	01. Helpers
	 *
	 * 
	 ====================================================================*/

	 //  Check mobile devices
	function mobilecheck() {
		var check = false;
		(function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	}

	// Helper: safe way to define callbacks
	function executeFunctionByName(functionName, context ) {
		var args = [].slice.call(arguments).splice(2);
		var namespaces = functionName.split(".");
		var func = namespaces.pop();
		for(var i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
		}
		return context[func].apply(this, args);
	}

	/**====================================================================
	 *
	 *
	 * 	02. Check images loaded in a container
	 *
	 * 
	 ====================================================================*/
	$.fn.imagesLoaded = function () {
			// get all the images (excluding those with no src attribute)
		var $imgs = this.find('img[src!=""]');
		// if there's no images, just return an already resolved promise
		if (!$imgs.length) {return $.Deferred().resolve().promise();}
		// for each image, add a deferred object to the array which resolves when the image is loaded (or if loading fails)
		var dfds = [];  
		$imgs.each(function(){
			var dfd = $.Deferred();
			dfds.push(dfd);
			var img = new Image();
			img.onload = function(){dfd.resolve();}
			img.onerror = function(){dfd.resolve();}
			img.src = this.src;
		});
		// return a master promise object which will resolve when all the deferred objects have resolved
		// IE - when all the images are loaded
		return $.when.apply($,dfds);
	}

	
	/**====================================================================
	 *
	 *
	 * 	03. Tripleview Layout (moved in external file)
	 *
	 * 
	 ====================================================================*/
	$.fn.qtInitTripleView = function () {
		if($("#qtvscontainer").length === 0){
			return;
		}
		if($("#qtvscontainer section").length === 0){
			return;
		}



		var container = document.getElementById( 'qtvscontainer' ),
			thecontainer = $("#qtvscontainer"),
			wrapper = container.querySelector( 'div.qt-vs-wrapper' ),
			sections = Array.prototype.slice.call( wrapper.querySelectorAll( 'section' ) ),
			links = Array.prototype.slice.call( container.querySelectorAll( 'header.qt-vs-header ul.qt-vs-nav > li' ) ),
			sectionsCount = sections.length,
			transEndEventNames = {
				'WebkitTransition': 'webkitTransitionEnd',
				'MozTransition': 'transitionend',
				'OTransition': 'oTransitionEnd',
				'msTransition': 'MSTransitionEnd',
				'transition': 'transitionend'
			},
			transEndEventName = transEndEventNames[Modernizr.prefixed( 'transition' )],
			eventtype = mobilecheck() ? 'touchstart' : 'click';

		// add navigation elements
		if( sectionsCount >= 3 && Modernizr.csstransforms3d ) {
			var current = 0,
				isAnimating = false;
			thecontainer.addClass('qt-vs-triplelayout');
			var createNavigation = function () {
				thecontainer.on("click", "#qtvtL", function(){
						navigate( 'left' );
				}).on("click", "#qtvtR", function(){
						navigate( 'right' );
				});
			};
			var cleanClasses = function() {
				sections.forEach( function( el, i ) {
						el.className = '';
				} );
				links.forEach( 
					function( el, i ){
						el.className = '';
					} 
				);
			};
			var navigate = function( dir ) {
				if( isAnimating ) {
						return false;
				}
				isAnimating = true;
				var invDir = dir === 'right' ? 'left' : 'right';
				classie.add( container, 'qt-vs-move-' + invDir );
				var l = current === 0 ? sectionsCount - 1 : current - 1,
					r = current < sectionsCount - 1 ? current + 1 : 0,
					nextE;
				if( dir === 'right' ) {
					nextE = r < sectionsCount - 1 ? r + 1 : 0;
				}
				else if( dir === 'left' ) {
					nextE = l > 0 ? l - 1 : sectionsCount - 1;
				}
				var nextSection = sections[ nextE ],
					nextLink = links[ nextE ];
				nextSection.className = '';
				nextLink.className = '';
				classie.add( nextSection, 'qt-vs-' + dir + '-outer' );
				classie.add( nextLink, 'qt-vs-nav-' + dir + '-outer' );
				var onTransitionEndFn = function() {
					nextSection.removeEventListener( transEndEventName, onTransitionEndFn );
					cleanClasses();
					if( dir === 'right' ) {
						classie.add( sections[ current ], 'qt-vs-left' );
						classie.add( sections[ r ], 'qt-vs-current' );
						classie.add( nextSection, 'qt-vs-right' );
						classie.add( links[ current ], 'qt-vs-nav-left' );
						classie.add( links[ r ], 'qt-vs-nav-current' );
						classie.add( nextLink, 'qt-vs-nav-right' );
						current = current < sectionsCount - 1 ? current + 1 : 0;
					}
					else if( dir === 'left' ) {
						classie.add( nextSection, 'qt-vs-left' );
						classie.add( sections[ l ], 'qt-vs-current' );
						classie.add( sections[ current ], 'qt-vs-right' );
						classie.add( nextLink, 'qt-vs-nav-left' );
						classie.add( links[ l ], 'qt-vs-nav-current' );
						classie.add( links[ current ], 'qt-vs-nav-right' );
						current = current > 0 ? current - 1 : sectionsCount - 1;
					}
					classie.remove( container, 'qt-vs-move-' + invDir );
					isAnimating = false;
				};
				nextSection.addEventListener( transEndEventName, onTransitionEndFn );
			};
			// assign the current, left and right classes to the respective sections
			classie.add( sections[ current ], 'qt-vs-current' );
			classie.add( sections[ current + 1 ], 'qt-vs-right' );
			classie.add( sections[ sectionsCount - 1 ], 'qt-vs-left' );
			// same for the header links
			classie.add( links[ current ], 'qt-vs-nav-current' );
			classie.add( links[ current + 1 ], 'qt-vs-nav-right' );
			classie.add( links[ sectionsCount - 1 ], 'qt-vs-nav-left' );
			createNavigation();
			links.forEach( function( el, i ) {
				el.addEventListener( eventtype, function( ev ) {
					ev.preventDefault();
					if( classie.has( el, 'qt-vs-nav-right' ) ) {
						navigate( 'right' );
					}
					else if ( classie.has( el, 'qt-vs-nav-left' ) ) {
						navigate( 'left' );
					}
					else {
						return false;
					}
				});
			} );
			
			// add keyboard events
			document.addEventListener( 'keydown', function( ev ) {
				var keyCode = ev.keyCode || ev.which,
					arrow = {
						left: 37,
						right: 39
					};
				switch (keyCode) {
					case arrow.left :
						navigate( 'left' );
						break;
					case arrow.right :
						navigate( 'right' );
						break;
				}
			} );
			// add swipe events
			if( mobilecheck() ) {
				Hammer( container ).on( 'swipeleft', function( ev ) {
					navigate( 'right' );
				});
				Hammer( container ).on( 'swiperight', function( ev ) {
					navigate( 'left' );
				});
			}
			/**
			 * While we load a tripleview page, it may appear smashed for a while, so is hidden via CSS until complete loading
			 */
			$(".qt-vs-container").addClass("active");
		} 

	};



	/**====================================================================
	 *
	 *
	 * 	04. Parallax Backgrounds with blur by QantumThemes
	 *
	 * 
	 ====================================================================*/

	$.fn.parallaxV3 = function(options) {
		var windowHeight = $(window).height();
		// Establish default settings
		var settings = $.extend({
			speed        : 0.15,
			blursize: 0
		}, options);
		 
		// Iterate over each object in collection
		return this.each( function() {
			var $this = $(this);
			var scrollTop = $(window).scrollTop();
			var offset = $this.offset().top;
			var height = $this.outerHeight();
			var yBgPosition = Math.round((offset - scrollTop) * settings.speed);
			$this.initialBlur = $this.attr("data-blurStart");
			$this.css({'background-position': 'center ' + yBgPosition + 'px', 
					"-webkit-filter": "blur("+$this.initialBlur+"px)",
					"-moz-filter": "blur("+$this.initialBlur+"px)",
					"-o-filter": "blur("+$this.initialBlur+"px)",
					"-ms-filter": "blur("+$this.initialBlur+"px)",
					"filter": "blur("+$this.initialBlur+"px)"
				});
			$this.blursize = $this.attr("data-blur");
			$this.scrolling =   $this.attr("data-scrolling");
			var scrollblur;

			if(!$("body").hasClass("mobile")){
				$(document).scroll(function(){
					scrollTop = $(window).scrollTop(),
					offset = $this.offset().top,
					height = $this.outerHeight(),
					scrollblur =  ($this.blursize * (scrollTop / 150));


					yBgPosition = Math.round((offset - scrollTop) * settings.speed);
					if($this.scrolling !== 'no'){
						$this.css('background-position', 'center ' + yBgPosition + 'px');
					}

					if ( $this.blursize > 0 ) {
						if ( scrollblur > 6 ) {
							scrollblur = 6;
						}
						if($this.initialBlur > scrollblur) scrollblur = $this.initialBlur;
						$this.css({
							"-webkit-filter": "blur("+scrollblur+"px)",
							"-moz-filter": "blur("+scrollblur+"px)",
							"-o-filter": "blur("+scrollblur+"px)",
							"-ms-filter": "blur("+scrollblur+"px)",
							"filter": "blur("+scrollblur+"px)"
						});
					}
				});
			}
		});
	}

	$.fn.parallaxBackground = function (targetContainer){
		if(undefined === targetContainer) {
			targetContainer = "body";
		}
		$(targetContainer + ' [data-type="background"]').each(function(){
			var bgobj = jQuery(this); // assigning the object 
			var qwbgimg = bgobj.attr("data-bgimageurl");
			if(qwbgimg !== "" && typeof(qwbgimg) !== "undefined"){
				bgobj.css({"background": "url("+qwbgimg+")",
					"background-size":"cover",
					"background-position":"center center",
					"background-repeat":"no-repeat" , 
					"background-attachment":"local",
					"-webkit-transform": "translate3d(0, 0, 0)" ,
					"-webkit-backface-visibility": "hidden",
					"-webkit-perspective": "1000" });

				bgobj.parallaxV3({  speed : -0.3  });
			}
		});
		return true;
	}



	/**====================================================================
	 *
	 *
	 *  05. Poly Decor (The polygons used as background in some pages) invented by QantumThemes. Copyright 2016 QantumThemes ( Igor Nardo )
	 *
	 * 
	 ====================================================================*/

	$.fn.parallaxPolydecor = function(){
		if($("body").hasClass("mobile")){
			return;
		}
		if($(".qt-polydecor").length < 1 && $(".qt-polydecor-page").length < 1){
			return;
		}
		var element1, element2, scrollTop;
		$('.qt-polydecor, .qt-polydecor-page > .kc_row, .qt-polydecor-page > .vc_row').not(".nopoly").each(function(){
			var container = $(this);
			container.wrapInner( "<div class='qt-polydecor-content'></div>");
			container.append('<div class="decor1"></div><div class="decor2"></div>');
			element1 = container.find(".decor1"),
			element2 = container.find(".decor2"); // assigning the object 
			var $this = $(this);
			var scrollTop = $(window).scrollTop();
			var offset = $this.offset().top;
			var height = $this.outerHeight();
			var speed1 = 100;
			var speed2 = 130;
			var scrollTop;
		 	var  offset = $this.offset().top,
			height = $this.outerHeight();
		});
		function updatePolydecor(e) {
			scrollTop = window.pageYOffset;
			$('.qt-polydecor, .qt-polydecor-page > .kc_row, .qt-polydecor-page > .vc_row').each(function(){
				var $this = $(this),
				offset = $this.offset().top,
				yBgPosition = Math.round((offset - scrollTop) );

				$this.find(".decor1").css({top: (yBgPosition * 0.98) +"px"});
				$this.find(".decor2").css({top: (yBgPosition * 0.6) +"px"});

			});
		}
		updatePolydecor();
		window.addEventListener('scroll', updatePolydecor, false);
		return true;
	}

	/**====================================================================
	 *
	 *
	 * 	06. Detect when page is scrolled
	 *
	 * 
	 ====================================================================*/
	$.fn.bodyScroll = function(){
		var timer;
		 var   theBodyScroll = $("#qtBody");
		function stickyScroll(e) {
			if( window.pageYOffset  > 0){
				theBodyScroll.addClass("qt-scrolled");
			}else{
				theBodyScroll.removeClass("qt-scrolled");
			}
		}
		window.addEventListener('scroll', stickyScroll, false);
	}


	/**====================================================================
	 *
	 *
	 *	07. Masonry templates (based on default Wordpress Masonry)
	 *
	 * 
	 ====================================================================*/
	$.fn.qtMasonry = function(targetContainer){
		if(undefined === targetContainer) {
				targetContainer = "#qtBody";
		}
		$(targetContainer).find('.masonrycontainer').each( function(i,c){
			var idc = $(c).attr("id");
			var container = document.querySelector('#'+idc);
			if(container){
				var msnry = new Masonry( container, {  itemSelector: '.ms-item',   columnWidth: '.ms-item' });
			}

		});
		return true;
	}

	/**====================================================================
	 *
	 *
	 *	08. Squared items
	 *	
	 * 
	 ====================================================================*/
	$.fn.qtSquaredItems = function(){
		$('.qtSquaredItem').each(function(i,c){
			var that = $(c),
				w = Math.round(that.width());
			that.height(w);

		});
		return true;
	}

	/**====================================================================
	 *
	 *
	 *	09. Responsive video resize
	 *
	 * 
	 ====================================================================*/
	$.fn.NewYoutubeResize = function  (){
		jQuery("iframe").each(function(i,c){ // .youtube-player

			var t = jQuery(this);
			if(t.attr("src")){
				var href = t.attr("src");
				if(href.match("youtube.com") || href.match("vimeo.com") || href.match("vevo.com")){
					var width = t.parent().width(),
						height = t.height();
					t.css({"width":width});
					t.height(width/16*9);
				}; 
			};
		});
	};


	/**====================================================================
	 *
	 *
	 *	10. Load more
	 *	
	 * 
	 ====================================================================*/
	$.fn.qtLoadMore = function(){
		$("body").on("click", "[data-loadmore]", function(e){
			e.preventDefault();
			//$.fn.preloaderVisibility(1);
			var that = $(this),
				link = that.attr("href"),
				callback = that.attr("data-callback"),
				buttonid = that.attr("data-buttonid"),
				container = that.attr("data-container"),
				text = that.find("span"),
				i = that.find("i");

			text.toggleClass("hidden");
			i.toggleClass("hidden");

			$.ajax({
				url: link,
				dataType   : "html",
				type       : "GET",
				success:function(data) {
					var list = $(container, data);
					var newbutton = $("#"+buttonid, data);
					$("#"+buttonid).remove();
					$(container).append(list.html());
					$(container).after(newbutton);
					//$.fn.preloaderVisibility(0);
					text.toggleClass("hidden");
					i.toggleClass("hidden");
					$("#qtBody").imagesLoaded().then(function(){
						if(callback){
							executeFunctionByName(callback, $, arguments);
						}
						if( !undefined === $.skrollrInstance) {
							$.skrollrInstance.refresh();
						}
						
						$.fn.NewYoutubeResize();
						$.fn.gridstackSlideshows();
						$.fn.transformlinks();
						$.fn.dynamicBackgrounds();
					});					
				},
				error: function () {
					window.location.replace(link);
				}
			});
		});
		return true;
	};


	/**====================================================================
	 *
	 * 
	 *	11. Gradient Overlay
	 *	
	 * 
	 ====================================================================*/
	$.fn.qtGradientOverlay = function(){
		$(".qt-gradientOverlay").append('<div class="qt-gradient-overlay qt-fade-to-paper"></div>');
		$(".qt-gradient-overlay").height($(this).parent().height());
		return true;
	}

	/**====================================================================
	 *
	 * 
	 *	12. Mobile navigation
	 *	
	 * 
	 ====================================================================*/
	$.fn.qtMobileNav = function(){
		 $("#nav-mobile").on("click","li.menu-item-has-children > a", function(e){
			var that = $(this).parent();
			e.preventDefault();
			if(that.hasClass("open")){
				that.removeClass("open");
			}else{
				that.addClass("open");
			}
			return true;
		});
		return true;
	}



	/**====================================================================
	 *
	 * 
	 *	13. Generic class switcher (toggle class or toggleclass)
	 *	
	 * 
	 ====================================================================*/
	$.fn.qtQtSwitch = function(){
		$("body").on("click","[data-qtswitch]", function(e){
			var that = $(this);
			e.preventDefault();
			$(that.attr("data-target")).toggleClass(that.attr("data-qtswitch"));
		});
		$("body").on("click", "[data-expandable]", function(e){
			e.preventDefault();
			var btn = $(this);
			var that = $(btn.attr("data-expandable"));
			if(!that.hasClass("open")) {
				that.addClass("open").height();

			
				that.velocity({
					properties: { height: that.find(".qt-expandable-inner").height()+"px" },
					options: { 
						duration: 500
						
					}
				});

				

			} else {
				that.removeClass("open").height();
				// that.height(0);
				that.velocity({
					properties: { height: 0 },
					options: { 
						duration: 500
					}
				});

			}

		});
	}


	/**====================================================================
	 *
	 * 
	 *	14. Qt Tabs function powered vy velocity.js used in the menu extra tabs
	 *	
	 * 
	 ====================================================================*/
	$.fn.qtQTabs = function(){
		$("body").off("click", ".qt-tabs-controller a.qt-tabswitch");
		$("body").on("click", ".qt-tabs-controller a.qt-tabswitch", function(e){
			e.preventDefault();
			var that = $(this),
				id = that.attr("href").split("#").join(""), //single tab id
				target = that.attr("data-target"), //container
				tab = $("#"+id), //tab
				allTargetedTabs = $(target +" .qt-tab"),
				openheight = $("#"+id + " .tabcontent").outerHeight();
			allTargetedTabs.each(function(i, c){
				var el = $(c),
					elid = el.attr("id");
				if(id === elid){
					if(el.hasClass("active")){
						// lo chiudo
						el.velocity({
							properties: { height: 0 },
							options: { 
								duration: 500,
								complete: function(){el.removeClass("active");} 
							}
						});
					}else{
						tab.velocity({
							properties: { height: openheight },
							options: { 
								duration: 500,
								complete: function(){tab.addClass("active").css({height:"auto"});} 
							}
						});
						$('html,body').animate({scrollTop:0}, 800, "easeOutBounce");
					}
				} else {
					if(el.hasClass("active")){
						el.velocity({
							properties: { height: 0 },
							options: { 
								duration: 500,
								complete: function(){el.removeClass("active");} 
							}
						});
					}
				}
			});
		});
	}


	/**====================================================================
	 *
	 * 
	 *	15. Smooth scrolling
	 *	
	 * 
	 ====================================================================*/
	$.fn.qtSmoothScroll = function(){
		var body = $("body");
		body.off("click",'a.qwsmoothscroll');
		body.on("click",'a.qwsmoothscroll', function(e){     
			e.preventDefault();
			$('html,body').animate({scrollTop:$(this.hash).offset().top}, 800);
		});
	}

	/**====================================================================
	 *
	 * 
	 *  16. media links transformation
	 *  
	 * 
	 ====================================================================*/
	$.fn.transformlinks = function (targetContainer) {
		if(undefined === targetContainer) {
			targetContainer = $("body");
		}
		targetContainer.find("a[href*='youtube.com'],a[href*='youtu.be'],a[href*='mixcloud.com'],a[href*='soundcloud.com'], [data-autoembed]").not('.qw-disableembedding').not('.vc_general').each(function(element) {
			var that = jQuery(this);


			// 2020 05 22
			// In this case, we embed the content only after opening the item
			var isInCollapsible = that.closest('.qt-archivepodcast-item');
			if( isInCollapsible.length > 0 ){
				if( !isInCollapsible.hasClass('active') ){
					return;
				}
			}

			// if( that.parent().hasClass('qt-event-details') && that.closest('qt-archivepodcast-item')){
			// 	return;
			// }
			var mystring = that.attr('href');
			if(that.attr('data-autoembed')) {
				mystring = that.attr('data-autoembed');
			}
			var width = that.parent().width();
			
			if(width === 0){
				width = that.parent().parent().parent().width();
			}
			if(width === 0){
				width = that.parent().parent().parent().width();
			}
			if(width === 0){
				 
				width = that.parent().parent().parent().parent().width();
			}
			var height = that.height();
			var element = that;

			//=== YOUTUBE https
			var expression = /(http|https):\/\/(\w{0,3}\.)?youtube\.\w{2,3}\/watch\?v=[\w-]{11}/gi;
			var videoUrl = mystring.match(expression);
			if (videoUrl !== null) {
				for (var count = 0; count < videoUrl.length; count++) {
					mystring = mystring.replace(videoUrl[count], embedVideo(videoUrl[count], width, (width/16*9)));
					replacethisHtml(mystring);
				}
			}               
			//=== SOUNDCLOUD
			var expression = /(http|https)(\:\/\/soundcloud.com\/+([a-zA-Z0-9\/\-_]*))/g;
			var scUrl = mystring.match(expression);
			if (scUrl !== null) {
				for (count = 0; count < scUrl.length; count++) {
					var finalurl = scUrl[count].replace(':', '%3A');
					finalurl = finalurl.replace("https","http");
					jQuery.getJSON('https://soundcloud.com/oembed?maxheight=140&format=js&url=' + finalurl + '&iframe=true&callback=?', function(response) {
						replacethisHtml(response.html);
					});
				}
			}
			//=== MIXCLOUD
			var expression = /(http|https)\:\/\/www\.mixcloud\.com\/[\w-]{0,150}\/[\w-]{0,150}\/[\w-]{0,1}/ig;
			videoUrl = mystring.match(expression);
			if (videoUrl !== null) {
				for (count = 0; count < videoUrl.length; count++) {
					mystring = mystring.replace(videoUrl[count], embedMixcloudPlayer(videoUrl[count]));
					replacethisHtml(mystring);
				}
			}
			//=== STRING REPLACE (FINAL FUNCTION)
			function replacethisHtml(mystring) {
				element.replaceWith(mystring);

			}
		});
		$.fn.NewYoutubeResize();
	}

	


	/**====================================================================
	 *
	 * 
	 *  17. Dynamic backgrounds
	 *  
	 * 
	 ====================================================================*/

	$.fn.dynamicBackgrounds = function(targetContainer){
		if(undefined === targetContainer) {
				targetContainer = "body";
		}
		$(targetContainer+" [data-bgimage]").each(function(i,c){
			var that = $(this),
				bg = that.attr("data-bgimage"),
				bgattachment = that.attr("data-bgattachment");
			if(bgattachment == undefined){
				 bgattachment = "static";
			}
			if(bg !== ''){
				that.css({"background-image":"url("+bg+")", "background-attachment":bgattachment,"background-size":"cover","background-position": "center center"});
			}
		});
		$(targetContainer+" [data-bgcolor]").each(function(i,c){
			var that = $(this),
				bgcolor = that.attr("data-bgcolor");
			if(bgcolor !== ""){
				if(that.attr("data-bgopacity")){
					var bgopacity = that.attr("data-bgopacity");
					var bgcolor = "rgba("+hexToRgb2(bgcolor)+","+(bgopacity/100)+")";
				}
				that.find(".fp-tableCell, .qw-fixedcontents-layer2, .qw-gbcolorlayer").css({"background-color":bgcolor});
			}
		});
	}



	/**====================================================================
	 *
	 * 
	 *  18. Scroll Fire
	 *  
	 * 
	 ====================================================================*/

	$.fn.qwScrollfireElements = function(){
		var options = [
			{selector: '.staggeredlist', offset: 200, callback: 'Materialize.fadeInImage(".staggeredlist")")' }
		];
		Materialize.scrollFire(options);
	}


	/**====================================================================
	 *
	 * 
	 *  19. Dynamic maps
	 *  
	 * 
	 ====================================================================*/

	var QT_map_light    = [{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"stylers":[{"hue":"#00aaff"},{"saturation":-100},{"gamma":2.15},{"lightness":12}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"lightness":24}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":57}]}];
	var QT_map_dark     = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]}];
	$.fn.dynamicMapsNew = function(targetContainer){
		if(undefined === targetContainer) {
				targetContainer = "body";
		}
		var map, mapOptions;
		$(targetContainer+" .qt_dynamicmaps").each(function(i,c){
			var that = $(c),
				coord = that.attr("data-coord").split(","),
				mylat = coord[0],
				mylon = coord[1],
				mapid = that.attr("id"),
				colors = that.attr("data-colors"),
				locationname = that.attr("data-locationname");
			var map = new google.maps.Map(document.getElementById(mapid), {
				zoom: 16, 
				styles: QT_map_dark, 
				center: new google.maps.LatLng(mylat, mylon), 
				mapTypeId: google.maps.MapTypeId.ROADMAP
			});
			var infowindow = new google.maps.InfoWindow();
			var marker, i;
			marker = new google.maps.Marker({
				position: new google.maps.LatLng(mylat,mylon),
				map: map
			});
			google.maps.event.addListener(marker, 'click', (function(marker, i) {
				return function() {
					infowindow.setContent(locationname);
					infowindow.open(map, marker);
				}
			})(marker, i));
		});
	}


	/**====================================================================
	 *
	 * 
	 *  20. Schedule grid switcher
	 *  
	 * 
	 ====================================================================*/
	$.fn.qtGridSwitcher = function(){
		$(".cbp-vm-switcher").on("click","a.cbp-vm-grid",function(e){
			e.preventDefault();
			$(".cbp-vm-switcher").removeClass("cbp-vm-view-list").addClass("cbp-vm-view-grid");
			$("a.cbp-vm-grid").addClass("active");
			$("a.cbp-vm-list").removeClass("active");
			$(this).addClass("active");
		});
		$(".cbp-vm-switcher").on("click","a.cbp-vm-list",function(e){
			e.preventDefault();
			$(".cbp-vm-switcher").removeClass("cbp-vm-view-grid").addClass("cbp-vm-view-list");
			$("a.cbp-vm-list").addClass("active");
			$("a.cbp-vm-grid").removeClass("active");
		});
		$( "#qwShowDropdown" ).change(function() {
			// udpated 2021 02 01
			var id = $(this).val().split('optionSchedule').join('');
			console.log(id);
			$(this).parent().parent().find(".tabcontent").addClass("inactive").css({'display': 'none'});
			$(this).parent().parent().find('#'+id).removeClass("inactive").css({'display': 'block'});
		});
	}



	/**====================================================================
	 *
	 * 
	 *  21. Add tab animation
	 *  
	 * 
	 ====================================================================*/
	 $.fn.atTabsAnimator = function(){
		$("body").on("click", ".tabs a", function(e){
			$(".tabcontent").addClass("inactive");
			$($(this).attr("href")).removeClass("inactive");
		});
	 }

	/**====================================================================
	*
	* 
	*  22. Collapsible items
	*  
	* 
	====================================================================*/
	$.fn.qtCollapsible = function(){
		$('.qt-archivepodcast-item .collapsible-header').on('click', function(){
			var that = $(this);
			// 2020 05 22 update because of new soundcloud embedding
			if( !that.hasClass('active') ){
				that.animate({"transform":'translateX(0.0000000001px)'}, 150, function(){
					$.fn.transformlinks( that.parent().find('.qt-event-details') );
				});
			}
		});
	}


	/**====================================================================
	*
	* 
	*  23. Gridstack Slideshow
	*  
	* 
	====================================================================*/

	$.fn.gridstackSlideshows = function(){
		$('.slider').each(function(i,c){
			var that = $(c);
			$(c).imagesLoaded().then(function(){
				var w = that.width(),
					h = w/16*7,
					QTindicators =  (that.attr("data-indicators") === "1" || that.attr("data-indicators") === "true"),
					QTtransition = that.attr("data-transition"),
					QTinterval = that.attr("data-interval"),
					QTfull_width = (that.attr("data-full_width") === "1" || that.attr("data-full_width") === "true"),
					QTproportion = that.attr("data-proportion");


				if($(window).width() < 500) {
					QTindicators = false;
				}


				if(QTinterval == undefined || QTinterval === "" ) {
					QTinterval = 3000;
				}
				if(QTtransition == undefined || QTtransition === "" ) {
					QTtransition = 500;
				}
				var atts = {
					transition: parseInt(QTtransition),
					interval: parseInt(QTinterval),
					full_width: QTfull_width,
					indicators:QTindicators
				};
				if('fullscreen' === QTproportion) {
					h = $(window).height();
					if($(window).width() > 760) {
						atts.height = h - 46;
					} else {
						atts.height = h;
					}
					that.find("slide").height(atts.height);
				} else if ( 'widescreen' === QTproportion ) {
					if($(window).width() > 760) {
						atts.height = h - 46;
					} else {
						atts.height = h;
					}
					that.find("slide").height(atts.height);
				} else {
					atts.height = parseInt(that.find("img").attr("height"));
					if($(window).width() > 760) {
						atts.height = atts.height - 46;
					}
					that.height(atts.height).find("slide").height(atts.height).find("slides").height(atts.height);
				}
				that.slider(atts).promise().done(function(){
					if(that.hasClass("qt-gridstackSlideshow")){
						that.height(atts.height).velocity({"opacity":1}, 800);
					}
				});
				that.find(".prev").click(function(){
					that.slider("prev");
				});
				that.find(".next").click(function(){
					that.slider("next");
				});
				that.find("a.qt-slideshow-link").mouseenter(function(){
					that.slider("pause");
				}).mouseleave(function(){
					that.slider("start");
				});
			});


		});
	}

	 

	/**====================================================================
	*
	* 
	*  24. Gridstack Materialize Carousel
	*  
	* 
	====================================================================*/

	$.fn.gridstackCarousel = function(){
		$('.qt-gridstackCarousel').each(function(i,c){
			var that = $(c),
				w = that.width(),
				h = w/16*7,
				QTtime_constant = that.attr("data-time_constant"),
				QTdist = that.attr("data-dist"),
				QTshift = that.attr("data-shift"),
				QTvpadding = that.attr("data-vpadding"),
				QTfull_width = (that.attr("data-full_width") === "1" || that.attr("data-full_width") === "true"),
				QTpadding = that.attr("data-padding");
			if(QTtime_constant == undefined || QTtime_constant === "" ) {
				QTtime_constant = 200;
			}
			if(QTdist == undefined || QTdist === "" ) {
				QTdist = -30;
			}
			if(QTshift == undefined || QTshift === "" ) {
				QTshift = 0;
			}
			if(QTpadding == undefined || QTpadding === "" ) {
				QTpadding = 0;
			}
			if(QTvpadding == undefined || QTvpadding === "" ) {
				QTvpadding = 0;
			}
			if(QTvpadding !== 0){
				that.css({"margin-top":QTvpadding,"margin-bottom":QTvpadding});
			} 
			var atts = {
				time_constant: parseInt(QTtime_constant),
				dist: parseInt(QTdist),
				padding: parseInt(QTpadding),
				shift:parseInt(QTshift)
			};
			that.carousel(atts);
			that.parent().find(".prev").click(function(){
				that.carousel("prev");
			});
			that.parent().find(".next").click(function(){
				that.carousel("next");
			});
			that.find(".carousel-item").on("mouseenter touchstart", function(e){
				var itemElem = $(this);
				itemElem.addClass("active");
				if($("body").hasClass("mobile")){
					setTimeout(
					function(){ 
						itemElem.removeClass("active"); 
					} ,  3000);
					that.find("a").on("touchstart", function(e){
						window.location.href = $(this).attr("href");
					});
				}
			}).on("mouseleave", function(){
				$(this).removeClass("active");
			});
		});
	}

	/**====================================================================
	*
	* 
	*  25. Gridstack Owl Carousel
	*  
	* 
	====================================================================*/

	$.fn.gridstackOwl = function(targetContainer){
		if(undefined === targetContainer) {
				targetContainer = "body";
		}
		if($(targetContainer+" .owl-carousel").length <=0) {
			return;
		}
		$(targetContainer+" .owl-carousel").each(function(i,c){
			var that = $(this);


			var	attributes = {
				items: parseInt(that.attr("data-items")),
				navigation:  (that.attr("data-nav") === "true" || that.attr("data-nav") === "1"),
				nav: (that.attr("data-nav") === "true" || that.attr("data-nav") === "1"),
				margin: parseInt(that.attr("data-margin")),
				dots: (that.attr("data-dots")  === "true"),
				navRewind: (that.attr("data-navRewind") === "true"),
				autoplayHoverPause: true,
				animateIn: true,
				animateOut: true,
				loop: true,//(that.attr("data-loop") === "true"),
				center: (that.attr("data-center") === "true" || that.attr("data-center") === "1"),
				mouseDrag: (that.attr("data-mouseDrag") === "true" || that.attr("data-mouseDrag") === "1"),
				touchDrag: (that.attr("data-touchDrag") === "true" || that.attr("data-touchDrag") === "1"),
				pullDrag: (that.attr("data-pullDrag") === "true" || that.attr("data-pullDrag") === "1"),
				freeDrag: (that.attr("data-freeDrag") === "true" || that.attr("data-freeDrag") === "1"),
				stagePadding: parseInt(that.attr("data-stagePadding")),
				mergeFit: (that.attr("data-mergeFit") === "true" || that.attr("data-mergeFit") === "1"),
				autoWidth: (that.attr("data-autoWidth") === "true" || that.attr("data-autoWidth") === "1"),
				autoplay: (that.attr("data-autoplay") === "true" || that.attr("data-autoplay") === "1"),
				autoplayTimeout: parseInt(that.attr("data-autoplaytimeout")),
				URLhashListener: (that.attr("data-URLhashListener") === "true" || that.attr("data-URLhashListener") === "1"),
				video: (that.attr("data-video") === "true"),
				videoHeight: (that.attr("data-videoHeight") === "true" || that.attr("data-videoHeight") === "1"),
				videoWidth: ( that.attr("data-videoWidth") === "true" || that.attr("data-videoWidth") === "1"),
				// autoplayTimeout: that.attr("data-autoplaytimeout") ,
				responsive:{
					0:{
						items:1,
						dots: false,
						loop:false
					},
					768:{
						items:3
					},
					1000:{
						items: parseInt(that.attr("data-items"))
					}
				}

			};
			switch (that.attr("data-arrowstyle")) {
				case "minimal": 
					attributes.navText = ['<span><i class="fa fa-chevron-left"></i></span>','<span><i class="fa fa-chevron-right"></i></span>']
					break;
				default:
					attributes.navText = ['<span class="qt-btn-rhombus btn"><i class="fa fa-chevron-left"></i></span>','<span class="qt-btn-rhombus btn"><i class="fa fa-chevron-right"></i></span>']
			}
			that.owlCarousel(attributes);
		});

	}

	/**====================================================================
	*
	* 
	*  26. Gridstack Skywheel
	*  
	* 
	====================================================================*/

	$.fn.gridstackSkywheel = function(){		
		$(".qt-gridstackSkywheel").each(function(i,c){
			var that= $(this),
				QTwheel = that.find("ul"),
				QTwidth = that.attr("data-width"),
				QTheight = that.attr("data-height");
			that.find("ul").css({"min-height":QTheight});
			QTwheel.skywheel({
				effect:1,
				width: QTwidth,
				height:QTheight, 
				keyOption: "updown"
			});
		});
	}


	/**====================================================================
	*
	*  27. Particles.js
	* 
	====================================================================*/

	$.fn.qtparticlesJs = function(){
		if($("body").hasClass("mobile")){
			return;
		}
		
		$(".qt-particles").each(function(i,c){
			var that= $(this),
					boxid = that.attr("id");
			particlesJS(boxid, {
				"particles": {
					"number": {
						"value": 12,
						"density": {
							"enable": true,
							"value_area": 1000
						}
					},
					"color": {
						"value": !that.attr("data-color") ? "#FFFFFF" : that.attr("data-color")
					},
					"shape": {
						"type": "polygon",
						"stroke": {
							"width": 0,
							"color": "#000000"
						},
						"polygon": {
							"nb_sides":  !that.attr("data-sides") ? "3" : that.attr("data-sides")
						}
					},
					"opacity": {
						"value":  !that.attr("data-opacity") ? "0.5" : that.attr("data-opacity"),
						"random": true,
						"anim": {
							"enable": true,
							"speed": 0.2,
							"opacity_min": 0,
							"sync": false
						}
					},
					"size": {
						"value": 8,
						"random": true,
						"anim": {
							"enable": false,
							"speed": 50,
							"size_min": 0.1,
							"sync": false
						}
					},
					"line_linked": {
						"enable": (that.attr("data-lines") === "1") ? true : false,
						"distance": 150,
						"color": !that.attr("data-color") ? "#FFFFFF" : that.attr("data-color"),
						"opacity": !that.attr("data-opacity") ? "0.5" : that.attr("data-opacity"),
						"width": 1
					},
					"move": {
						"enable": true,
						"speed": !that.attr("data-speed") ? 1 : that.attr("data-speed"),
						"direction": "none",
						"random": true,
						"straight": false,
						"out_mode": "out",
						"bounce": false,
						"attract": {
							"enable": false,
							"rotateX": 600,
							"rotateY": 1200
						}
					}
				},
				"interactivity": {
					"detect_on": "canvas",
					"events": {
						"onhover": {
							"enable": false,
							"mode": "grab"
						},
						"onclick": {
							"enable": false,
							"mode": "push"
						},
						"resize": false
					}
				},
				"retina_detect": true
			});
		});
	}



	/**====================================================================
	*
	* 
	*  28. FlipClock
	*  
	* 
	====================================================================*/

	$.fn.qtFlipClockJs = function(targetContainer){
		if(undefined === targetContainer) {
			targetContainer = "body";
		} 

		$(targetContainer+" .qtFlipClock").each(function(i,c){
			var that = $(c),
				deadline = that.attr("data-deadline"),
				today = that.attr("data-now");

			var currentDate = new Date(today);
			// Set some date in the future. In this case, it's always Jan 1
			var futureDate  = new Date(deadline);
			// Calculate the difference in seconds between the future and current date
			var diff = futureDate.getTime() / 1000 - currentDate.getTime() / 1000;
			// Instantiate a coutdown FlipClock
			var clock;
			clock = that.FlipClock(diff, {
				clockFace: 'DailyCounter',
				countdown: true
			});
		});
	}

	/**====================================================================
	*
	* 
	*  29. Titles decoration
	*  
	* 
	====================================================================*/

	$.fn.qtEqTit = function(targetContainer){
		if(undefined === targetContainer) {
			targetContainer = "body";
		} 
		 $(".qt-titdeco-eq").prepend('<i class="qteq"></i>');
	}

	/**====================================================================
	*
	*  30. Radio music player
	* 
	====================================================================*/

	$.fn.qtMusicPlayer = function(){
	    /* Volume controls ======================= */
	    $("body").on("click", "#qtRadioBtn", function(e){
	    	e.preventDefault();
	    	var p = $("#qwMusicPlayerContainer");
	    	p.toggleClass("open");
	    });
	    $.mainVolumeLevel = 100;

	    if(undefined !==  $.cookie('mainVolumeLevel') && null !== $.cookie('mainVolumeLevel')) {
	    	$.mainVolumeLevel = $.cookie('mainVolumeLevel');
	    } 


		$.fn.initVolume = function(){
		    $('#qtVolumeControl').each(function(i,c) {
			    var qwVolNum = $("#qwVolNum"),
			     	slider  = $(this),
			     	doc = $(document),
			    	btn = $('#theVolCursor'),
			    	sliderWidth = $("#qtVolumeControl").width()-btn.outerWidth();
			    var	startOff, holderOffs, sliderWidth, handleWidth, posX, percentage;
			    btn.on('mousedown', function(e) {
			       	e.preventDefault(); 
			        holderOffs = slider.offset().left;
			        startOff = btn.offset().left - holderOffs;
			        doc.on('mousemove', moveHandler);
			        doc.on('mouseup', stopHandler);   
			    });
			    function moveHandler(e) {
			        posX = e.pageX - holderOffs;
			        posX = Math.min(Math.max(0, posX), sliderWidth);
			        btn.css({
			            left: posX
			        });
			        percentage = Math.round(posX/sliderWidth * 100);
			    }
			    function stopHandler() {
			        doc.off('mousemove', moveHandler);
			        doc.off('mouseup', stopHandler);
			        if(undefined !== soundManager) {
			        	qwVolNum.html(percentage);
				        soundManager.setVolume(percentage); //affects also featured player
				        $.cookie('mainVolumeLevel', percentage, { expires: 1, path: '/' });
				        $.mainVolumeLevel = percentage;
				    }
			    }  

			    if(undefined !==  $.cookie('mainVolumeLevel') && null !== $.cookie('mainVolumeLevel')) {
			    	var volCookie = $.cookie('mainVolumeLevel');
			    	var VolOffset = sliderWidth / 100 * volCookie;
			    	btn.offset({ top: 0, left: VolOffset });
			    	 qwVolNum.html( Math.round(volCookie));
			    }


			});
		}

	    /* Initialize the audio player ======================= */
		$.fn.initializeAudioStream = function(autoplay, playerMp3){
			if(playerMp3 !== undefined) {
				var mainPlayer = $("#qwMusicPlayerContainer"),
					identifier = "a[data-mp3url]";
		        $.mySound = soundManager.createSound({
		            id: 'currentSound',
		            url: playerMp3
		        });
			    if(autoplay === '1'){
				    $("#channelsList a:first-child").click();
				    soundManager.setVolume($.mainVolumeLevel);
				}
			}
		};


		$.fn.qtPlayerStateChange = function(state){
			if(state === 1){
				
				$("#qtRadioBtn").addClass("state-play accentcolor");
			} else {
				$.cookie('playerstatus', 'stop', { expires: 1, path: '/' } );
				$("#qtRadioBtn").removeClass("state-play accentcolor");
			}
		} 

		var snd, trackextension,
			playClass = 'mdi-av-play-arrow',
			pauseClass= "mdi-av-pause",
			loadingClass = "mdi-device-access-time";

		$("body").on("click","a[data-mp3url]", function(e) {
    		e.preventDefault();
    		var playerbutton = $(this),
    			mp3url = playerbutton.attr("data-mp3url");


    		if(playerbutton.attr('data-sonikradio') === '1' &&  playerbutton.attr("data-state") !== '1' ){
				$.cookie('playerstatus', 'play', { expires: 1, path: '/' });
				$.cookie('playerurl', mp3Url, { expires: 1, path: '/' });
    		}


    		if(undefined ===  $.mySound) {
    			$("a[data-mp3url]").attr("data-state","0").find("i").removeClass("mdi-av-pause").addClass('mdi-av-play-arrow'); 
    			$.mySound = soundManager.createSound({
		            id: 'currentSound',
		            url: mp3url,
		            autoPlay: true,
		            onplay: function(){
		            	$("a[data-mp3url]").attr("data-state","0").find("i").removeClass(pauseClass).addClass(playClass); //  for the whole page
						playerbutton.attr("data-state", "1").find("i").removeClass(playClass).addClass(pauseClass);
						$.fn.qtPlayerStateChange(1);
	                }
		        });
    		} else {
	    		if(mp3url !== $.mySound.url) {
	    			if(undefined === mp3url){
	    				return;
	    			}
	    			trackextension = mp3url.split('.').pop();
					$("a[data-mp3url]").attr("data-state","0").find("i").removeClass(pauseClass).addClass(playClass); //  for the whole page
					playerbutton.find("i").removeClass(playClass).addClass(loadingClass);

					if(null !== soundManager) {
						if("object" === typeof(soundManager)) {
							var snd = soundManager.getSoundById('currentSound');
							if(undefined !== snd.url) {
			    				 soundManager.destroySound('currentSound');
			    			}
		    			}
		    		}

	    			$.fn.destroyAll360Sounds();
	    			$.mySound = soundManager.createSound({
		                id: 'currentSound',
		                url: mp3url,
		                autoPlay: true,
		                onplay: function(){
		                	playerbutton.find("i").removeClass(playClass).removeClass(loadingClass).addClass(pauseClass);
		                	playerbutton.attr("data-state", "1");
		                	$.fn.qtPlayerStateChange(1);
		                }
		                ,onstop: function(){
		                	$.fn.qtPlayerStateChange(0);
		                }
		                ,onpause: function(){
		                	$.fn.qtPlayerStateChange(0);
		                }
		            });
		            // $.mySound.play();
				} else {
					if(playerbutton.attr("data-state") == 1) {
	    				$.mySound.pause('currentSound'); 
	    				playerbutton.attr("data-state", "0");
		    			playerbutton.find("i").removeClass(pauseClass).addClass(playClass); 
		    		} else {
		    			playerbutton.find("i").removeClass(playClass).addClass(loadingClass);
		    			if(null !== soundManager) {
							if("object" === typeof(soundManager)) {
								var snd = soundManager.getSoundById('currentSound');
								if(undefined !== snd) {
									if(undefined !== snd.url) {
					    				 soundManager.destroySound('currentSound');
					    			}
					    		}
			    			}
			    		}
		    			$.fn.destroyAll360Sounds();
		    			$.mySound = soundManager.createSound({
			                id: 'currentSound',
			                url: mp3url,
			                autoPlay: true,
			                onplay: function(){
			                	playerbutton.find("i").removeClass(playClass).removeClass(loadingClass).addClass(pauseClass);
			                	playerbutton.attr("data-state", "1");
			                	$.fn.qtPlayerStateChange(1);
			                }
			                 ,onstop: function(){
			                	$.fn.qtPlayerStateChange(0);
			                }
			                ,onpause: function(){
			                	$.fn.qtPlayerStateChange(0);
			                }
			            });
		    		}
				}
			}
	    });

	    $.fn.initVolume();
	    if($("#qwMusicPlayerContainer").length > 0){
	    	var pcont =  $("#qwMusicPlayerContainer"),
	    		flashPath = pcont.attr("data-soundmanagerswf"),
	    		autoplay = pcont.attr("data-autoplay"),
	    		mp3Url = $("#channelsList a:first-child").attr("data-mp3url");
		    
	    	// Resume radio stream play status
	    	
	    	// console.log( 'playerstatus: ' + $.cookie('playerstatus') );
	    	// console.log( 'playerurl: ' + $.cookie('playerurl') );

	    	if( $.cookie('playerstatus') === 'play' && $.cookie('playerurl') !== null  ){
				mp3Url = $.cookie('playerurl');
				autoplay = '1';
			}


			
			// Initialize the player and eventually resume the play status if the cookie says so
		    if("object" === typeof(soundManager)){
		    	soundManager.setup({
					url: flashPath,
					flashVersion: 9,
					bufferTime:5,
					onready: function() {
						$.fn.initializeAudioStream(autoplay, mp3Url);
					}
			    });
		    }

		   
		}
		
	}


	/**====================================================================
	*
	*  31. Sound destroy
	* 
	====================================================================*/
	$.fn.destroyAll360Sounds = function(){
		if(threeSixtyPlayer !== undefined) {
			threeSixtyPlayer.sounds.forEach(function(element, index, array){
				soundManager.stop(element.id);
		  		soundManager.destroySound(element.id);
			});			
		}

	}
	

	/**====================================================================
	 *
	 *
	 *	32. Preloader
	 *
	 *
	 *
	 ====================================================================*/
	$.fn.preloaderVisibility = function(state){
		if(state === 1){
			$("#qwPreloaderBox").addClass("active");
		}
		else {$("#qwPreloaderBox").removeClass("active");}
	}
	$.fn.addGeneralPreloader = function(){
		$("body").append('<div id="qwPreloaderBox" class="qt-preloader"><span><i  class="fa fa-circle-o-notch fa-spin fa-3x fa-fw margin-bottom"></span></div>');	 
	}
	$("body").on("click","#qwPreloaderBox", function(){
		$.fn.closeModal();
	});
	

	/**====================================================================
	 *
	 *
	 *	33. On screen resize reload page to reset functions
	 * 	Can be replaced by selective function triggering later on but till now that's it, we reload the page
	 *
	 *
	 *
	 ====================================================================*/

	$.fn.qtResizeTimer = function(){
		var resizeTimer;
		var windowWidth = $(window).width();
		$(window).on('resize', function(e) {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function() {
				if ($(window).width() != windowWidth) {
					windowWidth = $(window).width();
					location.reload(); // Because there are many server side elements that needs to be checked
		        }
				
			}, 350);
		});
	}


	/*=================================================================**
	 * 
	 *
	 *
	 *	34. qwLoadedTheme: Functions to execute once the contents are fully loaded 
	 *
	 * 
	 *
	=================================================================*/

	$.fn.qwLoadedTheme = function(){

		$.fn.qtMasonry();
		$.fn.dynamicMapsNew();
		$.fn.NewYoutubeResize();
		$.fn.qtSquaredItems ();
		// $('.button-collapse').sideNav();






		$('.prettySocial').prettySocial(); // Custom social sharing function
		if($("#qtMainContainer").hasClass("qt-preloaderanimation")) {
			$("#qtMainContainer.qt-preloaderanimation ").velocity({
			    opacity: 1
			}, {
			    complete: function() { $.fn.preloaderVisibility(0); }
			});
		}
	}


	 /**====================================================================
     *
     * 
     *  Popup opener (requires library component) 
     *  
     * 
     ====================================================================*/
    $.fn.ttgReaktionPopupwindow = function() {
        if(typeof($.fn.popupwindow) !== "undefined"){
           $.fn.popupwindow();
        }
    };


	/*=================================================================**
	 * 
	 *
	 *	35. qwInitTheme: We putt all page initialization functions here, 
	 *	to reinitialize eventually later
	 *
	 *
	=================================================================*/

	$.fn.qwInitTheme = function(){


		$('#qtBody').append('<div id="sidenav-overlay"></div>');
		$('.button-collapse2, #sidenav-overlay').on('click touchstart', function(e){
			e.preventDefault();
			$('#qtBody').toggleClass('qt-sidenav-open');
		});



		$.fn.qtMobileNav();
		$.fn.qtEqTit();
		$.fn.qtInitTripleView();
		$.fn.qtQTabs();
		$.fn.qtLoadMore();// QantumThemes load More function
		$.fn.parallaxBackground(); // Parallax images // used in qt-author-infobox. Creates fisical img tag
		$.fn.qtGradientOverlay();// Gradient Overlay
		$.fn.qtSmoothScroll();// Smooth scrolling
		$.fn.transformlinks();
		$.fn.qwScrollfireElements();// Scrollfile Elements
		$.fn.dynamicBackgrounds();// Dynamic backgrounds
		$.fn.qtGridSwitcher();// Schedule switcher
		$.fn.atTabsAnimator();// Add animation to the tabs
		 $.fn.ttgReaktionPopupwindow();
		$('.tabs').tabs('select_tab', 'tab_id');// Tabs init
		$.fn.gridstackSlideshows();
		$.fn.gridstackCarousel();
		$.fn.gridstackOwl();
		$.fn.gridstackSkywheel();
		$.fn.parallaxPolydecor();  
		$.fn.qtFlipClockJs();
		$.fn.qtMusicPlayer();
		$.fn.qt360player();
		$.fn.qtQtSwitch();
		$.fn.qtCollapsible();
		if($("#qtMainContainer").hasClass("qt-preloaderanimation")) {
			$.fn.addGeneralPreloader();
			$.fn.preloaderVisibility(1);
		}
		
		if($(window).width() > 1280) {
			$(".dropDownMenu").css({"padding-right":$("#headerbuttons").width()+"px"});
		}

		jQuery(window).load(function() {
			$.fn.qwLoadedTheme();
			if( !$("body").hasClass('mobile')) {
				$.skrollrInstance = skrollr.init({forceHeight: false});
			}
		});
	}


	/**====================================================================
	 *
	 *
	 *	36. Page Ready Trigger
	 * 	This needs to call only $.fn.qtInitTheme
	 * 
	 ====================================================================*/

	jQuery(document).ready(function() {
		/* If not in debug mode, the console messages are suppressed ============*/
		
		// if(false ===  $("body").hasClass("qt-debug")) {
		// 	var console = {};
		// 	console.log = function(){};
		// 	window.console = console;
		// } else {
		// 	if(typeof console === "undefined") { var console = { log: function (logMsg) { } }; }
		// }
		$.fn.qwInitTheme();
	});
	jQuery(window).load(function() {
		setTimeout(function(){ 
			jQuery(window).resize();
		}, 2000);
	});
})(jQuery)



