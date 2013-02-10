/*
	JS for Movies - Jquery
	Jason Leung 
	2013.01.14
*/

var moviesJS = (function() {
	var sPos = 0;
  	var idx = 5;
    var moviesListSize;
    var cache = [];
    var cache2 = [];

	return {
		init: function() {
			moviesJS.populateList();
			//moviesJS.attachListeners();
		},
		polulateList: function() {
			// Assinging Variables before the rest of the funciton, to normalize "hoisting"
			
			var htmlBlock = '';

			// Jquery AJAX request to a static json movie file list (wwhich could be dynamic in the future)
			$.get("movieList.json", function(data) {
				var movieList = data.MovieList.Movies;
                movieList.reverse();
                moviesListSize = movieList.length;
				// Create a block of html from json data
				for(var i = movieList.length-1; i >= 0; i-- ) {
					htmlBlock += '<li id="li' + (i - movieList.length + 1) * -1 + '" data-spaceid="' + movieList[i].Spaceid + '"><a href=""><img class="posterImage" alt="Movie Poster ' + movieList[i].Name + '" src="' + movieList[i].Poster + '"/></a></li>';
				}

				// Inject html block to the page
				$('#scroller').html(htmlBlock);
				moviesJS.attachListeners();
			});
		},
		attachListeners: function() {
			$('.posterImage').click(function(e) {
				e.preventDefault();
                var locationId = $(this).parent().parent().attr('id').replace('li', '');
				moviesJS.posterSelect(locationId); 
			});
			$('.button').click(function(e){
				if($(this).attr('id') == 'next') {
					moviesJS.creepForth(e);
				} else {
					moviesJS.creepBack(e);
				}
			});
            $(document).keydown(function(e) {
                if (e.keyCode == 37) {
                    if(idx < 0 ) { idx = 0;}
                    else {idx -=1; }
                    moviesJS.posterSelect(idx);
                }
                if (e.keyCode == 39) {
                    if(idx >=moviesListSize ) { idx = moviesListSize -1; }
                    else { idx += 1;}
                    moviesJS.posterSelect(idx);
                }
            });
		},
		resetPoster: function() {
			$('.posterImage').animate({
				width: 60,
				opacity: 0.6
			}, 150);
		},
		getPrimaryData: function(spaceid) {
			var data;

			// check if data is in local cache
			if( typeof cache[spaceid] == 'undefined') {				
			    var queryURL = "query.php?i=" + spaceid;
			    $.get(queryURL, function(data) {
			    	data =  $.parseJSON(data);
			    	cache[spaceid] = data;
			    	moviesJS.displayPrimaryData(data, spaceid);
			    });
			} else {
				moviesJS.displayPrimaryData(cache[spaceid], spaceid);
			}
		},
		displayPrimaryData: function(data, spaceid) {
			$('#info').animate({
				opacity: 0
			}, function(){
				var htmlBlock = '';
	   				htmlBlock += '<span id="iTitle"><h2>' + data.Title + '</h2></span>';
	   				htmlBlock += '<span id="iYear">' + data.Year + '</span>';
                    htmlBlock += '<div id="iTagline"></div>';
	   				htmlBlock += '<div id="iPlot">' + data.Plot + '</div>';
	   				actors = data.Actors.replace(/, /g, "&nbsp; &diams; &nbsp;");
		  			htmlBlock += '<div id="iActors">' + actors + '</div>';
		  			htmlBlock += '<div id="iContainer">';
				 	htmlBlock += '  <div id="iPoster"><img src=""></img></div>';    
	  				htmlBlock += '  <div id="iBlock">';
                    htmlBlock += '    <div id="iDirector">Director: ' + data.Director + '</div>';
	  				htmlBlock += '    <div id="iWriter">Writing: ' + data.Writer + '</div>';
	  				htmlBlock += '    <div id="iReleased">Release Date: ' + data.Released + '</div>';
	  				htmlBlock += '    <div id="iRuntime">Runtime: ' + data.Runtime + '</div>';
	  				htmlBlock += '    <div id="iGenre">' + data.Genre + '</div>'
	  				htmlBlock += '    <div id="iRated" class="' + data.Rated + '"></div>';
                    htmlBlock += '  </div>';
					htmlBlock += '  </div>';

	  				$('#info').html(htmlBlock);
	  				$('#info').animate({
	  					opacity: 1
	  				},200);
		
        		    moviesJS.getSecondaryData(spaceid);
			});
		},
		getSecondaryData: function(spaceid){
			var data;
			// check if data is in local cache
			if( typeof cache2[spaceid] == 'undefined') {				
			    var queryURL = 'query2.php?i=' + spaceid;
			    $.get(queryURL, function(data) {
			    	data =  $.parseJSON(data);
			    	cache2[spaceid] = data;
			    	moviesJS.displaySecondaryData(data);
			    });
			} else {
				moviesJS.displaySecondaryData(cache2[spaceid]);
			}
		},
		displaySecondaryData: function(data) {
            $('#backdrop').animate({ 
                opacity: 0
            }, function() {
                if(data.tagline != '') {
                    $('#iTagline').html('"' + data.tagline + '"');
                }
			    var imageUrl= 'https://d3gtl9l2a4fn1j.cloudfront.net/t/p/w185/' + data.poster_path;
			    $('#iPoster img').attr('src', imageUrl);
                $('#iPoster').css('display','inline-block');
		         
			    var backdrop= 'https://d3gtl9l2a4fn1j.cloudfront.net/t/p/original/' + data.backdrop_path ;
			    $('#backdrop img').attr('src', backdrop);
                $('#backdrop').animate({
                    opacity: 0.3
                },2000); 
            });
		},
		posterSelect: function(id) {
            idx = parseInt(id);
			moviesJS.resetPoster();
			moviesJS.creepTo(id);
			selector = '#li' + id + ' .posterImage';
			$(selector).animate({
				width: 90,
				opacity: 1
			},250);
			$('#title').hide();

			moviesJS.getPrimaryData($('#li' + id).attr('data-spaceid'));
		},
		creepForth: function(e) {
    		e.preventDefault();
            if(idx >= moviesListSize) {idx = moviesListSize ; }
            else {idx += 3;}
    		moviesJS.creepTo(idx);        
  		},
  		creepBack: function(e) {
    		e.preventDefault();
            if(idx <= 0){ idx=0; }
            else { idx -= 3;}
    		moviesJS.creepTo(idx);
  		},
  		creepTo: function(idx) {
            //console.log(idx);
		    sPos = parseInt(sPos);
		    idx = ((110 * idx ) *-1 ) + (($(document).width()/2) -300 ) ;  
		    $('#scroller').animate({
		    	left: idx
		    },200);
  		}
	}
})();


$(document).ready(function(){
	moviesJS.polulateList();

});
