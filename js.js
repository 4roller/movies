/*
	JS for Movies - Jquery
	Jason Leung 
	2013.01.14
*/

var moviesJS = (function() {
	var sPos = 0;
  	var idx = 5;
    var moviesListSize;

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
					htmlBlock += '<li id="li' + (i - movieList.length + 1) * -1 + '" data-spaceid="' + movieList[i].Spaceid + '"><a href=""><img class="posterImage" alt="Movie Poster ' + movieList[i].Name + '" src="' + movieList[i].Poster + '"/></a>	<label>' + movieList[i].Name  + '</label></li>';
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
            /*
            $('#backdropDrizzle').hover(function(){
                $('#backdrop').stop(1,1).animate({
                    opacity:1
                },200,function() {
                    $('#info').hide();   
                });
            },function(){
                $('#backdrop').stop(1,1).animate({
                    opacity: 0.5
                },200, function() {
                    $('#info').show();
                });
            });
            */

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
		getStuff: function(spaceid) {
			$('#info').animate({
				opacity: 0
			}, function(){
				var jsonData; 
				var htmlBlock = '';
				var queryURL = "query.php?i=" + spaceid;

				// Jquery AJAX request for cached (?) movie API data
				$.get(queryURL, function(data) {
					jsonData =  $.parseJSON(data)
	   				htmlBlock += '<span id="iTitle"><h2>' + jsonData.Title + '</h2></span>';
	   				htmlBlock += '<span id="iYear">' + jsonData.Year + '</span>';
                    htmlBlock += '<div id="iTagline"></div>';
	   				htmlBlock += '<div id="iPlot">' + jsonData.Plot + '</div>';
	   				actors = jsonData.Actors.replace(/, /g, "&nbsp; &diams; &nbsp;");
		  			htmlBlock += '<div id="iActors">' + actors + '</div>';
		  			htmlBlock += '<div id="iContainer">';
				 	htmlBlock += '  <div id="iPoster"><img src=""></img></div>';    
	  				htmlBlock += '  <div id="iBlock">';
                    htmlBlock += '    <div id="iDirector">Director: ' + jsonData.Director + '</div>';
	  				htmlBlock += '    <div id="iWriter">Writing: ' + jsonData.Writer + '</div>';
	  				htmlBlock += '    <div id="iReleased">Release Date: ' + jsonData.Released + '</div>';
	  				htmlBlock += '    <div id="iRuntime">Runtime: ' + jsonData.Runtime + '</div>';
	  				htmlBlock += '    <div id="iGenre">' + jsonData.Genre + '</div>'
	  				htmlBlock += '    <div id="iRated" class="' + jsonData.Rated + '"></div>';
                    htmlBlock += '  </div>';
					htmlBlock += '  </div>';

	  				$('#info').html(htmlBlock);
	  				$('#info').animate({
	  					opacity: 1
	  				},200);
		
        		    moviesJS.getMoreStuff(spaceid);
        		});
			});
		},
		getMoreStuff: function(spaceid){
            $('#backdrop').animate({
                opacity: 0
            }, function() {
			    var queryURL = "http://api.themoviedb.org/3/movie/" + spaceid + "?api_key=cfff74e77ce61bec9d33ba1c6d7003b2";
			    $.get(queryURL, function(data) {
				    //console.log(data);
                    if(data.tagline != '') {
                        $('#iTagline').html('"' + data.tagline + '"');
                    }
				    var imageUrl= 'https://d3gtl9l2a4fn1j.cloudfront.net/t/p/w185/' + data.poster_path;
				    $('#iPoster img').attr('src', imageUrl);
                    $('#iPoster').css('display','inline-block');
			         
				    var backdrop= 'url(https://d3gtl9l2a4fn1j.cloudfront.net/t/p/w780/' + data.backdrop_path + ')';
				    $('#backdrop').css('background', backdrop );
                    $('#backdrop').animate({
                        opacity: 0.3
                    },2000); 
                });
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

			moviesJS.getStuff($('#li' + id).attr('data-spaceid'));
		},
		creepForth: function(e) {
    		e.preventDefault();
            if(idx >= moviesListSize) {idx = movieListSize -1; }
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
		    });
  		}




	}
})();



$(document).ready(function(){
	moviesJS.polulateList();

});
