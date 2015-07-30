// Create GoogleMaps object
var Map = function (element, opts) {
    this.gMap = new google.maps.Map(element, opts);
    this.zoom = function (level) {
        if (level) {
            this.gMap.setZoom(level);
        } else {
            return this.gMap.getZoom();
        }
    };
};

// Map Options
var mapOptions = {
    center: {
    	lat: 43.738240, lng: 7.425863 // On Hotel Hermitage
    },
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

var element = document.getElementById('map-canvas'),
    iconSelected = './images/gMapPin.png';
var map = new Map(element, mapOptions);
map.zoom(15);

// Create infoBubble library. Adds tabs to the info bubbles on the markers
var infoBubble = new InfoBubble({
    maxWidth: 300
});

infoBubble.addTab('Wikipedia','Oops! Content is not available.');
infoBubble.addTab('Street View','Oops! Content is not available.');

// Model
var places = [
     { id:  1, name: 'François Grimaldi' ,map: map.gMap, position: { lat: 43.731372, lng: 7.421282 }, icon: null, animation: google.maps.Animation.DROP, selected: 0 }
    ,{ id:  2, name: 'Grimaldi Forum' ,map: map.gMap, position: { lat: 43.744038, lng: 7.431400 }, icon: null, animation: google.maps.Animation.DROP, selected: 0 }
    ,{ id:  3, name: 'Hotel Hermitage Monte-Carlo' ,map: map.gMap, position: { lat: 43.738240, lng: 7.425863 }, icon: null, animation: google.maps.Animation.DROP, selected: 0 }
    ,{ id:  4, name: 'Jardin Exotique de Monaco' ,map: map.gMap, position: { lat: 43.731381, lng: 7.414032 }, icon: null, animation: google.maps.Animation.DROP, selected: 0 }
    ,{ id:  5, name: 'Monaco Grand Prix' ,map: map.gMap, position: { lat: 43.733628, lng: 7.421658 }, icon: null, animation: google.maps.Animation.DROP, selected: 0 }
    ,{ id:  6, name: 'Monte Carlo Casino' ,map: map.gMap, position: { lat: 43.739444, lng: 7.428889 }, icon: null, animation: google.maps.Animation.DROP, selected: 0 }
    ,{ id:  7, name: 'Monte-Carlo Bay Hotel & Resort' ,map: map.gMap, position: { lat: 43.748983, lng: 7.438866 }, icon: null, animation: google.maps.Animation.DROP, selected: 0 }
    ,{ id:  8, name: 'Oceanographic Museum'	,map: map.gMap, position: { lat: 43.730833, lng: 7.425278 }, icon: null, animation: google.maps.Animation.DROP, selected: 0 }
    ,{ id:  9, name: 'Saint Nicholas Cathedral, Monaco'	,map: map.gMap, position: { lat: 43.730287, lng: 7.422677 }, icon: null, animation: google.maps.Animation.DROP, selected: 0 }
    ,{ id: 10, name: 'Sainte-Dévote Chapel' ,map: map.gMap, position: { lat: 43.737426, lng: 7.421087 }, icon: null, animation: google.maps.Animation.DROP, selected: 0 }
];

// Marker creation
var Place = function(place) {
    place.name = ko.observable(place.name);
    place.selected = ko.observable(place.selected);
    var marker = new google.maps.Marker(place);
    if (map.markerCluster) {
        map.markerCluster.addMarker(marker);
    }
    return marker;
};

// ViewModel
var ViewModel = function(){
    var self = this;
    self.list = ko.observableArray([]);

    // Create and bind markers using the "places" array
    places.forEach(function(place){
        var marker = new Place(place);
        // Add an event listener using a closure
        google.maps.event.addListener(marker, 'click', (function(Copy) {
            return function() {
                self.setCurrentPlace(Copy);
            };
        })(marker));
        self.list().push(marker);
    });
    // Ajax call to Wikipedia
    self.wikiCall = function(data){
        var wikiTimeOut = setTimeout(function(){
            infoBubble.updateTab(0, '<div class="infoBubble">Wikipedia</div>', "So sorry, the request to Wikipedia has failed");
            infoBubble.updateContent_();
        }, 8000);
        $.ajax({
            url: "http://en.wikipedia.org/w/api.php?action=opensearch&format=json&callback=wikiCallback&limit=10&search="+data.name(),
            type: 'POST',
            dataType: "jsonp",
            success: function( response ) {
                var articleTitle = response[1];
                var articleLink = response[3];
                var result = [];
                for (var i = 0; i < articleTitle.length; i++){
                    var title = articleTitle[i];
                    var link = articleLink[i];
                    result.push('<li><a href="'+link+'"target="_blank">'+title+'</a></li>');
                }
                var contentString = result.join('');
                clearTimeout(wikiTimeOut);
                infoBubble.updateTab(0,'<div class="infoBubble">Wikipedia</div>',contentString);
                infoBubble.updateContent_();
            }
        });
    };
    // Google Maps Street View
    self.streetView = function(data){
        var img = data.position.A + "," + data.position.F;
        var contentString = '<img class="bgimg" alt="So sorry, the image failed to load." src="https://maps.googleapis.com/maps/api/streetview?size=600x300&location='+img+'">';
        infoBubble.updateTab(1,'<div class="infoBubble">Street View</div>',contentString);
        infoBubble.updateContent_();
    };
    // Set the pin on the "currently" selected option
    self.setCurrentPlace = function(data){
        self.list().forEach(function(data){
            data.setIcon(null);
            data.selected(null);
        });
        data.setIcon(iconSelected);
        data.selected(1);
        self.currentPlace(data);
        self.wikiCall(data);
        self.streetView(data);
        infoBubble.open(map.gMap, data);
        return true;
    };
    self.currentPlace = ko.observable( this.list()[0] );
    self.searchBox = ko.observable("");
    self.searchPlaces = ko.computed(function() {
            if(self.searchBox() === "") {
                return self.list();
            } else {
                return ko.utils.arrayFilter(self.list(), function(item) {
                    return item.name().toLowerCase().indexOf(self.searchBox().toLowerCase())>-1;
                });
            }
        });
};
ko.applyBindings(new ViewModel());
