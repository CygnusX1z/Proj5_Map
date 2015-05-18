var model = [];
// Locations array
model = [
              {name: "Monaco Grand Prix"				,lat: 43.733628, long: 7.421658, markerNum: 0}
             ,{name: "Casino Monte Carlos" 				,lat: 43.739146, long: 7.428073, markerNum: 1}
             ,{name: "Royal Marine Museum & Aquarium"	,lat: 43.730612, long: 7.425276, markerNum: 2}
             ,{name: "Exotic Gardens of Monaco"			,lat: 43.731381, long: 7.414032, markerNum: 3}
             ,{name: "Prince's Palace of Monaco"		,lat: 43.731444, long: 7.419906, markerNum: 4}
             ,{name: "Cathedral of Saint Charles"		,lat: 43.742619, long: 7.427236, markerNum: 5}             
             ,{name: "Church of Saint Devote"			,lat: 43.737426, long: 7.421087, markerNum: 6}
             ,{name: "Japanese Gardens"					,lat: 43.742343, long: 7.430889, markerNum: 7}
             ,{name: "Monte-Carlo Bay Hotel & Resort"	,lat: 43.748983, long: 7.438866, markerNum: 8}
             ,{name: "Hotel Hermitage Monte-Carlo"		,lat: 43.738240, long: 7.425863, markerNum: 9}
             ,{name: "Saint Nicholas Cathedral" 		,lat: 43.730287, long: 7.422677, markerNum: 10}
             ,{name: "Francois Grimaldi Statue"			,lat: 43.731372, long: 7.421282, markerNum: 11}	
             ,{name: "Grimaldi Forum Monaco"			,lat: 43.744038, long: 7.431400, markerNum: 12}
             ];

function mapViewModel() { 
	//var self = this;
	 
	//creates an array of model objects
	//self.placeList = ko.observableArray(model);
	
	//Starting position
	var mapStartPos   = new google.maps.LatLng(43.736938, 7.421529);	
	var mapOptions = {
		  center: mapStartPos,
		  zoom: 15
		};
	
	//Center map on marker selected
	var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);	
	google.maps.event.addDomListener(window, "resize", function() {
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(center);
	});

	// Create the search box and link it to the UI element.
	var input = /** @type {HTMLInputElement} */
		(
			document.getElementById('pac-input')
		);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	var searchBox = new google.maps.places.SearchBox(
	    /** @type {HTMLInputElement} */(input));

	
   //Place pins on map
   for (i = 0; i < model.length; i++) {
	   marker = new google.maps.Marker({
		   position: new google.maps.LatLng(model[i].lat, model[i].long),
		   map: map,
		   title: model[i].name
	   });	  
   }
   
   var contentString = '<div id="content">'+
   '<div id="siteNotice">'+
   '</div>'+
   '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
   '<div id="bodyContent">'+
   '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
   'sandstone rock formation in the southern part of the '+
   'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
   'south west of the nearest large town, Alice Springs; 450&#160;km '+
   '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
   'features of the Uluru - Kata Tjuta National Park. Uluru is '+
   'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
   'Aboriginal people of the area. It has many springs, waterholes, '+
   'rock caves and ancient paintings. Uluru is listed as a World '+
   'Heritage Site.</p>'+
   '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
   'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
   '(last visited June 22, 2009).</p>'+
   '</div>'+
   '</div>';

	var infowindow = new google.maps.InfoWindow({
	   content: contentString
	});
	
	var marker = new google.maps.Marker({
	   position: mapStartPos,
	   map: map,
	   title: 'Uluru (Ayers Rock)'
	});
	google.maps.event.addListener(marker, 'click', function() {
	 infowindow.open(map,marker);
	});

}; 
google.maps.event.addDomListener(window, 'load', mapViewModel);

//ko.applyBindings(new mapViewModel());