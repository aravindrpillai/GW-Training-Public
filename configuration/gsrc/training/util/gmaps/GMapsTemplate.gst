<%/**
* Author : Aravind R Pillai
* Date   : 18 Feb 2023
* Google maps javascript code for Geocoding
* Parameters :
*   1. __helper   : this is used to get the template ID to make call backs to PCF.
*   2. address    : The Address object (address entity)
*   3. gmapAPIKey : The GMap API key to make the service call.(Enable Maps Javascript & GeoCoding Service in Google Cloud)
*   4. editMode   : If false - the map will be displayed as a picture and edit operation cannnot be done
*/%>

<%@ params(
    final __helper : gw.api.web.template.TemplatePanelHelper ,
    address: Address,
    gmapAPIKey : String,
    editMode : Boolean
) %>

<style>
    .search-box {
      display: flex;
      align-items: center;
      width: 560px;
      height: 35px;
      border: 1px solid #ccc;
      border-radius: 0px;
      padding: 1px;
    }

    .address-search-text-box {
      flex: 1;
      border: none;
      outline: none;
      font-size: 16px;
    }

    .address-search-button {
      width: 60px;
      height: 35px;
      border: none;
      background-color: #008CBA;
      color: #fff;
      border-radius: 0px;
      margin-left: 5px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .address-search-button:hover {
      background-color: #00688B;
    }

    .cord-div {
      display: flex;
      align-items: center;
      width: 250px;
      height: 35px;
      padding: 1px;
    }


    .cord-button {
      width: 85px;
      height: 35px;
      border: none;
      color: #fff;
      border-radius: 0px;
      margin-left: 5px;
      margin-left: 5px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    #cord-update-button:hover {
      background-color: #27ae60;
    }

    #cord-reset-button:hover {
      background-color: #27ae60;
    }

    .maps-title-container {
      display: flex;
      width: 600px;
    }
</style>

<%if(editMode){%>
    <div class="maps-title-container">
        <div class="search-box">
          <input class="address-search-text-box" type="text" id="manualAddressFieldID"  placeholder="Enter a place" />
          <button class="address-search-button" type="submit" onClick="searchAddress(event)">Search</button>
        </div>
        <div class="cord-div">
            &nbsp;&nbsp;
            <button id="cord-update-button" style="background-color: #2ECC71" class="cord-button" onClick="handleSave(event)">Update</button>
            &nbsp;&nbsp;
            <button id="cord-reset-button"  style="background-color: #FFA07A"  class="cord-button" onClick="handleReset(event)">Reset</button>
        </div>
    </div>
<%}%>
<div id="mapDivID" style="height: 400px; width: 600px; border:0px solid">Google Maps Loading...</div>

