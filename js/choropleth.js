(function ($) {

	$.fn.choropleth_map = function(data, metadata){

		return this.each(function() {

      var $el = jQuery( this );

			var map, gjLayerDist, gjLayerStates;

      // CREATE ELEMENTS ON THE FLY
      function createElements(){

        var $loader = jQuery( document.createElement( 'div' ) );
        $loader.addClass('spinner-grow');
				$loader.attr('role', 'status');
        $loader.html( '<span class="sr-only">Loading...</span>' );
        $loader.appendTo( $el );

        var $map = jQuery( document.createElement( 'div' ) );
        $map.attr('id', 'map');
        $map.appendTo( $el );

		var $legend = jQuery( document.createElement( 'div' ) );
        //$legend.attr('id', 'legend');
				$legend.html('<h5>मानचित्र संकेत :</h5><p><span class="key-item" style="background-color:#AEFFB1"></span> कोई केस नहीं </p><p><span class="key-item" style="background-color:#FF9898"></span> 5 केस या उससे काम </p><p><span class="key-item" style="background-color:#FF6666 "></span> 6 से 10 केस</p><p><span class="key-item" style="background-color:#FE3636"></span> 11 से 15 केस</p><p><span class="key-item" style="background-color:#FB0000"></span>15 से  अधिक </p>');
        $legend.appendTo('#legend');
		
		var $legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

				$("#timestamp").empty().append(metadata[0]["Value"]);

				//NATIONAL LEVEL TOTALS
				var totals = [0,0,0,0]
				for (var i = 0; i < data.length; i++){
					totals[0] = totals[0] + Number(data[i]["Confirmed Cases"]);
					totals[1] = totals[1] + Number(data[i]["Discharged"]);
					totals[2] = totals[2] + Number(data[i]["Deaths"]);
					totals[3] = totals[3] + Number(data[i]["Active"]);
				}
				$('#tot_conf').empty().append(totals[0]);
				$('#tot_disch').empty().append(totals[1]);
				$('#tot_death').empty().append(totals[2]);
				$('#tot_act').empty().append(totals[3]);

				//MODAL INFO
				$('#abt-modal').click( function () {
					$("#infoModalLabel").empty().append("About this Map");
					$(".modal-body").empty().append('<p>यह सरकारी या अधिकृत वेबसाइट नहीं है बल्कि आप लोगो की भलाई के लिए निजी टीम द्वारा संचालित है  यह मानचित्र छत्तीसगढ़ में जिला स्तर पर CoVid-19 मामलों को ट्रैक करने का एक प्रयास है। इस डेटा का स्रोत विश्वसनीय समाचार रिपोर्ट है, और संदर्भ के रूप में <a href="http://www.mohfw.gov.in/" target="_blank">MoHFW से आधिकारिक संख्याओं </a>का  उपयोग किया जाता है। डेटा <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQlEfzRXHLX4cxB_1WIUJMp_9ToKOD9Ad6t2UUlmgI7XeuiuzKLtx-XwNXy4ZcQ8Zq3Cr07Rq7Vmq9t/pubhtml#" target="_blank">यहाँ संकलित किया गया है।</a>.</p><p>इस अभ्यास के बारे में कुछ मुद्दे:  अ) उन मामलों को चिह्नित किया जाना चाहिए जहां रोगी वर्तमान में संगरोधित है या जहां वे निवास करते हैं (या जहां फैल हो सकता है),  ब)  एक समाचार रिपोर्ट में प्रकाशित होने और अधिकारियों द्वारा सूचित किए जाने के बीच समय का अंतर होने के कारण, आकड़ों में अंतर हो सकता है</p><p>सुझाव  का स्वागत  है।  आप हमें <a href="mailto:covid19cg@gmail.com?subject=covid19 cg district map feedback">ईमेल </a>भेज सकते हैं . धन्यवाद  !</p><hr><p>यदि आपको महामारी के बारे में मदद या अधिक जानकारी चाहिए, तो निम्नलिखित लिंक पर विचार करें::</p><ul><li><a href="https://www.who.int/health-topics/coronavirus" target="_blank">World Health Organization</a></li><li><a href="http://www.mohfw.gov.in/" target="_blank">Ministry of Health and Family Welfare</a></li><li><a href="https://t.me/MyGovCoronaNewsdesk" target="_blank">GOI official Telegram channel for corona</a></li><li><a href="https://www.mygov.in/covid-19/" target="_blank">MyGov - Covid 19</a></li><li><a href="https://www.coronasafe.in/" target="_blank">Coronasafe</a></li><li><a href="https://www.covid19india.org/" target="_blank">India CoVID 19 tracker</a></li></ul>');});
				$('#ct-modal').click( function () {
					$("#infoModalLabel").empty().append("Contribute to this Map");
					$(".modal-body").empty().append('<p>यदि आप web designer  android  app प्रोग्रामर इत्यादि हैं अथवा Leaflet and jQuery, react  में अनुभव रखते हैं तो वेबसाइट को और बेहतर बनाने में अपना योगदान कर सकते हैं  आप हमें <a href="mailto:covid19cg@gmail.com?subject=covid19 cg district map feedback">ईमेल </a>भेज सकते हैं . धन्यवाद  !</p>');
				});
				$('#bt-modal').click( function () {
					$("#infoModalLabel").empty().append("govt updates");
					$(".modal-body").empty().append('<p>govt update the <a href="https://github.com/guneetnarula/covid19-in" target="_blank">git repo</a> and contribute</p><p>If you are a journalist or someone carefully tracking news, you can help maintain the data. See the <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vRlSCAn1nS4h9n9Fp25iuOsH54RfMUjj3xX5CZqjGUqYCVXgwgtJojuqVeqekazs2TkSJ95Jwplo7lL/pubhtml#" target="_blank"">readme sheet here</a>.</p>');
				});
				$('#st-modal').click( function () {
					$("#infoModalLabel").empty().append("State Level Data");
					$(".modal-body").empty().append(stateData());
				});
				$('#dt-modal').click( function () {
					$("#infoModalLabel").empty().append("District Level Data");
					$(".modal-body").empty().append(districtData());
				});
      }



      function drawMap(){
				//console.log(data);

        // HIDE THE LOADER
        $el.find('.spinner-grow').hide();

				//SETUP BASEMAP
				map = L.map('map').setView( [20.82, 82.37], 7 );

        //var hybUrl='https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ3VuZWV0bmFydWxhIiwiYSI6IldYQUNyd0UifQ.EtQC56soqWJ-KBQqHwcpuw';
        var hybUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
        var hybAttrib = 'Map data © <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors & <a href="http://datameet.org" target="_blank">Data{Meet}</a>';
        var hyb = new L.TileLayer(hybUrl, {minZoom: 4, maxZoom: 12, attribution: hybAttrib, opacity:1}).addTo(map);

        //---------------ADD DISTRICT BOUNDARIES

			gjLayerDist = L.geoJson( geodist, { style: styledist, onEachFeature: onEachDist } );
			gjLayerDist.addTo(map);

        //---------------ADD STATE BOUNDARIES


        gjLayerStates = L.geoJson( geoStates, { style: stylestate } );
        gjLayerStates.addTo(map);

      }
			//END OF drawMap



			function popContent( feature ) {
        //FOR DISTRICT POP UPS ON CLICK
				for(var i = 0; i < data.length; i++) {
					if (data[i]["District"] == feature.properties["dtname"]) {
        		return '<h4>'+feature.properties["dtname"]+', '+feature.properties["stname"]+'</h4><hr><p>Confirmed Cases: <b>'+data[i]["Confirmed Cases"]+'</b> out of '+counter("State",feature) +' in the state</p><p>Discharged/Recovered: '+data[i]["Discharged"]+'</p><p>Deaths: '+data[i]["Deaths"]+'</p><p>Active Cases: '+data[i]["Active"]+'</p><hr><small>'+data[i]["Notes"]+'</small>';
					}
					else if ( i == data.length-1) return '<h4>'+feature.properties["dtname"]+', '+feature.properties["stname"]+'</h4><hr><p>No cases reported</p>';

				}
      }
			//-----------------------------





			function stylestate( feature ) {
        //STATE STYLES

				//var c_count = counter("State", feature);
				return {
          weight: 1,
          opacity: 0.9,
          color: "#000",
          fill: false
        };
      }

			function styledist( feature ) {
        //DISTRICTS STYLES - CHOROPLETH COLORS BASED ON RANGE ONLY
        var color = "#feebe2";

				var c_count = counter("District", feature); //JUST FINDS THE CORRECT ROW

				if (c_count > 15) color = "#FB0000 ";
				else if (c_count > 10 && c_count <= 15 ) color = "#FE3636 ";
				else if (c_count > 5 && c_count <= 10) color = "#FF6666";
				else if (c_count >= 1 && c_count <= 5) color = "#FF9898";
				else {color = "#AEFFB1";}

				return {
          fillColor: color,
          weight: 1,
          opacity: 0.4,
          color: 'black',
          dashArray: '1',
          fillOpacity: 1
        };
      }

			function counter(level, feature){
				//CASE COUNTER FOR STATES
				var count = 0;

				if (level == "District") var property = "dtname";
				else var property = "stname";

				for (var i = 0;i<data.length;i++){
          if (data[i][level] == feature.properties[property] && data[i]["State"] == feature.properties['stname']) {
						count = count + Number(data[i]["Confirmed Cases"]);
					}
        }
				return count;
			}

      function onEachDist( feature, layer ) {
        //CONNECTING TOOLTIP AND POPUPS TO DISTRICTS
        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
        });
				layer.on('click', function(e, feature){
					zoomToFeature(e);
				});
        layer.bindTooltip( feature.properties["dtname"] + ', ' + feature.properties["stname"], {
          direction : 'auto',
          className : 'statelabel',
          permanent : false,
          sticky    : true
        } );
        layer.bindPopup(popContent(feature), {maxWidth:700});

      }

      function highlightFeature(e) {
        //DISTRICT HIGHLIGHT ON MOUSEOVER
        var layer = e.target;

        layer.setStyle( {
          weight: 3,
          color: 'violet',
          opacity: 0.8
        } );
        if ( !L.Browser.ie && !L.Browser.opera ) {
          layer.bringToFront();
        }
      }

      function resetHighlight(e) {
          //RESET HIGHLIGHT ON MOUSEOUT
          var layer = e.target;
          layer.setStyle({
            weight: 1,
            color: 'black',
            opacity: 0.4
          });
					if ( !L.Browser.ie && !L.Browser.opera ) {
	          layer.bringToBack();
	        }
      }

      function zoomToFeature(e) {
				//ZOOM TO DISTRICT ON CLICK
        map.fitBounds(e.target.getBounds().pad(1));
      }

			//STATE COUNTS FOR MODAL
			function stateData(){
				var s_totals = [];
				var flag = 0;

				for ( var i = 0; i < data.length; i++ ){
					flag = 0; //CHECKS IF ARRAY ALREADY HAS STATE
					s_totals.forEach( function(state){
						if(state.name == data[i]["State"]) flag = 1;
					});

					if (flag == 0) {
						var totals = allCounts("State", data[i]["State"]);
						s_totals.push({name:data[i]["State"],cc:totals[0],di:totals[1],de:totals[2],ac:totals[3]});
					}
				}

				s_totals.sort((a,b) => b.cc - a.cc); //SORT BY CONFIRMED CASES
				//console.log(s_totals);
				var stateHTML = "<table><tbody><tr><th>State</th><th>Confirmed Cases</th><th>Discharged/Recovered</th><th>Deaths</th><th>Active Cases</th></tr>";
				s_totals.forEach( function(state) {
					stateHTML = stateHTML + '<tr><td>'+state.name+'</td><td>'+state.cc+'</td><td>'+state.di+'</td><td>'+state.de+'</td><td>'+state.ac+'</td></tr>';
				});
				stateHTML = stateHTML + '</tbody></table>';

				return stateHTML;
			}
			//CASES COUNTS FOR STATES
			function allCounts(level, name) {
				var totals = [0,0,0,0];
				for ( var i = 0; i < data.length; i++ ){
					if (data[i][level] == name) {
						totals[0] = totals[0] + Number(data[i]["Confirmed Cases"]);
						totals[1] = totals[1] + Number(data[i]["Discharged"]);
						totals[2] = totals[2] + Number(data[i]["Deaths"]);
						totals[3] = totals[3] + Number(data[i]["Active"]);
					}
				}
				return totals;
			}

			//DISTRICTS MODAL
			function districtData() {
				data.sort((a,b) => b["Confirmed Cases"] - a["Confirmed Cases"]);
				var districtHTML = "<table><tbody><tr><th>District</th><th>State</th><th>Confirmed Cases</th><th>Discharged/Recovered</th><th>Deaths</th><th>Active Cases</th></tr>";
				data.forEach( function(district) {
					districtHTML = districtHTML + '<tr><td>'+district["District"]+'</td><td>'+district["State"]+'</td><td>'+district["Confirmed Cases"]+'</td><td>'+district["Discharged"]+'</td><td>'+district["Deaths"]+'</td><td>'+district["Active"]+'</td></tr>';
				});
				districtHTML = districtHTML + '</tbody></table>';

				return districtHTML;
			}

      // INITIALIZE FUNCTION
      function init(){

        // CREATE ALL THE DOM ELEMENTS FIRST
        createElements();

        // RENDER THE MAP IN THE CORRECT DOM
        drawMap();
      }

      init();

    });
  };
}(jQuery));

jQuery(document).ready(function(){

	Tabletop.init( { key: "1FfW1o_vkbGoFClRJWSAp7ih27878BdWEAlbTgoyzlkY", callback: getdata, simpleSheet: false } );

	function getdata(d, tabletop) {
		var data, metadata = [];
		data = tabletop.sheets("districtwise").elements;
		metadata = tabletop.sheets("readme").elements;

		jQuery( '[data-behaviour~=choropleth-map]' ).choropleth_map(data, metadata);
	}

});
