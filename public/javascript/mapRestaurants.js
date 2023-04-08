async function handleYelpRequest(lat, lng) {
    const request = {
        method: "POST",
    }
    const data = await fetch(`/posts/yelp?latitude=${lat}&longitude=${lng}`, request)
    const dataJSON = await data.json();
    return dataJSON;
}

const restaurantsList = document.querySelector(".restaurants-list")

function addNewRestaurant(restaurant) {
    let ratingStars = document.createElement('div')
    let star = `<img class="nav-icon" src="/icons/white star fill.svg">`
    let half = `<img class="nav-icon" src="/icons/white half star.svg">`
    let empty = `<img class="nav-icon" src="/icons/white star no fill.svg">`
    let rating = restaurant.rating
    function showStar(rating) {
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
    let newRestaurant = document.createElement('div');
    newRestaurant.classList.add("RestInfoDiv")
    const id = restaurant.id
    newRestaurant.innerHTML = `
    <a href="/posts/${id}" <p class="resName"> ${restaurant.name}</p></a>
    <p class="rating"> ${restaurant.rating} &nbsp${showStar(restaurant.rating)}&nbsp(${restaurant.review_count})</p>
    <img class="img-img"src=${restaurant.image_url}>
    `;
    restaurantsList.appendChild(newRestaurant);
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