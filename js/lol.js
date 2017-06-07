		'use strict';
		var CnfState = {"audio": false};
		var tweenMxHeroBG = new TimelineMax();
		var AudioContext = window.AudioContext || false; // canIuse

		if (AudioContext) {
			CnfState.audio = true;    //    Icanuse
			var oAudContx = new AudioContext();    //    HTML5 Audio
			var oAJAXReq = new XMLHttpRequest();   //    Get Sounds
			var aAudioBuffer = new Array(5);       //    Store Sound files
			var fetchSoundConfig = {sound_max: 5, sound_current: 1};    //    Sound limits
			fetchSound();
		}

		function fetchSound() {
		    //    AJAX a single sound binary
		    oAJAXReq.open("GET", "au/s" + fetchSoundConfig.sound_current + ".mp3", true);
		    oAJAXReq.responseType = "arraybuffer";
		    oAJAXReq.send();
		    oAJAXReq.onload = fetchSoundonload;
		}

		function fetchSoundonload() {
		    //    The audio file has loaded via AJAX
		    oAudContx.decodeAudioData(oAJAXReq.response, function (decAudBuf) {
		        aAudioBuffer[ fetchSoundConfig.sound_current ] = decAudBuf;
		        fetchSoundConfig.sound_current = fetchSoundConfig.sound_current + 1;
		        if(fetchSoundConfig.sound_current <= fetchSoundConfig.sound_max){
		            oAJAXReq = new XMLHttpRequest();
		            oAJAXReq.responseType = "arraybuffer";
		            fetchSound( fetchSoundConfig.sound_current );
		        }
		    });
		};

		function playAudioFile( nSound ) {
		    //    Play MP3 if sound toggle is true
		    if( portfolio ){
				if( CnfState.audio === true ){
					try{
						var oSrc = oAudContx.createBufferSource();
						var volume = oAudContx.createGain();
						oSrc.buffer = aAudioBuffer[nSound];
						volume.gain.value = 0.0;
						oSrc.connect(volume);
						volume.connect(oAudContx.destination);
						oSrc.connect(oAudContx.destination);
						volume.gain.value = 0.0;
						oSrc.start(oAudContx.currentTime);
					}
					catch( e ){}
				}
			}

		};
		function playAudioRand( aSound ){
			//    Either Or
			playAudioFile( aSound[Math.random()+.5|0]);
		}
		function prinav_tap( el ){
			$(".prinav--p__active").removeClass("prinav--p__active");
			$( el ).find("p").addClass("prinav--p__active");
			$(".content-section").addClass("blind");
			$( "#js-" + $( el ).attr("data-prinv") ).removeClass("blind");
			$("#sticky_top").foundation("_calc", true);  //  Issue with top bar not sticky past orig scroll point
		}
		var portfolio = false;
		$(document).ready(function(){
			$(document).foundation();
				//  Call back from SFDC Web-2-Lead
				if( document.location.toString().indexOf( "thanks" ) !== -1 ){
					$("#thanks_dialog").foundation("open");
					playAudioFile(4);
				}
				//  Determine visibility blog, prtf or both
				$(".js-prtf--a").on("click", function( e ){
					window.location.href = $( this ).attr("href");
					e.preventDefault();
				});
				function isPrtf(){
					if( document.location.toString().indexOf( "portfolio" ) !== -1 ){
						$("body").addClass("show_prtf");
						portfolio = true;
						//$("#js-theme--input").click();
					}else{
						$("body").addClass("show_blog");
						portfolio = false;
					}
				}
				isPrtf();

				getContent();
				$(".prinav--nav__hamb").click(function(){ playAudioRand( [3,4] );false }); // off-canvas hamb safari mobile hack

			//    theme switch (whole page theme not the card theme)
			$("#js-prinav-switch").on("change", function( e ){
				if( $( this ).attr("data-theme") === "theme__day" ){
					playAudioRand( [3, 4] );
					$( this ).attr("data-theme", "theme__night");
				} else {
					playAudioRand( [4, 5] );
					$( this ).attr("data-theme", "theme__day");
				}
				$("body").removeClass("theme__day").removeClass("theme__night").addClass($( this ).attr("data-theme"));
			});
			//if( (Math.floor(Math.random() * 3) + 1) >= 2 ) $("#js-theme--input").click(); // 2 in 3
			//if( (Math.random()+.5|0) === 1 ) $("#js-theme--input").click(); // 0 or 1
			//    Hero Ani
			if( $("#svgLOL").length > 0 ){
				new Vivus("svgLOL", {duration: 96}, function(){
					$("#svgLgo").removeClass("blind");
					new Vivus("svgLgo", {duration: 176}, function(){ moveHeroBg(); });
				});
			} else {
				if( $("#svgLgo").length > 0 ){
					$("#svgLgo").removeClass("blind");
					new Vivus("svgLgo", {duration: 176}, function(){ moveHeroBg(); });
				}else{
					moveHeroBg();
				}
			}
			function moveHeroBg(){
				var width = 2400, speed = 48, duration = width / speed,
				endPosition = width - (speed / 48);
				tweenMxHeroBG.to($(".hero--header"), duration, {css:{backgroundPosition:endPosition + "px 0"}, repeat:-1, ease:Linear.easeNone});
			}
			//    Prime Nav
			$(".prinav--a").on("click", function( e ){
				prinav_tap( this );
				if( (Math.floor(Math.random() * 10) + 1) >= 9 ) playAudioRand( [1,4] );
				var tokenHref = $(this).attr("href");
				history.pushState("", "New URL: " + tokenHref, tokenHref);
				e.preventDefault();
			});

			//  Por Tempo, clone side content onto other "page" states
			//  TODO make sticky
			$("#js-cntnt--asd__abt").html( $("#js-cntnt--asd__hom").html() );
			$("#js-cntnt--asd__wrd").html( $("#js-cntnt--asd__hom").html() );
			$("#js-cntnt--asd__pod").html( $("#js-cntnt--asd__hom").html() );
			$("#js-cntnt--asd__vid").html( $("#js-cntnt--asd__hom").html() );
		});  //  Document Ready

		$( window ).load(function(){  //  Deep Link
			if( document.location.href.toString().indexOf( "#home-page" ) !== -1 ){
				prinav_tap( $("[data-prinv='prinv_hom']") );
			}
			if( document.location.href.toString().indexOf( "#podcasts" ) !== -1 ){
				prinav_tap( $("[data-prinv='prinv_pod']") );
			}
			if( document.location.href.toString().indexOf( "#videos" ) !== -1 ){
				prinav_tap( $("[data-prinv='prinv_vid']") );
			}
			if( document.location.href.toString().indexOf( "#articles" ) !== -1 ){
				prinav_tap( $("[data-prinv='prinv_wrd']") );
			}
			if( document.location.href.toString().indexOf( "#about-us" ) !== -1 ){
				prinav_tap( $("[data-prinv='prinv_abt']") );
			}
			if( document.location.href.toString().indexOf( "#contact-us" ) !== -1 ){
				prinav_tap( $("[data-prinv='prinv_cnt']").attr("href") );
			}
		});  //  Window Load

