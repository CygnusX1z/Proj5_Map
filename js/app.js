/*var infowindow, map, monaco, locArray, Url;
var marker;*/
var map;
var markers = []; 

//Model
locArray = [
            {name: "Casino Monte Carlo" 			,lat: 43.739146, long: 7.428073, urlName: "Monte_Carlo_Casino"							, markerNum: 0}
           ,{name: "Cathedral of Saint Charles"		,lat: 43.742619, long: 7.427236, urlName: "Cathedral%20of%20Saint%20Charles%20Monaco"	, markerNum: 1} 
           ,{name: "Church of Saint Devote"			,lat: 43.737426, long: 7.421087, urlName: "Sainte-Dévote%20Chapel"						, markerNum: 2}
           ,{name: "Exotic Gardens of Monaco"		,lat: 43.731381, long: 7.414032, urlName: "Jardin_Exotique_de_Monaco"					, markerNum: 3}
           ,{name: "Francois Grimaldi Statue"		,lat: 43.731372, long: 7.421282, urlName: "Fran%C3%A7ois_Grimaldi"						, markerNum: 4}	
           ,{name: "Grimaldi Forum"					,lat: 43.744038, long: 7.431400, urlName: "Grimaldi_Forum"								, markerNum: 5}
           ,{name: "Hotel Hermitage Monte-Carlo"	,lat: 43.738240, long: 7.425863, urlName: "Hotel%20Hermitage%20Monte-Carlo"				, markerNum: 6}
           ,{name: "Japanese Gardens"				,lat: 43.742343, long: 7.430889, urlName: "Japanese%20Gardens%20Monaco"					, markerNum: 7}
           ,{name: "Monaco Grand Prix"				,lat: 43.733628, long: 7.421658, urlName: "Monaco%20Grand%20Prix"						, markerNum: 8}
           ,{name: "Monte-Carlo Bay Hotel & Resort"	,lat: 43.748983, long: 7.438866, urlName: "Monte-Carlo%20Bay%20Hotel%20&%20Resort"		, markerNum: 9}
           ,{name: "Prince's Palace of Monaco"		,lat: 43.731444, long: 7.419906, urlName: "Prince's%20Palace%20of%20Monaco"				, markerNum: 10}             
           ,{name: "Royal Marine Museum & Aquarium"	,lat: 43.730612, long: 7.425276, urlName: "Royal%20Marine%20Museum%20&%20Aquarium%20Monaco"	, markerNum: 11}             
           ,{name: "Saint Nicholas Cathedral" 		,lat: 43.730287, long: 7.422677, urlName: "Saint_Nicholas_Cathedral,_Monaco" 			, markerNum: 12}            
         ];

var initMap = function() {
  // Set 'starting' position and mapOptions
  monaco= new google.maps.LatLng(43.737426, 7.421087);
  var mapOptions = {
    zoom: 15,
    center: monaco
  };
  
 // Create map and place in map-canvas div
 map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
 
 // Create infowindow and contentString variables
 var infowindow = new google.maps.InfoWindow();
 var contentString = '<ul id="wikipedia-links">bla</ul>';
 
 //Create markers and infowindow and place on map
 for (i = 0; i < locArray.length; i++) {
	  var wikiUrl =  'http://en.wikipedia.org/w/api.php?action=opensearch&search=' 
		  + locArray[i].urlName + '&format=json&callback=wikiCallback';	  
	  var wikiRequestTimeout = setTimeout(function(){
			wikiUrl = "Wikipedia resource not found.";
		}, 8000);
	
	  console.log(wikiUrl);
	  
	  var marker = new google.maps.Marker({
              position: new google.maps.LatLng(locArray[i].lat, locArray[i].long)
    		, map: map
    		, title: locArray[i].name  
    		, wikiLink: contentString
        });
	  
	  // Google Maps API on click addListener
	  google.maps.event.addListener(marker, 'click', (function(marker)  {
		  return function() {
			  map.panTo(marker.getPosition());
			  infowindow.setContent(marker.title+marker.wikiLink);
			  infowindow.open(map, marker);

              // Google Maps API marker animation
              marker.setAnimation(google.maps.Animation.BOUNCE);
              setTimeout(function(){ marker.setAnimation(null); }, 750);
            };
        })(marker));
        markers.push(marker);   
        
       $.ajax({
    	url: wikiUrl,
    	dataType: "jsonp",
    	success: function(response) {
    		var articleList = response[1];
    		for (var i=0; i < articleList.length; i++) {
    			articleStr = articleList[0]; // Use first returned article
    			var url = 'http://en.wikipedia.org/wiki/' + articleStr;
    			console.log(url);
    			
    			$.each(markers, function(index,marker){
    				$.ajaxSetup({ cache: false });
    				$.getJSON("wikiURL"),
    					function(data){
    					marker.infowindow.getContent.setContent("foo bar")
    				}    				
    			})
    		};
    		//clearTimeout(wikiRequestTimeout);
    	}
       });
    //return false;
  };
};

// ViewModel
var mapViewModel = function(){
  var self = this;

  // Define and assign KO observables
  self.locArray= ko.observableArray(locArray);
  self.markers=ko.observableArray(markers);
  self.filter= ko.observable('');
  
  // Infowindow list click function
  self.OpenInfoWindow= function(locArray){
    var point= markers[locArray.markerNum];
      map.panTo(point.getPosition());

	 // Open infowindow on click
	 infowindow.open(map, point);
	 infowindow.setContent(point.title);
	 //infowindow.setContent(point.title+"<div id='content'>"+"<a href="+wikiUrl+">"+"Wikipedia Article"+"</a>"+"</div>");
	
	 // Google Maps marker animation
	 point.setAnimation(google.maps.Animation.BOUNCE);
	 setTimeout(function(){ point.setAnimation(null); }, 750);
  };
 
  // Filter show/hide markers function
  self.showOrHideMarkers= function(state){
           for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(state);
          }
        };
        
  // KO arrayFilter
  self.filterArray = function(filter){
       return ko.utils.arrayFilter(self.locArray(), function(location) {
        return location.name.toLowerCase().indexOf(filter) >= 0;
       });
  };
  
  // Selected marker displayed
  self.displaySelected = function(filteredmarkers){
  for (var i = 0; i < filteredmarkers.length; i++) {
             markers[filteredmarkers[i].markerNum].setMap(map);
            }
      };

  // Filter of locArray list
  self.filterList = function(){
	var filter = self.filter().toLowerCase();
	  if (!filter) {
	      self.showOrHideMarkers(map);
	     return self.locArray();
	  } else {	
	  self.showOrHideMarkers(null);
	  var filteredmarkers = [];
	  filteredmarkers = self.filterArray(filter);
	  self.displaySelected(filteredmarkers);
	  return filteredmarkers;	
	  }
	}; 
};
google.maps.event.addDomListener(window, 'load', initMap);
ko.applyBindings(new mapViewModel());