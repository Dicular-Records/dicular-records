

/* Auto embedding
=================================================================*/


function embedMixcloudPlayer(content) {
		var finalurl = ((encodeURIComponent(content)));
		finalurl = finalurl.replace("https","http");
		var embedcode ='<iframe data-state="0" class="mixcloudplayer" width="100%" height="80" src="//www.mixcloud.com/widget/iframe/?feed='+finalurl+'&embed_uuid=addfd1ba-1531-4f6e-9977-6ca2bd308dcc&stylecolor=&embed_type=widget_standard" frameborder="0"></iframe><div class="canc"></div>';    
		return embedcode;
}

function embedVideo(content, width, height) {
	height = width / 16 * 9;
	var youtubeUrl = content;
	var youtubeId = youtubeUrl.match(/=[\w-]{11}/);
	var strId = youtubeId[0].replace(/=/, '');
	var result = '<iframe width="'+width+'" height="'+height+'" src="'+window.location.protocol+'//www.youtube.com/embed/' + strId + '?html5=1" frameborder="0" class="youtube-player" allowfullscreen></iframe>';
	return result;
}

function embedYahooVideo(content) {
	var yahooUrl = content;
	var id = yahooUrl.match(/\d{8}/);
	var vidId = yahooUrl.match(/\d{7}/);
	var result = '<div class="embedded_video">\n';
	result += '<object width="100%">\n';
	result += '<param name="movie" value="http://d.yimg.com/static.video.yahoo.com/yep/YV_YEP.swf?ver=2.2.46" />\n';
	result += '<param name="allowFullScreen" value="true" />\n';
	result += '<param name="AllowScriptAccess" VALUE="always" />\n';
	result += '<param name="bgcolor" value="#000000" />\n';
	result += '<param name="flashVars" value="id=' + id + '&vid=' + vidId + '&lang=en-us&intl=us&embed=1&ap=9460582" />\n';
	result += '<embed src="http://d.yimg.com/static.video.yahoo.com/yep/YV_YEP.swf?ver=2.2.46" type="application/x-shockwave-flash"  allowFullScreen="true" AllowScriptAccess="always" bgcolor="#000000" flashVars="id=' + id + '&vid=' + vidId + '&lang=en-us&intl=us&embed=1&ap=9460582" >\n';
	result += '</embed>\n';
	result += '</object>\n';
	result += '</div>\n';
	return result;
}

