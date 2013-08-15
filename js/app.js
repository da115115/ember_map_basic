App = Em.Application.create();

App.ApplicationController = Em.Controller.extend();
    App.ApplicationView = Em.View.extend({
        templateName: 'application'
    });

App.Router = Ember.Router.extend({
    enableLogging: true,
    root: Ember.Route.extend({
        event: Ember.Route.extend({
            route: '/',
            connectOutlets: function (router) {
                
                router.get('applicationController').connectOutlet('companies');
            }
        })
    })
});

App.Company = Em.Object.extend({
    markerText: null,
    lat: null,
    lng: null,
    number: null,
    iconUrl: null,
    isOpen: null
    
});

App.CompaniesController = Em.ArrayController.extend({
    content: [
        App.Company.create({ markerText: "Bondi Bar", lat: -33.890542, lng: 151.274856, number: 4, iconUrl: "http://www.kjftw.com/sandbox/gmap/images/icons/numeric/red04.png", isOpen: true}),
      App.Company.create({ markerText: "Coogee Beach Grill", lat: -33.923036, lng: 151.259052, number: 5, iconUrl: "http://www.kjftw.com/sandbox/gmap/images/icons/numeric/red05.png", isOpen: false}),
        App.Company.create({ markerText: "Maroubra Smoke Shop", lat: -33.950198, lng: 151.259302, number: 1, iconUrl: "http://www.kjftw.com/sandbox/gmap/images/icons/numeric/red01.png", isOpen: true}),
  ],
    
    open: function() {
        return this.filterProperty('isOpen', true);
      }.property('content.[]')
    
});


App.CompaniesView = Ember.View.extend({
    templateName: 'companies',
    map: null,
    didInsertElement: function () {

        var map = null;
        var markerArray = []; //create a global array to store markers
        var locations = this.get('controller.open');

        var myOptions = {
            zoom: 10,
            center: new google.maps.LatLng(-33.923036, 151.259052),
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
            },
            navigationControl: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        var map = new google.maps.Map(this.$().get(0), myOptions);

        
        this.set('map', map); //save for future updations
        this.$().css({ width: "600px", height: "600px" });

        locations.forEach(function(location){
            createMarker(
                new google.maps.LatLng(location.get('lat'), location.get('lng')),
                location.get('markerText'), 
                location.get('number'),
                location.get('iconUrl'));        
        }, this);
        var infowindow = new google.maps.InfoWindow({
            size: new google.maps.Size(150, 50)
        });

        function createMarker(latlng, myTitle, myNum, myIcon) {
            var contentString = myTitle;
            var marker = new google.maps.Marker({
                position: latlng,
                map: map,
                icon: myIcon,
                zIndex: Math.round(latlng.lat() * -100000) << 5,
                title: myTitle
            });

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(contentString);
                infowindow.open(map, marker);
            });

            markerArray.push(marker); //push local var marker into global array
        }
        
    }
});
App.initialize();

