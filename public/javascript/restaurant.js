async function initMap() {
    const options = {
        zoom: 13,
        center: { lat: 49.282359695758885, lng: -123.1168886758965 },
        mapId: 'd2716697ffbc4fa6'
    }
    const map = new
        google.maps.Map(document.getElementById('map'), options);

    const findRestaurantNearMeButton = document.getElementsByClassName("custom-map-control-button")[0]
    // const findRestaurantNearMeButton = document.createElement("button");
    // findRestaurantNearMeButton.textContent = 'Find me';
    // findRestaurantNearMeButton.classList.add("custom-map-control-button");
    // map.controls[google.maps.ControlPosition.TOP_CENTER].push(findRestaurantNearMeButton)

    // add marker when u want to
    google.maps.event.addListener(map, 'click', (event) => {
        addMarker({ coords: event.latLng });
    })

    const searchInput = document.createElement('input');
    const searchBox = new google.maps.places.SearchBox(searchInput);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(searchInput);
    searchInput.placeholder = "Enter a place";
    const latitude = document.querySelector("div.resultOfPlace1").innerHTML
    const longitude = document.querySelector("div.resultOfPlace2").innerHTML
    const restaurant_name = document.querySelector("div.resultOfPlace3").innerHTML
    const address = document.querySelector("div.resultOfPlace4").innerHTML
    const display_phone = document.querySelector("div.resultOfPlace5").innerHTML
    const restaurant_url = document.querySelector("div.resultOfPlace6").innerHTML
    await handleYelpRequest(49.282359695758885, -123.1168886758965).then(
        res => {
            const businesses = res.businesses
            for (let i = 0; i < businesses.length; i++) {
                const restaurant = businesses[i]
                const marker = {
                    coords: { lat: Number(latitude), lng: Number(longitude) },
                    map: map,
                    animation: google.maps.Animation.DROP,
                    content: `<h1 class="restaurantName">${restaurant_name}</h1>
                    <p class="info">${address}</p>
                    <b><p class="phone">${display_phone}</p></b>
                    <b><div class="hours">hours</div></b> 
                    <div>Sunday, 11:00am~ 10:00pm</div>
                    <div>Monday, 11:00am~ 10:00pm</div>
                    <div>Tuesday, 11:00am~ 10:00pm</div>
                    <div>Wednesday, 11:00am~ 10:00pm</div>
                    <div>Thursday, 11:00am~ 10:00pm</div>
                    <div>Friday, 11:00am~ 10:00pm</div>
                    <div>Saturday, 11:00am~ 10:00pm</div>
                    <img src="${restaurant_url}"`,
                    iconImage: {
                        url: "/icons/logo_burger.svg",
                        scaledSize: new google.maps.Size(43, 36)
                    }
                }
                addMarker(marker);
            }
        }
    )


    //add marker 


    function addMarker(props) {
        const marker = new google.maps.Marker({
            position: props.coords,
            map: props.map,
            animation: props.animation,
            content: props.content,
            // icon: props.iconImage,
            scaledSize: props.scaledSize
        })
        //check
        if (props.iconImage) {
            //set icon 
            marker.setIcon(props.iconImage)
        }

        if (props.content) {
            const infoWindow = new google.maps.InfoWindow({
                content: props.content
            })
            marker.addListener("click", () => {
                infoWindow.open(map, marker)
            });
        } else {
            // infoWindow.remove(map, marker)
        }
    }

    findRestaurantNearMeButton.addEventListener("click", () => {
        // infoWindow2 = new google.maps.InfoWindow({
        //     content: props.content
        // });
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const myLocation = {
                        coords: { lat: position.coords.latitude, lng: position.coords.longitude },
                        map: map,
                        animation: google.maps.Animation.DROP,
                        content: ``,
                        iconImage: {
                            url: "/icons/logo_burger.svg",
                            scaledSize: new google.maps.Size(43, 36)
                        }
                    }
                    addMarker(myLocation);
                    map.setCenter({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                }
            );
        } else {
            // Browser doesn't support Geolocation
            // handleLocationError(false, infoWindow, map.getCenter());
        }
    });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}

async function handleSubmit() {
    codeAddress()
}

async function calcDistance(start, end) {
    const s = JSON.stringify(start);
    const e = JSON.stringify(end)
    const startObj = JSON.parse(s)
    const endObj = JSON.parse(e)
    // calculate distance
    let myLocation = new google.maps.LatLng(startObj.lat, startObj.lng);
    // each marker is a destination
    let destination = new google.maps.LatLng(endObj.lat, endObj.lng);
    let service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
        {
            origins: [myLocation],
            destinations: [destination],
            travelMode: 'DRIVING',
        }, callback)

    function callback(response, status) {
        // See Parsing the Results for
        // the basics of a callback function.
        console.log("Callback Res " + JSON.stringify(response))
        let origins = response.originAddresses;
        let destinations = response.destinationAddresses;
        // do something with the response
        const [something] = response.rows
        const element = response.rows[0].elements[0]

        let distance = element.distance.text;
        let duration = element.duration.text;

        document.getElementById("distance_output").textContent = distance
        document.getElementById("time_output").textContent = duration
    }
}

function codeAddress() {
    let geocoder = new google.maps.Geocoder();
    let start = document.getElementById('startLocation').value;
    let end = document.getElementById('destination').value;

    getAddress(geocoder, start, function (startResult) {
        console.log("startResult " + JSON.stringify(startResult))
        getAddress(geocoder, end, function (endResult) {
            console.log("endResult " + JSON.stringify(endResult))
            calcDistance(startResult, endResult);
        });
    });
}

function getAddress(geocoder, loc_name, callback) {
    let startLocation;
    geocoder.geocode({ 'address': loc_name }, function (results, status) {
        if (status == 'OK') {
            startLocation = results[0].geometry.location
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
        callback(startLocation)
    });
}

function clearRoute() {
    document.getElementById("clear_btn").style.display = "none";
    document.getElementById("startLocation").value = "";
    document.getElementById("destination").value = "";
    // document.getElementById("list-group").value = "";
    directionsDisplay.setDirections({ routes: [] });
}

async function handleYelpRequest(lat, lng) {
    const request = {
        method: "POST",
    }
    const data = await fetch(`/posts/yelp?latitude=${lat}&longitude=${lng}`, request)
    const dataJSON = await data.json();
    console.log(dataJSON)
    return dataJSON;
}

