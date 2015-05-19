// Model
var model = [
              {name: "Monaco Grand Prix"				,lat: 43.733628, long: 7.421658, markerNum: 0}
             ,{name: "Casino Monte Carlo" 				,lat: 43.739146, long: 7.428073, markerNum: 1}
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

// ViewModel
function mapViewModel() {
	var locArray = ko.observableArray(model);

	// Starting position
	var mapStartPos = new google.maps.LatLng(43.736938, 7.421529);	
	var mapOptions = {
		  center: mapStartPos,
		  zoom: 15
		};
	
	// Create map
	var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);	
	
	// Place pins on map
    for (i = 0; i < model.length; i++) {
	   marker = new google.maps.Marker({
		   position: new google.maps.LatLng(model[i].lat, model[i].long),
		   map: map,
		   title: model[i].name
	   });	  
   }
   
   // Create the search box and link it to the UI element.
	var input = /** @type {HTMLInputElement} */
		(
			document.getElementById('pac-input')
		);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
};
ko.applyBindings(new mapViewModel());