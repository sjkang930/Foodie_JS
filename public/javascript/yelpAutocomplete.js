const yelpSearchInput = document.querySelector(".yelp-search-input");
yelpSearchInput.addEventListener('input', (event) => {
    if (event.target.value.length > 0) {
        populateYelpSuggestions(event.target.value);
    }
})

const yelpSuggestions = document.querySelector(".yelp-suggestions")
async function populateYelpSuggestions(input) {
    const request = {
        method: "GET",
    }
    const data = await fetch(`/posts/autocomplete?input=${input}&latitude=49.282359695758885&longitude=-123.1168886758965`, request)
    const dataJSON = await data.json();
    const businesses = dataJSON.businesses;
    yelpSuggestions.innerHTML = '';
    for (let business of businesses) {
        yelpSuggestions.innerHTML += `<div class="suggestion">${business.name}</div>`
    }
}

yelpSuggestions.addEventListener('click', (event) => {
    console.log(event.target.textContent)
    yelpSearchInput.value = event.target.textContent;
    yelpSuggestions.innerHTML = '';
})



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

let findRestaurantButton = document.querySelector(".find-restaurant-button");
if (findRestaurantButton) {
    findRestaurantButton.addEventListener("click", event => {
        // event.preventDefault()
        console.log('working')
        const term = document.querySelector("#restaurantNameFormInput").value
        console.log("submit the form", term)

        const header = {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
        const body = JSON.stringify({
            term
        });
        const request = {
            method: "POST",
            headers: header,
            body: body,
        }
        fetch(`/posts/create/restaurant`, request)
            .then(resp =>
                resp.json()
            )
            .then(data => {
                console.log('useful', data)
                let props = {
                    coords: { lat: data.coordinates.latitude, lng: data.coordinates.longitude },
                    map,
                    animation: google.maps.Animation.DROP,
                    content: `<h1 class="restaurantName">${data.name}</h1>
                    <p class="info">${data.display_address[0]}</p>
                    <b><p class="phone">${data.display_phone}</p></b>
                    <b><div class="hours">hours</div></b> 
                    <div>Sunday, 11:00am~ 10:00pm</div>
                    <div>Monday, 11:00am~ 10:00pm</div>
                    <div>Tuesday, 11:00am~ 10:00pm</div>
                    <div>Wednesday, 11:00am~ 10:00pm</div>
                    <div>Thursday, 11:00am~ 10:00pm</div>
                    <div>Friday, 11:00am~ 10:00pm</div>
                    <div>Saturday, 11:00am~ 10:00pm</div>`,
                    iconImage: {
                        url: "/icons/logo_burger.svg",
                        scaledSize: new google.maps.Size(43, 36)
                    }
                }
                addMarker(props)
            })
            .catch(err => console.log(err))
    })
}

