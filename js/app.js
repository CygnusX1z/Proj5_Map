var infowindow, map, marker, locations;
var markers = [];

// Locations array
locations = [
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

var ExplorerMap = function() {
	monaco = new google.maps.LatLng(43.736938, 7.421529);
	var mapOptions = {
			 zoom: 14
			,center: monaco
	};
	
	map = new google.maps.Map(document.getElementById('map-canvas'),
			mapOptions);
	
	// Create markers
	var infowindow = new google.maps.InfoWindow();
	for (i = 0; i < locations.length; i++) {
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(locations[i].lat, locations[i].long)
			,map: map
			,title: locations[i].name
		});
		
		google.maps.event.addListener(marker, 'click', (function(marker) {
			return function() {
				map.panTo(marker.getPosition());
				infowindow.setContent(marker.title+"<div id='content'></div>");
				infowindow.open(map, marker);
			};
		})(marker));
		markers.push(marker);
	}
};

var ExplorerViewModel = function() {
	var self = this;
	
	// observe the global array of locations
	self.locations = ko.observableArray(locations);
	
	self.markers = ko.observableArray(markers);
	
	self.filter = ko.observable('');
	
	// InfoWindow
	self.OpenInfoWindow = function(locations) {
		var point = markers[locations.markerNum];		
		map.panTo(point.getPosition());
		
		// set infowindow
		infowindow.open(map, point);
		infowindow.setContent(point.title+"<div id='content'></div>");
		
		// Google Maps Marker Animation
		point.setAnimation(google.maps.Animation.BOUNCE);
		
		
	};
	
	// Show/Hide Markers
	self.showOrHideMarkers = function(state) {
		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(state);
		}
	};
	
	// Filter of Array
	self.filterArray = function(filter) {
		return ko.utils.arrayFilter(self.locations(), function(location) {
			return location.name.toLowerCase().indexOf(filter) >= 0;
		});
	};
	
	// Display selected marker
	self.displaySelected = function(filteredmarkers) {
		for (var i = 0; i < filteredmarkers.length; i++) {
			markers[filteredmarkers[i].markerNum].setMap(map);
		}
	};
	
	// filterList
	self.filterList = function() {
		var filter = self.filter().toLowerCase();
			if (!filter) {
				self.showOrHideMarkers(map);
				return self.locations();
			} else {
				self.showOrHideMarkers(null);
				var filteredmarkers = [];
				filteredmarkers = self.filterArray(filter);
				self.displaySelected(filteredmarkers);
				return filteredmarkers;
			}
	};
};
google.maps.event.addDomListener(window, 'load', ExplorerMap);
ko.applyBindings(new ExplorerViewModel());