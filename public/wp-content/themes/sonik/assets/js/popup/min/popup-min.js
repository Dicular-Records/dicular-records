/**
 *	EXTERNAL LIBRARY FOR POPUP PLAYER
 * http://rip747.github.io/popupwindow/
 * Popup windows
 * Used in the popup player
 * 
 */
!function(u){u.fn.popupwindow=function(t){u("body").on("click",".qt-popupwindow",function(t){var e,a,n,o,r,l;
// for overrideing the default settings
t.preventDefault();var i=u(this),h=i.attr("href"),s=i.attr("data-name"),c=i.attr("data-width"),d=i.attr("data-height");return e={height:600,// sets the height in pixels of the window.
width:600,// sets the width in pixels of the window.
toolbar:0,// determines whether a toolbar (includes the forward and back buttons) is displayed {1 (YES) or 0 (NO)}.
scrollbars:0,// determines whether scrollbars appear on the window {1 (YES) or 0 (NO)}.
status:0,// whether a status line appears at the bottom of the window {1 (YES) or 0 (NO)}.
resizable:1,// whether the window can be resized {1 (YES) or 0 (NO)}. Can also be overloaded using resizable.
left:0,// left position when the window appears.
top:0,// top position when the window appears.
center:0,// should we center the window? {1 (YES) or 0 (NO)}. overrides top and left
createnew:1,// should we create a new window for each occurance {1 (YES) or 0 (NO)}.
location:0,// determines whether the address bar is displayed {1 (YES) or 0 (NO)}.
menubar:0,// determines whether the menu bar is displayed {1 (YES) or 0 (NO)}.
onUnload:null},c&&(e.width=c),d&&(e.height=d),
// center the window
1==e.center&&(e.top=(screen.height-(e.height+110))/2,e.left=(screen.width-e.width)/2),a="location="+e.location+",menubar="+e.menubar+",height="+e.height+",width="+e.width+",toolbar="+e.toolbar+",scrollbars="+e.scrollbars+",status="+e.status+",resizable="+e.resizable+",left="+e.left+",screenX="+e.left+",top="+e.top+",screenY="+e.top,
/*
		Main popup opening function
		 */
l=window.open(h,s,a),e.onUnload&&(
// Incremental check for window status
// Attaching directly to window.onunlaod event causes invoke when document within window is reloaded
// (i.e. an inner refresh)
unloadInterval=setInterval(function(){l&&!l.closed||(clearInterval(unloadInterval),e.onUnload.call(u(this)))},500)),!1})}}(jQuery);
//# sourceMappingURL=popup-min.js.map