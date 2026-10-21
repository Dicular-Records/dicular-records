(function ($) {

	$.fn.qt360player = function(targetContainer, action){
			
			if($("body").hasClass("mobile")){
			//	return;
			}



			if(undefined === targetContainer) {
				targetContainer = "body";
			};

			var url, actualplaying, player, target, smState = false, playtrack, firstloaded = false, 
				qtTracktitle = $(targetContainer).find("#qtTracktitle"),
				playClass = 'mdi-av-play-arrow',
		    	pauseClass= "mdi-av-pause",
		    	loadingClass = "mdi-device-access-time", 
		    	trackextension = '';

			// * Destroys the player
			// ================================================ 
			if(action === "destroy") {
				$.fn.destroyAll360Sounds();
			}

			soundManager.setup({
		        url: $("body").attr("data-soundmanagerurl"),
		        allowScriptAccess: 'always',
		        useHighPerformance: true,
		        consoleOnly: true,
		        debugMode: false,
		       	debugFlash: false
			});
			
			soundManager.flash9Options.useWaveformData = true; 
	      	soundManager.flash9Options.useEQData = true;
	      	soundManager.flash9Options.usePeakData = true;
	      	soundManager.preferFlash = true;
	       	soundManager.flashVersion = 9;
	       	threeSixtyPlayer.config = {
				playNext: false,
				autoPlay: false,
				allowMultiple: false,

				loadRingColor: $("#qtBody").attr("data-accentcolordark"), // ACCENT COLOR
				playRingColor: $("#qtBody").attr("data-textcolor"), // DARKER
				backgroundRingColor: $("#qtBody").attr("data-accentcolor"),
				circleDiameter: 360,
				circleRadius: 180,
				animDuration: 500,
				animTransition: Animator.tx.bouncy,
				showHMSTime: true,
				useWaveformData: false,
				waveformDataColor: '#fff',
				waveformDataDownsample: 3,
				waveformDataOutside: false,
				waveformDataConstrain: false,
				waveformDataLineRatio: 0.8,
				useEQData: true,
				eqDataColor: '#FFF',
				eqDataDownsample: 2,
				eqDataOutside: true,
				eqDataLineRatio: 0.73,
				usePeakData: true,
				peakDataColor: '#FFF',
				peakDataOutside: true,
				peakDataLineRatio: 1.8,
				scaleArcWidth: 0.80,
				useAmplifier: true,
				useFavIcon: true

			}



		   	if(typeof $.mainVolumeLevel === "number"){
		   		console.log("Setting volume to "+$.mainVolumeLevel);
		   		soundManager.setVolume($.mainVolumeLevel); //affects also featured player
		    }

			
			
			// threeSixtyPlayer setup
			// ================================================ 
			// This player doesn't fire the events like the standard one, so  we create our owns encapsulating the native one.
			
			var onplay360 = threeSixtyPlayer.events.play;
			var onresume360 = threeSixtyPlayer.events.resume;
			var onfinish360 = threeSixtyPlayer.events.finish;
			var onpause360 = threeSixtyPlayer.events.pause;
			var onstop360 = threeSixtyPlayer.events.stop;

			var myOnplay = function(){
			 	 console.log("state: "+smState);
			   	smState = 'play';





				soundManager.stop("currentSound");// VERY IMPORTANT! STOPS THE OTHER SOUNDS FROM PLAYLISTS
				soundManager.destroySound('currentSound');// VERY IMPORTANT! STOPS THE OTHER SOUNDS FROM PLAYLISTS
				$(targetContainer).find(".sm2-360ui").addClass("sm2_playing");
				$(targetContainer).find("a.beingplayed i").removeClass(playClass).addClass(pauseClass);	
			  	onplay360.apply(this); // forces the scope to 'this' = the sound object

			  	console.log("Volume state form Cookie: "+ $.mainVolumeLevel);
			  	soundManager.setVolume($.mainVolumeLevel); //affects also featured player
			   	if(typeof $.mainVolumeLevel === "number"){
			   		console.log("Setting volume to "+$.mainVolumeLevel);
			   		soundManager.setVolume($.mainVolumeLevel); //affects also featured player
			    }

			  	$.fn.qtPlayerStateChange(1);
			};
			threeSixtyPlayer.events.play = myOnplay;


			var myOnresume = function(){
			 	console.log("state: "+smState);
			  	onplay360.apply(this); 
			  	$.fn.qtPlayerStateChange(1);
			};
			threeSixtyPlayer.events.resume = myOnresume;


			var myOnfinish = function(){
			  	console.log("state: "+smState);
			  	var next = $("a.beingplayed").closest("li").next();
				if(next.length > 0) {
					next.find("a[data-playtrack]").click();
				} else {
					$(targetContainer).find("a.beingplayed").removeClass("beingplayed").find("i").removeClass(pauseClass).addClass(playClass);
					smState = 'finish';
				}
			  	onfinish360.apply(this); // forces the scope to 'this' = the sound object
			  	$.fn.qtPlayerStateChange(0);
			};
			threeSixtyPlayer.events.finish = myOnfinish;


			var myOnpause = function(){
			  	console.log("state: "+smState);
			  	smState = 'pause';
				$(targetContainer).find("a.beingplayed i").removeClass(pauseClass).addClass(playClass);
			  	onpause360.apply(this); // forces the scope to 'this' = the sound object
			  	$.fn.qtPlayerStateChange(0);
			};
			threeSixtyPlayer.events.pause = myOnpause;


			var myOnstop = function(){
			  	console.log("state: "+smState);
			  	smState = 'stop';
				$(targetContainer).find("a.beingplayed").removeClass("beingplayed").find("i").removeClass(pauseClass).addClass(playClass);
			  	onstop360.apply(this); // forces the scope to 'this' = the sound object
			  	$.fn.qtPlayerStateChange(0);
			};
			threeSixtyPlayer.events.stop = myOnstop;


			String.prototype.stripSlashes = function(){
			    return this.replace(/\\(.)/mg, "$1");
			}
			
			function loadInPlayer (c, autoplay){
				console.log("\n ======== loadInPlayer init ==========");
				

				$.fn.destroyAll360Sounds();

				playtrack = c.attr( "data-playtrack");


				if(playtrack === undefined) {
					return;
				}
				mp3url =  c.attr( "data-playtrack").split("geo-sample").join("sample");


				trackextension = mp3url.split('.').pop();
				console.log("Track Extension: "+trackextension);
				if(trackextension != 'mp3') {
					// mp3url = mp3url+'#.mp3';
				}
				console.log("Loading mp3 file: "+mp3url);


				target = c.attr("data-target");
				player = $('#'+target);
				soundManager.stopAll();
				var player = $('.ui360');
				player.empty();
				var random = Math.floor(Math.random()*1000000);
				player.append('<a id="playerlink" href="' + mp3url + '?ver=' + random + '"></a>');
				if(autoplay){
					console.log("Autoplay executing");
					threeSixtyPlayer.config.autoPlay = true;
					$(targetContainer).find("a.beingplayed").removeClass("beingplayed").find("i").removeClass(pauseClass).addClass(playClass);
					actualplaying = mp3url;
					c.addClass("beingplayed").find("i").removeClass(playClass).addClass(pauseClass);
				}
				qtTracktitle.html('<i class="fa fa-music"></i> '+c.attr("data-title"));
				threeSixtyPlayer.init();
				return;
			};

			
			
			/**/

			if(false === firstloaded) {
				var firstTrack = $(targetContainer).find("a[data-playtrack]").first();

				console.log("First track: "+firstTrack);
				if(firstTrack.length > 0) {
					console.log("First track loaded");
					loadInPlayer( firstTrack, false);
					firstTrack.addClass("beingplayed");
				}	
				firstloaded = true;
			}



			// MP3 link click
			//================================================
			$(targetContainer).off("click", "a[data-playtrack]");

			$(targetContainer).on("click", "a[data-playtrack]", function(e) {
				//console.log("Click mp3 link");
				e.preventDefault();
				var c = $(this);
				if(c.hasClass("beingplayed")){
					//console.log("Toggle play new");
					$(targetContainer).find(".sm2-360btn").click();

					/*if(smState === "play" || smState === "pause"){
						soundManager.togglePause("ui360Sound0");
					} else {
						loadInPlayer($(this), true);
					}*/

				} else {
					loadInPlayer($(this), true);
				}

				return false;
			});



			// Play next
			// ================================================ 
			var prevtrack, nexttrack;
			$(targetContainer).off("click", "a.playnext");
			$(targetContainer).on("click","a.playnext", function(e) {
				console.log("playnext");
				e.preventDefault();
				$(targetContainer).find("a.beingplayed").closest("li").next().find("a[data-playtrack]").click();
				return false;
			});
			// * Play previous
			// ================================================ 
			$(targetContainer).off("click", "a.playprev");
			$(targetContainer).on("click","a.playprev", function(e) {
				console.log("playprev");
				e.preventDefault();
				$(targetContainer).find("a.beingplayed").closest("li").prev().find("a[data-playtrack]").click();
				return false;
			});
	} // 360 player end

})(jQuery);