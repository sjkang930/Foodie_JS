function selectNewImage(event) {
    event.target.closest("label").querySelector("input").click();
}
function loadFile(event) {
    console.log("this", event.target)
    let image = event.target.closest("label").querySelector("img");
    console.log(image)
    image.src = URL.createObjectURL(event.target.files[0]);
    let des_photo = event.target.closest(".card").querySelector(".des_photo");
    console.log(des_photo)
    des_photo.src = image.src;
    let com_photos = event.target.closest(".card").querySelectorAll(".com_photo");
    console.log(com_photos);
    com_photos.forEach(com_photo => {
        com_photo.src = image.src;
    });
};
let followbtn = document.querySelector("input.new.follow")
const profileUserId = document.querySelector("#profileUserId").className
if (followbtn) {
    followbtn.addEventListener('click', makeFollow)
    function makeFollow(event) {
        const follower = document.querySelector("span.user-info.follower")
        const following = document.querySelector("span.user-info.following")

        const header = {
            Accept: "application/json",
            "Content-Type": "application/json",
        }
        let body = JSON.stringify({
            profileUserId
        });
        const request = {
            method: "POST",
            headers: header,
            body: body,
        }
        if (followbtn.classList.contains("following")) {
            fetch(`/profile/${profileUserId}/unfollow`, request)
                .then(resp => resp.json())
                .then((data) => {
                    follower.innerHTML = `${data.followed}follower`
                    following.innerHTML = `${data.follower}following`
                    event.target.classList.remove("following")
                    event.target.value = "follow"
                })
                .catch(err => console.log(err))
        } else {
            fetch(`/profile/${profileUserId}/follow`, request)
                .then(resp => resp.json())
                .then((data) => {
                    follower.innerHTML = `${data.followed}follower`
                    following.innerHTML = `${data.follower}following`
                    event.target.classList.add("following")
                    event.target.value = "following"
                })
                .catch(err => console.log(err))
        }
    }
}