<% //JavaScripting Starts from Here */%>
<script>
    var googleMapsApiURL = 'https://maps.googleapis.com/maps/api/js?key=<%=gmapAPIKey%>&callback=initMap&v=weekly&libraries=places';

    var defaultMapZoomLevel = 18;
    var mapElement = document.getElementById("mapDivID");

    //Below 2 Variables will keep the updated coordinates when the user click on a different point on the map.
    var updatedLatitude = null;
    var updatedLongitude = null;

    /**
    * Function to check if the script is already loaded or not
    * Since this page gets triggered multiple times in the lifecycle of PC, this api will be loaded multiple times.
    * This needs to be avoided for performance purpose.
    */
    function isScriptLoaded(url) {
      return Array.from(document.getElementsByTagName('script')).some(script => script.src === url);
    }

	var gmaps_loaded = isScriptLoaded(googleMapsApiURL);
	console.log("Is GMaps Loaded  : ",gmaps_loaded);
	if (gmaps_loaded) {
        console.log('Scripts are already loaded...');
        initMap();
    }else{
        var script_maps = document.createElement('script');
        script_maps.src = googleMapsApiURL;
        script_maps.async = true;
        document.head.appendChild(script_maps);
        script_maps.addEventListener('load', function() {
            initMap();
        })
    }

    var input = document.getElementById('manualAddressFieldID');
    if(input) {
        console.log("Input defined");
        input.addEventListener('input', function() {
            var autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.setTypes(['geocode']);
            autocomplete.addListener('place_changed', () => {
              var place = autocomplete.getPlace();
              console.log(place);
              console.log("Formatterd Address", place["formatted_address"]);
              searchWithNewAddress(place["formatted_address"]);
              console.log("Check the Values");
            });
        });
    }else {
        console.log("No Input defined");
    }


    /**
    * Function to generate the cordinates using the address string.
    */
    function fetchCordinatesFromAddress(address, cordCallBack, errorFunc){
		const geocoder = new google.maps.Geocoder();
		var cordinates = null;
		geocoder.geocode({ address }, (results, status) => {
		  if (status === "OK") {
			cordinates = results[0].geometry.location;
			cordCallBack(cordinates.lat(), cordinates.lng());
		  }else{
			errorFunc("Failed to fetch the cordinates of the address");
		  }
		});
    }


    /**
    * Function to enable and disable the cordinate update buttons
    * Note : The button session will be available only when the page is in edit mode.
    *        Hence the editMode check needs to be node inside this function, otherwise JS error will be thrown as
    *        the element is not available.
    */
    function disableAndEnableUpdateAndResetButtons(disable){
        <%if(editMode){%>
            var updateBtn = document.getElementById("cord-update-button");
            var resetBtn  = document.getElementById("cord-reset-button");
            if(disable === true){
                updateBtn.disabled = true;
                updateBtn.style.backgroundColor = "#CCC";
                resetBtn.disabled = true;
                resetBtn.style.backgroundColor = "#CCC";
            }else{
                updateBtn.disabled = false;
                updateBtn.style.backgroundColor = "#2ECC71";
                resetBtn.disabled = false;
                resetBtn.style.backgroundColor = "#FFA07A";
            }
        <%}%>
    }

    /**
    * Function to enable Reset.
    * Wrote a seperate function to reset because this needs to be enabled in multiple cases
    * Note : The button session will be available only when the page is in edit mode.
    *        Hence the editMode check needs to be node inside this function, otherwise JS error will be thrown as
    *        the element is not available.
    */
    function enableReset(){
        <%if(editMode){%>
            var resetBtn  = document.getElementById("cord-reset-button");
            resetBtn.disabled = false;
            resetBtn.style.backgroundColor = "#FFA07A";
        <%}%>
    }

    /**
    * Any default initializations are done over here
    */
    function pageInit(){
        disableAndEnableUpdateAndResetButtons(true);
    }


    /**
    * Main function to load the map
    */
    function initMap() {
        pageInit();
        //default value - set to my hometown- anchal, kerala
        var myLatlng = { lat: <%= new java.math.BigDecimal("8.935138787340119") %>, lng: <%= new java.math.BigDecimal("76.90686097908377") %> };

        <% if(address.SpatialPoint != null and address.SpatialPoint?.Latitude != null and  address.SpatialPoint?.Longitude != null){ %>
            myLatlng = { lat: <%= address.SpatialPoint?.Latitude %>, lng: <%= address.SpatialPoint?.Longitude %> };
            renderMap(myLatlng);
        <% } else { %>
            var address = "";
            <% if(address.AddressLine1 != null and address.PostalCode != null){ %>
                address = "<%= (address.AddressLine1+", "+address.City+", "+address.PostalCode) %>";
                fetchCordinatesFromAddress(address,
                    function cordCallBack(lat, lng){
                        myLatlng = { lat: lat, lng: lng }
                        updatedLatitude = lat;
                        updatedLongitude = lng;
                        disableAndEnableUpdateAndResetButtons(false);
                        renderMap(myLatlng);
                    },
                    function errorFunc(errMessage){
                        mapElement.innerHTML = "<b>GMap Error : Could not fetch cordinates for the given address </b>";
                        enableReset();
                    }
                )
            <% } else { %>
                mapElement.innerHTML = "<b>GMap Error : Address Not Specified to fetch cordinated</b>";
                enableReset();
            <% } %>
       <% } %>
	}


    /**
    * Main function to load the map
    */
    function searchWithNewAddress(address) {
        pageInit();
        //default value - set to my hometown- anchal, kerala
        var myLatlng = { lat: <%= new java.math.BigDecimal("8.935138787340119") %>, lng: <%= new java.math.BigDecimal("76.90686097908377") %> };

        fetchCordinatesFromAddress(address,
            function cordCallBack(lat, lng){
                myLatlng = { lat: lat, lng: lng }
                updatedLatitude = lat;
                updatedLongitude = lng;
                disableAndEnableUpdateAndResetButtons(false);
                renderMap(myLatlng);
            },
            function errorFunc(errMessage){
                mapElement.innerHTML = "<b>GMap Error : Could not fetch cordinates for the given address </b>";
                enableReset();
            }
        )
	}



    /**
    * Function to render map on screen
    * Map onClick() is disabled when editMode is off.
    */
	function renderMap(myLatlng){
		//This loads the map for the cordinates specified.
		const map = new google.maps.Map(mapElement, {
			zoom: defaultMapZoomLevel,
			center: myLatlng,
			draggable: <%= editMode %>,
			mapTypeId: google.maps.MapTypeId.SATELLITE
		});

		// Create a new marker at the location
		var marker = new google.maps.Marker({position: myLatlng, map: map, title: "<%= address.DisplayName %>"})

        <%if(editMode){%>
		//listener for onClick on the map. this generates the coordinates when clicked.
		map.addListener("click", (mapsMouseEvent) => {
			var latLongObj = mapsMouseEvent.latLng.toJSON();
	        updatedLatitude = latLongObj["lat"];
            updatedLongitude = latLongObj["lng"];
            if(updatedLatitude !== <%= address.SpatialPoint?.Latitude?.toString() %>  || updatedLongitude !== <%= address.SpatialPoint?.Longitude?.toString() %>){
			    disableAndEnableUpdateAndResetButtons(false);
			    var newCords = {lat:updatedLatitude, lng:updatedLongitude}

                /*
                 * We have 2 options to show the marker. (see below)
                 * To set multiple markers, remove line--> marker.setMap(null);
                 */
                //1. This will just remove the old marker and bring the new marker by keeping the map intact
                marker.setMap(null);
                marker = new google.maps.Marker({position: newCords, map: map, title: "<%= address.DisplayName %>"});
                //2. This will change the marker to the new location and refresh the map to position the marker to center
                //renderMap(newCords);
			}else{
			    disableAndEnableUpdateAndResetButtons(true);
			}
		});
		<%}%>
    }


    /**
    * Function to save the updated cordinates.
    */
    function handleSave(event){
        event.preventDefault();
        var data = {latitude: updatedLatitude, longitude: updatedLongitude}
        try{
            gw.api.submitTemplateAction("<%= __helper.TemplatePanelId %>", data);
        }catch(err){
            console.error("Failed to update the backend: ",err);
        }
    }


    /**
    * Function to save the updated cordinates.
    */
    function handleReset(event){
        event.preventDefault();
        disableAndEnableUpdateAndResetButtons(true);
        document.getElementById("manualAddressFieldID").value = "";
        initMap();
    }

    /**
    * Function to save the updated cordinates.
    */
    function searchAddress(event){
        event.preventDefault();
        enableReset();
        var address = document.getElementById("manualAddressFieldID").value;
        searchWithNewAddress(address);
    }


    /**
    * NOTE - Kept for reference. This is not required for this specific accelerator.
    * Fuction to make server side updated (without refreshing the page)
    * How to use:
    * Place the below code inside the updateHandler of GoogleMapsPanelSet
    * Code - new accelerators.gmaps.GmapUpdateHandler(address)
    */
    function pcfUpdate(data){
        console.log("Update triggered.. This won't refresh the sreeen or any values on the screen");
        gw.api.updateTemplate("<%= __helper.TemplatePanelId %>", data , function(data) {
          console.log("Call back from server :", data )
        });
    }

</script>
