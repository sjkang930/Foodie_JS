async function handleYelpRequest(lat, lng) {
    const request = {
        method: "POST",
    }
    const data = await fetch(`/posts/yelp?latitude=${lat}&longitude=${lng}`, request)
    const dataJSON = await data.json();
    return dataJSON;
}

const id = document.querySelector("div.forIdDiv").innerHTML
const restaurantsList = document.querySelector(".RestInfoDiv")

function addNewRestaurant(restaurant) {
    let ratingStars = document.createElement('div')
    let star = `<img class="nav-icon" src="/icons/star fill.svg">`
    let half = `<img class="nav-icon" src="/icons/half star.svg">`
    let empty = `<img class="nav-icon" src="/icons/star no fill.svg">`
    let rating = restaurant.rating
    function showStar(rating) {
        if (id == restaurant.id) {
            if (rating == 0) {
                return ratingStars.innerHTML = empty + empty + empty + empty + empty
            } else if (rating == 1) {
                return ratingStars.innerHTML = star + empty + empty + empty + empty
            } else if (rating == 1.5) {
                return ratingStars.innerHTML = star + half + empty + empty + empty
            } else if (rating == 2) {
                return ratingStars.innerHTML = star + star + empty + empty + empty
            } else if (rating == 2.5) {
                return ratingStars.innerHTML = star + star + half + empty + empty
            } else if (rating == 3) {
                return ratingStars.innerHTML = star + star + star + empty + empty
            } else if (rating == 3.5) {
                return ratingStars.innerHTML = star + star + star + half + empty
            } else if (rating == 4) {
                return ratingStars.innerHTML = star + star + star + star + empty
            } else if (rating == 4.5) {
                return ratingStars.innerHTML = star + star + star + star + half
            } else if (rating == 5) {
                return ratingStars.innerHTML = star + star + star + star + star
            }
        }
    }
    if (id == restaurant.id) {
        let newRestaurant = document.createElement('div');
        newRestaurant.classList.add("RestInfoDiv")
        newRestaurant.innerHTML = `
    <p class="first-h4"> ${restaurant.name}</p>
    <img class="userPost"src=${restaurant.image_url}>
    <p class="nav-icon"> ${restaurant.rating} &nbsp${showStar(restaurant.rating)}&nbsp(${restaurant.review_count})</p>
    <p class="phoneNumber">Category:&nbsp&nbsp&nbsp${restaurant.categories[0].alias}</p>
    <p class="info">Address:&nbsp&nbsp&nbsp${restaurant.location.display_address[0]}&nbsp&nbsp${restaurant.location.display_address[1]}</p>
    <p class="phoneNumber">Phone:&nbsp&nbsp&nbsp${restaurant.display_phone}</p>
    `;
        restaurantsList.appendChild(newRestaurant);
    }
}

// handleYelpRequest(49.282359695758885, -123.1168886758965).then(
//     res => {
//         const businesses = res.businesses
//         for (let i = 0; i < businesses.length; i++) {
//             const restaurant = businesses[i];
//             addNewRestaurant(restaurant);
//         }
//     }
// )

handleYelpRequest(49.246445, -122.994560).then(
    res => {
        const businesses = res.businesses
        for (let i = 0; i < businesses.length; i++) {
            const restaurant = businesses[i];
            addNewRestaurant(restaurant);
        }
    }
)

handleYelpRequest(49.166592, -123.133568).then(
    res => {
        const businesses = res.businesses
        for (let i = 0; i < businesses.length; i++) {
            const restaurant = businesses[i];
            addNewRestaurant(restaurant);
        }
    }
)