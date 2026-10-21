/* = quicksand filter
		======================================================*/

jQuery.noConflict();



jQuery.fn.removeMyStyle = function(style){
	//return;
	if(typeof(style) !== "undefined" && style !== undefined){
	    var search = new RegExp(style + '[^;]+;?', 'g');
	    return this.each(function()    {
	        jQuery(this).attr('style', function(i, styles){
	        	if(styles !== undefined){
	            return styles.replace(search, '');	        		
	        	}

	        });
	    });

	}

};



// auto background activation =======================================//
		
jQuery.VDLautoBgStyles = function(){
	jQuery("[data-bgimg]").each(function(i,c){
		var img = jQuery(this).attr("data-bgimg");
		if(img !== ""){
			jQuery(this).css({"background": "url("+img+")","background-size":"cover" });
		}
	});	
}
jQuery.VDLautoBgStyles();

// Quicksand activation =======================================//

jQuery.activateFilterBlocks = function(){
  	var jQueryfilterType = jQuery('.filterOptions li.active a').attr('class');
  	var jQueryholder = jQuery('.filterable-grid');
  	var jQuerydata = jQueryholder.clone();
	jQuery('.filterOptions a').click(function(e) {
		e.preventDefault();
		jQuery('.filterOptions li').removeClass('active');
		var jQueryfilterType = jQuery(this).attr('class');
		jQuery(this).parent().addClass('active');
		if (jQueryfilterType == 'all') {
			var filteredData = jQuerydata.find('.fgchild');
		} 
		else {
			var filteredData = jQuerydata.find('.fgchild[data-type~=' + jQueryfilterType + ']');
		}
		// call quicksand and assign transition parameters
		jQueryholder.quicksand(filteredData, {
			duration: 500,
			adjustHeight: 'dynamic' ,
			easing: 'easeInOutQuad'
		});
		return false;
	});
	jQuery("#vdlsubpagesAll").click();
}


jQuery(document).ready(function() {
		

	jQuery.vdl_todoAfterResize = function(){
		if(jQuery.beingExecuted == 0){
			jQuery.beingExecuted = 1;
			jQuery(".filterable-grid").css({opacity:0});
			jQuery(".filterable-grid").each(function(i,c){
				var that = jQuery(this);		
				var width = that.find(".vdl-subpages-item:first-child").outerWidth(),
					height = width/16*9;
				that.find('.vdl-element').each(function(l,o){
					jQuery(this).css({height:height+"px",width:width+"px"});
				});
				
				that.animate({opacity:1},400);
			});
			jQuery.activateFilterBlocks();
			jQuery(".filterable-grid").animate({opacity:1},500);
		}
		jQuery.beingExecuted = 0;
	}
	jQuery.beingExecuted = 0;

	
	jQuery.vdl_FixBlocks = function (v) {
		jQuery.vdl_todoAfterResize(v);
	}





	var resizeTimerV;
	var windowWidth = jQuery(window).width();
	jQuery(window).on('resize', function(e) {
		clearTimeout(resizeTimerV);
		resizeTimerV = setTimeout(function() {
			
			if (jQuery(window).width() != windowWidth) {
				windowWidth = jQuery(window).width();
				jQuery('.vdl-element, .filterable-grid').removeMyStyle("width");
				if(timeoutHandle){
					window.clearTimeout(timeoutHandle);
				}
			 	timeoutHandle = window.setTimeout(function (){
		 			jQuery.vdl_FixBlocks(1);
		        }, 800); // using timeout because it wants to execute this too early!!
	        }
			
		}, 350);
	});


/*
	jQuery(window).resize(function() {
		jQuery(".filterable-grid").css({opacity:.05});
		jQuery('.vdl-element, .filterable-grid').removeMyStyle("width");
		if(timeoutHandle){
			window.clearTimeout(timeoutHandle);
		}
	 	timeoutHandle = window.setTimeout(function (){
 			jQuery.vdl_FixBlocks(1);
        }, 800); // using timeout because it wants to execute this too early!!
	});
*/

	timeoutHandle = window.setTimeout(function (){
				jQuery.vdl_FixBlocks(1);
    }, 800);








	jQuery(window).load(function(){
		jQuery.VDLautoBgStyles();
	});

});

//jQuery( '.videoloveSwipebox' ).swipebox();