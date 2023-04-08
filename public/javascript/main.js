let horizontalUnderline = document.getElementsByClassName("horizontal-underline")[0]
let horizontalMenus = document.querySelectorAll("nav a");

horizontalMenus.forEach(menu => menu.addEventListener("mouseover", (e) => horizontalIndicator(e)));

function horizontalIndicator(e) {
  console.log("it's working!")
  horizontalUnderline.style.left = e.target.offsetLeft + "px";
  horizontalUnderline.style.width = e.target.offsetWidth + "px";
  horizontalUnderline.style.top =
    e.target.offsetTop + e.target.offsetHeight + "px";
}

const commentTotal = document.querySelectorAll("li.total")
commentTotal.forEach(comment => {
  comment.addEventListener(('click'), makeTotalComment)
  function makeTotalComment(event) {
    event.path[5].childNodes[9].childNodes[3].childNodes[3].classList.toggle("commentDiv")
  }
})

const hearts = document.querySelectorAll(".favorite")
hearts.forEach(heart => {
  heart.addEventListener("click", makeCount)
  function makeCount(event) {
    event.target.classList.toggle("liked")
    let post_id = event.target.parentNode.parentNode.childNodes[1].value
    let currentLike = event.target.parentNode.parentNode.childNodes[1].id
    let totalLike = event.target.parentNode.parentNode.childNodes[5].innerHTML
    let span = event.target.parentNode.parentNode.childNodes[5]
    if (heart.classList.contains("liked")) {
      event.target.src = "/icons/like.svg"
      span.innerHTML = parseInt(totalLike) + 1
      const header = {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
      let body = JSON.stringify({
        post_id
      });
      const request = {
        method: "POST",
        headers: header,
        body: body,
      }
      fetch(`/posts/${post_id}/like`, request)
        .then(resp => resp.json())
        .then((data) => {
          console.log(data)
        })
        .catch(err => console.log(err))
    } else {
      event.target.src = "/icons/heart.svg"
      span.innerHTML = parseInt(totalLike) - 1
      const header = {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
      let body = JSON.stringify({
        post_id
      });
      const request = {
        method: "POST",
        headers: header,
        body: body,
      }
      fetch(`/posts/${post_id}/dislike`, request)
        .then(resp => resp.json())
        .then((data) => { console.log(data) })
        .catch(err => console.log(err))
    }
  }
})

const bookmarks = document.querySelectorAll(".bookmark")
bookmarks.forEach(bookmark => {
  bookmark.addEventListener("click", makeBookmark)
  function makeBookmark(event) {
    event.path[0].classList.toggle("saved")
    if (bookmark.classList.contains("saved")) {
      event.target.src = "/icons/saved.svg"
    } else {
      event.target.src = "/icons/save.svg"
    }
  }
})

//edit mode
const moreIcons = document.querySelectorAll('#user');
moreIcons.forEach(icon => {
  icon.parentNode.children[1].classList.add('displayNone');
});
moreIcons.forEach(a => {
  a.addEventListener("click", btnToggle)
  function btnToggle(e) {
    let section = e.target.parentNode
    let buttons = section.children[1]
    buttons.classList.toggle('displayNone')
  }
});

const allCancels = document.querySelectorAll('#cancelBtn');
allCancels.forEach(cancel => {
  cancel.addEventListener("click", cancelBtn)
  function cancelBtn(e) {
    let clickAll = e.target.parentNode
    clickAll.classList.toggle('displayNone');
  }
})

function handleDeletePost(e) {
  fetch(`/posts/deletePost?id=${e.target.id}`,
    {
      method: "POST"
    }
  ).then((res) => {
    if (res.status === 403) {
      location.href = "/authentication/403";
      return;
    }
    location.reload();
  })
}
const commentName = document.querySelector('.name-profile').id
const fullCommnetName = document.querySelector('.nick_name').id
const commentsForms = document.querySelectorAll("form.comment_form")
let numberCommnet
commentsForms.forEach(commentForm => {
  commentForm.addEventListener("submit", makeComment)
  function makeComment(event) {
    event.preventDefault()
    const totalCommentCount = event.target.parentElement.querySelector('li.total')
    const comments = event.target.childNodes[3].childNodes[1].childNodes[1].value
    event.target.childNodes[3].childNodes[1].childNodes[1].value = ''
    const post_id = event.target.childNodes[3].childNodes[1].childNodes[3].childNodes[3].value
    const commentsDiv = event.target.childNodes[3].childNodes[3]
    // const imagePhoto = event.target.childNodes[3].childNodes[3].childNodes[3].childNodes[1].childNodes[1].childNodes[1]
    // const name = event.target.childNodes[3].childNodes[3].childNodes[1].childNodes[1].childNodes[3]
    const li = event.target.parentNode.childNodes[7].childNodes[1].childNodes[1].childNodes[3].childNodes[3]
    let totalComment = event.target.parentNode.childNodes[7].id

    li.innerHTML = `  see all ${totalComment} comments`
    const div = document.createElement('div')
    commentsDiv.appendChild(div);
    const subDiv = document.createElement('div')
    subDiv.classList.add('d-flex')
    subDiv.classList.add('ps-4')
    div.appendChild(subDiv)

    const photoDiv = document.createElement('div')
    photoDiv.classList.add('profile-img')
    subDiv.appendChild(photoDiv)
    const img = document.createElement('img')
    img.classList.add('user')
    img.classList.add('com_photo')
    img.src = "/icons/small smantha.svg"
    photoDiv.appendChild(img)

    let nameDiv = document.createElement('div')
    nameDiv.classList.add('commentName')
    subDiv.appendChild(nameDiv)
    let aTag = document.createElement('a')
    aTag.classList.add('name-profile')
    aTag.href = `/posts/${commentName}`
    aTag.innerHTML = `${fullCommnetName}`
    nameDiv.appendChild(aTag)

    let commentDiv = document.createElement('div')
    commentDiv.classList.add('commentId')
    event.target.childNodes[3].childNodes[3].classList.remove("commentDiv")
    subDiv.appendChild(commentDiv)
    commentDiv.innerHTML = comments
    const header = {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
    const body = JSON.stringify({
      comments,
      post_id
    });
    const request = {
      method: "POST",
      headers: header,
      body: body,
    }
    fetch(`/posts/${post_id}/comment`, request)
      .then(resp =>
        resp.json()
      )
      .then(data => {
        totalCommentCount.innerHTML = `see all ${data.count} comments`
      })
      .catch(err => console.log(err))
  }
})


