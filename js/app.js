// This will let you use the .remove() function later on
      if (!('remove' in Element.prototype)) {
        Element.prototype.remove = function() {
          if (this.parentNode) {
              this.parentNode.removeChild(this);
          }
        };
      }

      mapboxgl.accessToken =
        "pk.eyJ1IjoidHVnY2UtdGF5IiwiYSI6ImNrd3o3dTM1eTBmaWIycXB6bHlwb3djb2UifQ.GiUzrj8Wtb2JcDYcc3Xk6w";
      /** 
       * Add the map to the page
      */
      var map = new mapboxgl.Map({
        container: "map",
		style: 'https://api.maptiler.com/maps/3805c135-7e5a-4cbe-b166-7c9949f837f2/style.json?key=99Jpt9rW905GryD9oVFd',
        center: [-4.093626,53.263573],
        zoom: 13,
        scrollZoom: false
      });
    /*
    ** Navigation control
    */
	var nav = new mapboxgl.NavigationControl();
	map.addControl(nav, 'top-right');
	/*
    ** geolocation control
    */
    var geolocation = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    })
	map.addControl(geolocation, 'top-right');
    /*
    ** Full screen control
    */
	map.addControl(new mapboxgl.FullscreenControl());
	var pois = {
		"type": "FeatureCollection",
		"features": [
		  {
			"type": "Feature",
			"geometry": {
			  "type": "Point",
			  "coordinates": [
                -4.093047192080715,
				53.26365279610769
			  ]
			},
			"properties": {
			  "name": "Cole & Co",
			  "address": "10 Church St, Beaumaris LL58 8BB, UK",
			  "phone": "+44 1248 811391",
			  "website": "https://www.coleandco.com/",
			  "fb": "https://www.facebook.com/ColeandCoBeaumaris/",
			  
			}
		  },
		   {
			"type": "Feature",
			"geometry": {
			  "type": "Point",
			  "coordinates": [
                  -4.103290718918974,
                  53.25544090746401
                  
			  ]
			},
			"properties": {
			  "name": "Sbarc Limited",
			  "address": "Beaumaris LL58 8YL, UK",
			  "phone": "+44 1248 717903",
			  "website": "https://www.sbarc.net/",
			  "fb": "https://www.facebook.com/sbarc.wales",
			  
			}
		  },
		 {
			"type": "Feature",
			"geometry": {
			  "type": "Point",
			  "coordinates": [
                  -4.093294977966009,
                  53.26278842047478   
			  ]
			},
			"properties": {
			  "name": "Beaumaris Clothing Company",
			  "address": "46B Castle St, Beaumaris LL58 8BB, UK",
			  "phone": "+44 1248 812140",
			  "website": "https://beaumarisclothingco.co.uk/",
			  "fb": "",
			  
			}
		  },
            
            {
			"type": "Feature",
			"geometry": {
			  "type": "Point",
			  "coordinates": [
                  -4.0948714716414525,
                  53.26299684993786
                  
			  ]
			},
			"properties": {
			  "name": "B I C O Ltd",
			  "address": "Rosemary Lane, Beaumaris, Anglesey LL58 8EB",
			  "phone": "01248 810463",
			  "website": "https://bicoltd.co.uk/",
			  "fb": "https://twitter.com/ltdbico",
			  
			}
		  },
          {
			"type": "Feature",
			"geometry": {
			  "type": "Point",
			  "coordinates": [
                 -4.103914980532406,
                  53.255167860556014
			  ]
			},
			"properties": {
			  "name": "Bag People UK Ltd",
			  "address": "Unit 6a, Gallows Point, Beaumaris LL58 8YL",
			  "phone": "+44 1978 511 344",
			  "website": "https://bagpeople.co.uk/",
			  "fb": "https://www.facebook.com/bag.people/",
			  
			}
		  },
		]
	};
      
      /**
       * Assign a unique id to each poi. You'll use this `id`
       * later to associate each point on the map with a listing
       * in the sidebar.
      */
	pois.features.forEach(function(poi, i){
	poi.properties.id = i;
	});

      /**
       * Wait until the map loads to make changes to the map.
      */
    map.on('load', function (e) {
        /** 
         * This is where your '.addLayer()' used to be, instead
         * add only the source without styling a layer
        */
        map.addSource("places", {
			"type": "geojson",
			"data": pois,
			"cluster": true,
			"clusterMaxZoom": 14, // Max zoom to cluster points on
			"clusterRadius": 50 // Radius of each cluster when clustering points (defaults to 50)
		});
        /**
         * Add all the things to the page:
         * - The location listings on the side of the page
         * - The markers onto the map
        */
        buildLocationList(pois);
        addMarkers();
      });

      /**
       * Add a marker to the map for every poi listing.
      **/
      function addMarkers() {
        /* For each feature in the GeoJSON object above: */
        pois.features.forEach(function(marker) {
          /* Create a div element for the marker. */
          var el = document.createElement('div');
          /* Assign a unique `id` to the marker. */
          el.id = "marker-" + marker.properties.id;
          /* Assign the `marker` class to each marker for styling. */
          el.className = 'marker';
          
          /**
           * Create a marker using the div element
           * defined above and add it to the map.
          **/
          new mapboxgl.Marker(el, { offset: [0, -23] })
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);

          /**
           * Listen to the element and when it is clicked, do three things:
           * 1. Fly to the point
           * 2. Close all other popups and display popup for clicked poi
           * 3. Highlight listing in sidebar (and remove highlight for all other listings)
          **/
          el.addEventListener('click', function(e){
            /* Fly to the point */
            flyTopoi(marker);
            /* Close all other popups and display popup for clicked poi */
            createPopUp(marker);
            /* Highlight listing in sidebar */
            var activeItem = document.getElementsByClassName('active');
            e.stopPropagation();
            if (activeItem[0]) {
              activeItem[0].classList.remove('active');
            }
            var listing = document.getElementById('listing-' + marker.properties.id);
            listing.classList.add('active');
          });
        });
      }

      /**
       * Add a listing for each poi to the sidebar.
      **/
      function buildLocationList(data) {
        data.features.forEach(function(poi, i){
          /**
           * Create a shortcut for `poi.properties`,
           * which will be used several times below.
          **/
          var prop = poi.properties;

          /* Add a new listing section to the sidebar. */
          var listings = document.getElementById('listings');
          var listing = listings.appendChild(document.createElement('div'));
          /* Assign a unique `id` to the listing. */
          listing.id = "listing-" + prop.id;
          /* Assign the `item` class to each listing for styling. */
          listing.className = 'item';

          /* Add the link to the individual listing created above. */
          var link = listing.appendChild(document.createElement('a'));
          link.href = '#';
          link.className = 'title';
          link.id = "link-" + prop.id;
          link.innerHTML = prop.name;

          /* Add details to the individual listing. */
          var details = listing.appendChild(document.createElement('div'));
          details.innerHTML = prop.address;
          if (prop.website) {
            details.innerHTML += ' || ' + prop.website;
          }

          /**
           * Listen to the element and when it is clicked, do four things:
           * 1. Update the `currentFeature` to the poi associated with the clicked link
           * 2. Fly to the point
           * 3. Close all other popups and display popup for clicked poi
           * 4. Highlight listing in sidebar (and remove highlight for all other listings)
          **/
          link.addEventListener('click', function(e){
            for (var i=0; i < data.features.length; i++) {
              if (this.id === "link-" + data.features[i].properties.id) {
                var clickedListing = data.features[i];
                flyTopoi(clickedListing);
                createPopUp(clickedListing);
              }
            }
            var activeItem = document.getElementsByClassName('active');
            if (activeItem[0]) {
              activeItem[0].classList.remove('active');
            }
            this.parentNode.classList.add('active');
          });
        });
      }

      /**
       * Use Mapbox GL JS's `flyTo` to move the camera smoothly
       * a given center point.
      **/
      function flyTopoi(currentFeature) {
        map.flyTo({
          center: currentFeature.geometry.coordinates,
          zoom: 15
        });
      }

      /**
       * Create a Mapbox GL JS `Popup`.
      **/
      function createPopUp(currentFeature) {
        var popUps = document.getElementsByClassName('mapboxgl-popup');
        if (popUps[0]) popUps[0].remove();
        var popup = new mapboxgl.Popup({closeOnClick: false})
          .setLngLat(currentFeature.geometry.coordinates)
            .setHTML(
                `<h3>${currentFeature.properties.name} </h3>
                <table> 
                    <tr>
                        <td><i class="fa-solid fa-location-dot"></i></td>
                        <td>${currentFeature.properties.address}</td>
                    </tr>
                    <tr>
                        <td><i class="fa-solid fa-phone"></i></td>
                        <td>${currentFeature.properties.phone}</td>
                    </tr>
                    </table>
                    <ul class="social">
                        <li><a href=${currentFeature.properties.website} title="web site"><i class="fa-brands fa-internet-explorer" style= "color:white"></i></a></li>
                        <li><a href=${currentFeature.properties.fb} title="Facebook Page"><i class="fa-brands fa-facebook"style= "color:white"></i></a></li>
                  </ul>`
                  
                  )
          .addTo(map);
      }