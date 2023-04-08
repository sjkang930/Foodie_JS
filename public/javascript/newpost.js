document.querySelector("img.plus-icon").addEventListener("click", event => {
    // event.preventDefault()
    console.log('working')
    const term = document.querySelector("#restaurantNameFormInput").value
    console.log("submit the form", term)
    const result = document.querySelector("input.result")
    const result2 = document.querySelector("input.result2")
    const result3 = document.querySelector("input.result3")
    const result4 = document.querySelector("input.result4")
    const result5 = document.querySelector("input.result5")
    const result6 = document.querySelector("input.result6")
    const result7 = document.querySelector("input.result7")
    const result8 = document.querySelector("input.result8")
    const result9 = document.querySelector("input.result9")
    const result10 = document.querySelector("input.result10")
    const result11 = document.querySelector("input.result11")
    const place = document.querySelector("div.place")
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
            console.log(data)
            place.innerHTML = `@${term}`
            result.value = data.name
            result2.value = data.latitude
            result3.value = data.longitude
            result4.value = data.fullAddress
            result5.value = data.display_phone
            result6.value = data.url
            result7.value = data.rating
            result8.value = data.review_count
            result9.value = data.id
            result10.value = data.address2
            result11.value = data.categories
            console.log(data.name)
            console.log(data.latitude)
            console.log(data.longitude)
            console.log(data.display_phone)
        })
        .catch(err => console.log(err))
})

document.querySelector(".preview").addEventListener("click", (event) => {
    document.querySelector("#id_photo").click();
})