//    We've loaded the content, let us bind
	function postContent(){ // Simple inline validation
	$( ".js-submit-contact_form" ).on("click", function( e ){
		if( $( "#last_name" ).val() === ""){
			$("#last_name").addClass("field__required");
			setTimeout(function(){ $("input").removeClass("field__required") }, 3200);
			e.preventDefault();
			playAudioFile(2);
			return true;
		}
		if( $( "#email" ).val() === ""){
			$("#email").addClass("field__required");
			setTimeout(function(){ $("input").removeClass("field__required") }, 3600);
			e.preventDefault();
			playAudioFile(2);
			return true;
		}
		document.getElementById("contact_form").submit();
	});
	if( portfolio ){//  If prtf turn on day theme
		//$("#js-theme--input").click();
	}
	//    Card Artc Click
	$(".ccard").on("click", function( e ){
		if( !$( this ).hasClass("ccard__expand") ){
			$( this ).find("i").click();
		}
	});
	//  Card Chevron icon font click
	$(".ccard-chev").on("click", function( e ){
		e.stopPropagation()
		$(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
		var $card = $( this ).parent();
		if( $card.hasClass("ccard__expand") ){
			$( this ).removeClass("fa-chevron-up").addClass("fa-chevron-down");
			$card.removeClass("ccard__expand");
		}else{
			$( this ).removeClass("fa-chevron-down").addClass("fa-chevron-up");
			var sHash = makeId( $card.attr("data-title_short") );
			if( (Math.floor(Math.random() * 10) + 1) >= 9 ) playAudioRand( [3, 5] );
			$(".ccard").each(function(){ $( this ).removeClass("ccard__expand"); });
			$card.addClass("ccard__expand");
			sHash = $card.find("h2").text();
			if( sHash.length > 0){
				$("h1.caption--h1__amaticsc:visible").text(sHash);
				document.title = sHash;
			}
			//if( !CnfState.hist ){
				//CnfState.hist = true;
			//}else{
				//history.pushState({"uid_hash":sHash, "prinv": CnfState.prinv }, sHash, "#" + CnfState.prinv + "?" + sHash);
			//}
			$("#sticky_top").foundation("_calc", true);  //  Issue with top bar not sticky past orig scroll point
		}
	});
	//    Card Artc hover
$( ".YYYYccard" ).hover(
	function() {
		tweenMxHeroBG.pause();
	}, function() {
		tweenMxHeroBG.play();
	}
);
	console.log("Dude, what up?  Nick da K in da house!");
	$("#sticky_top").foundation("_calc", true);  //  Issue with top bar not sticky past orig scroll point

	// logo click home svg
	$("#svgLOL").on("click", function(){
		$("[data-prinv='prinv_hom']")[1].click();
	});

}// postContent end
//    Content fetch and render
var artcs = new Artcs();
var getContConfig = {"doc_types":["wrd","vid","pod"], "currentMD": 1, "currentType": 0};

function getContent(){
	$.ajax({
		url: "content/" + (getContConfig.doc_types[getContConfig.currentType]) + "-" + (getContConfig.currentMD++) + ".json",
		statusCode: { 404: function() {
			if( getContConfig.currentType !== (getContConfig.doc_types.length -1) ){
				getContConfig.currentType++;
				getContConfig.currentMD = 1;
				getContent(); // recur
			}else{ //    nada mas
				$("#js-cntnt--art__hom").append( artcs.render("hom") );
				$("#js-cntnt--art__wrd").append( artcs.render("wrd") );
				$("#js-cntnt--art__vid").append( artcs.render("vid") );
				$("#js-cntnt--art__pod").append( artcs.render("pod") );
				//    Replicate content on home page
				if( portfolio ){
					genMainContent( "js-cntnt--art__hom", "js-cntnt--art__wrd", 6);
				}else{
					genMainContent( "js-cntnt--art__hom", "js-cntnt--art__wrd", 4);
				}
				//genMainContent( "js-cntnt--art__hom", "js-cntnt--art__pod", 2);
				genMainContent( "js-cntnt--art__hom", "js-cntnt--art__vid", 2);
				postContent();  // bind
				$(".js-spinner").remove();
			}
		}}
	}).done(function( axjsn ) {
		artcs.addArtc( (getContConfig.doc_types[getContConfig.currentType]), axjsn );
		getContent(); // recur
	});
}
function genMainContent( target_id, source_id, Num2Grab){
	var nCnt = 0;
	$( "#"+source_id+" .ccard" ).each(function(){
		if( nCnt++ < Num2Grab ){
			$("#"+target_id).html( $("#"+target_id).html() + $( this ).prop("outerHTML") );
		}
	});
}
function Artcs(){
	var aArtcs = [];
	this.aArtcs = aArtcs;
	this.addArtc = function( artc_type, jsnArtc ){
		this.aArtcs.push( new Artc( artc_type, jsnArtc.article[0] ) );
	};
	this.render = function( artc_type ){
		var sMU = "";
		var aArtcsFtl = aArtcs.filter( isArtc_type );
		aArtcsFtl.reverse();  //  I want the newest articles first FILO
		function isArtc_type(value, index, ar){ // filter new arr
			if( artc_type === "hom" ){

			}else{
				if( value.artc_type === artc_type ){ //    wrd, vid or pod
					if( portfolio ){
						if( (value.show_state === "state--prtf__show") || (value.show_state === "state--both__show") ){
							return true;
						}
					}else{
						if( (value.show_state === "state--blog__show") || (value.show_state === "state--both__show") ){
							return true;
						}
					}
				}
				return false;
			}
		}

		aArtcsFtl.forEach(function(artc, index) {
			var aCcard =[];
				aCcard.push( {"target": "title_short", "source": artc.title_short} );
				aCcard.push( {"target": "title_short_id", "source": artc.title_short_id} );
				aCcard.push( {"target": "author", "source": artc.author} );
				aCcard.push( {"target": "read_time", "source": artc.read_time} );
				aCcard.push( {"target": "pub_date", "source": artc.pub_date} );
				aCcard.push( {"target": "summary_quote", "source": artc.summary_quote} );
				aCcard.push( {"target": "theme", "source": artc.theme} );
				aCcard.push( {"target": "caption", "source": artc.caption} );
				aCcard.push( {"target": "caption_class", "source": artc.caption_class} );
				aCcard.push( {"target": "body_1", "source": artc.body_1} );
				aCcard.push( {"target": "img_1_src", "source": artc.img_1_src} );
				aCcard.push( {"target": "img_1_alt", "source": artc.img_1_alt} );
				aCcard.push( {"target": "body_2", "source": artc.body_2} );
				aCcard.push( {"target": "img_2_src", "source": artc.img_2_src} );
				aCcard.push( {"target": "img_2_alt", "source": artc.img_2_alt} );
				aCcard.push( {"target": "body_3", "source": artc.body_3} );
				aCcard.push( {"target": "img_3_src", "source": artc.img_3_src} );
				aCcard.push( {"target": "img_3_alt", "source": artc.img_3_alt} );
				aCcard.push( {"target": "body_4", "source": artc.body_4} );
				aCcard.push( {"target": "img_4_src", "source": artc.img_4_src} );
				aCcard.push( {"target": "img_4_alt", "source": artc.img_4_alt} );
				aCcard.push( {"target": "body_5", "source": artc.body_5} );
				aCcard.push( {"target": "img_5_src", "source": artc.img_5_src} );
				aCcard.push( {"target": "img_5_alt", "source": artc.img_5_alt} );
				aCcard.push( {"target": "thumbnail", "source": artc.thumbnail} );
				aCcard.push( {"target": "templ_soundcloud", "source": artc.soundcloud} );
				aCcard.push( {"target": "templ_youtube", "source": artc.youtube} );
				aCcard.push( {"target": "show_state", "source": artc.show_state} );
				aCcard.push( {"target": "templ_seealso_1", "source": artc.see_also_btn_1} );
				aCcard.push( {"target": "templ_seealso_2", "source": artc.see_also_btn_2} );
			sMU += popuTemplate("templ_ccard", aCcard);

		});
		return sMU;
	}
}
function Artc(artc_type, json){
	this.artc_type        = artc_type;    //  wrd, vid, pod
	this.title_short      = json.title_short; // see fn makeId - must be unique within dom
	this.title_short_id   = makeId( this.title_short );
	this.pub_date         = json.pub_date;
	this.read_time        = json.read_time;
	this.author           = json.author;
	this.title_long       = json.title_long;
	this.summary_quote    = json.summary_quote;
	this.theme			  = json.theme;
	this.caption		  = json.caption;
	this.caption_class	  = json.caption_class;
	this.body_1           = swapJSON2MD( json.body_1 );
	this.img_1_alt        = json.img_1.alt;
	this.img_1_src        = json.img_1.src;
	this.body_2           = swapJSON2MD( json.body_2 );
	this.img_2_alt        = json.img_2.alt;
	this.img_2_src        = json.img_2.src;
	this.body_3           = swapJSON2MD( json.body_3 );
	this.img_3_alt        = json.img_3.alt;
	this.img_3_src        = json.img_3.src;
	this.body_4           = swapJSON2MD( json.body_4 );
	this.img_4_alt        = json.img_4.alt;
	this.img_4_src        = json.img_4.src;
	this.body_5           = swapJSON2MD( json.body_5 );
	this.img_5_alt        = json.img_5.alt;
	this.img_5_src        = json.img_5.src;
	this.tags             = json.tags;
	this.thumbnail        = determineTN( artc_type, this.tags );
	this.soundcloud       = makeSoundcloud( json.soundcloud );
	this.youtube		  = makeYoutube( json.youtube );
	this.show_state       = getPortfolioStateClass( json.show_portfolio, json.show_blog );
	this.see_also_btn_1   = makeSeeAlso(json.see_also_btn_1, "1");
	this.see_also_btn_2   = makeSeeAlso(json.see_also_btn_2, "2");
	this.isHom            = false;    //  Is on the home page - not used
}
//    History
window.addEventListener("popstate", function( e ) {
/*
	if (typeof e.state.uid_hash !== "undefined") {
		if( e.state.uid_hash === "prinv_hom" ){
				//$(".ccard").each(function(){ $( this ).removeClass("ccard__expand"); });
		}else{
			//if( !$( "[data-title_short='"+e.state.uid_hash +"']" ).hasClass("faq-panel__active") ){
				//CnfState.hist = false;
				if( e.state.prinv !== CnfState.prinv ){
					//$("[data-prinv='prinv_abt']").click();
				}
				//$(  "[data-title_short='"+e.state.uid_hash +"']"  ).click();
			//}
		}
	}
*/
});
//    Utils
function makeSeeAlso( json, btnNum ){ // Gen buttons - return MU string
	if( typeof json !== "undefined" && json !== ""){
		return popuTemplate("templ_seealso", [{"target": "see_also_btn_x_text", "source": json[0] },{"target": "see_also_btn_x_href", "source": json[1] }]);
	}else{
		return " ";
	}
}
function makeSoundcloud( json ){ // Return populated template of soundcloud
	if( typeof json !== "undefined" && json !== ""){
		return popuTemplate("templ_soundcloud", [{"target": "soundcloud_token", "source": json }]);
	}else{
		return " ";
	}
}
function makeYoutube( json ){ // Return populated template of youtube
	if( typeof json !== "undefined" && json !== ""){
		return popuTemplate("templ_youtube", [{"target": "youtube_token", "source": json }]);
	}else{
		return " ";
	}
}
function getPortfolioStateClass( prtf, blog ){ //
//console.log( "PRTF | BLOG ~ " + prtf + " | " + blog );
	if( prtf && blog ){
		return "state--both__show";
	}
	if( prtf ){
		return "state--prtf__show";
	}else{
		return "state--blog__show";
	}
}
function swapJSON2MD( json ){ // Mark Down translation
	var MD = "";
	if( typeof json !== "undefined" ){
		MD = json.split("---").join("<br><br>");
		MD = MD.split("-DQ-").join("&quot;");
		MD = MD.split("-B-").join("<span class='md__bold'>");
		MD = MD.split("-I-").join("<span class='md__italic'>");
		MD = MD.split("-E-").join("</span>");
		MD = MD.split("-HR-").join("<hr>");
	}
	return MD;
}
function makeId( title_short ){
//console.log( title_short.toLowerCase().replace(/\W+/g,"-") );
	return title_short.toLowerCase().replace(/\W+/g,"-");
}
function determineTN( artc_type, tags ){
	//    Just grab the first tag, lowercase it and thats the file name
	return tags[0].toLowerCase() + "_1";
}
function popuTemplate( sTemplate_id, aContents ){
	//    Return a string after swapping an assn array (objects)
	//    replacing pipe delm tokens in the template html
	//    If all the tokens have been replaced but there is still data in
	//    the contents array then use a new copy of the template.

	if( aContents.length > 0){
		var $oTempl = $("#" + sTemplate_id);
		var sMUout = ""; //  Might contain more than one template html
		var sMUprc = $oTempl.html(); // In process string
		for( var iC=0; iC < aContents.length; iC++ ){
			if( sMUprc.indexOf("|") <= 0){
				sMUout += sMUprc;
				sMUprc = $oTempl.html();
			}
			sMUprc = sMUprc.replace(("|"+aContents[iC].target+"|"), aContents[iC].source);
		}
		sMUout += sMUprc;
		return sMUout;
	}else{
		return "";
	}
}
function setPageThread(name, { popular, expires, activeClass } = {}){
	//  Setting a Default for Named Parameters
	console.log( "Name | ", name );
	console.log( "Popular | ", popular );
}