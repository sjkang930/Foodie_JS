const express = require("express");
const router = express.Router();
const database = require("../databaseConnection")
const dbModel = require("../databaseAccessLayer")
const multer = require("multer")
const s3 = require("../s3")
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })
router.use((req, res, next) => {
    res.header({ "Access-Control-Allow-Origin": "*" });
    next();
})

router.get("/:user_id", async (req, res) => {
    const user = await dbModel.getUser(req.session.whoami)
    const users = await dbModel.getUsers()
    let posts = await dbModel.getPosts()
    const user_id = +req.params.user_id
    let profileUser
    let userPosts
    let thisUser
    let totalFollower
    let isFollowing
    let getFollowerByUserId = await dbModel.getfollowerByUserId(user_id)
    let getfollowingByUserId = await dbModel.getfollowingByUserId(user_id)
    if (user) {
        thisUser = await dbModel.getPostByUserId(user_id)
        userPosts = await dbModel.getUserPosts(user.user_id)
        totalFollower = await dbModel.getTotalFollower(user_id)
        profileUser = users.filter(user => user.user_id === user_id)
        let follower = await dbModel.getfollower(user.user_id, user_id)
        isFollowing = follower.map(already => already.follower).includes(user.user_id)
        let getfollower = await dbModel.getFollower(user_id)
        console.log("follower", getfollower)
    }
    const commentId = await dbModel.getComments()
    if (!user) {
        res.redirect("/authentication/403");
    }
    res.render("profile", { user, user_id, users, posts, userPosts, commentId, thisUser, profileUser, totalFollower, isFollowing });
})

router.post("/:user_id/follow", async (req, res) => {
    const user = await dbModel.getUser(req.session.whoami)
    const user_id = +req.params.user_id
    if (user) {
        let follower = await dbModel.getfollower(user.user_id, user_id)
        if (user.user_id === user_id) {
            return
        }
        if (follower.map(already => already.follower).includes(user.user_id)) {
            return
        }
        await dbModel.addfollower(user.user_id, user_id)
        let [totalFollower] = await dbModel.getTotalFollower(user_id)
        res.json({
            follower: totalFollower.total_follower,
            followed: totalFollower.total_followed,
        })
    }
})

router.post("/:user_id/unfollow", async (req, res) => {
    const user = await dbModel.getUser(req.session.whoami)
    const user_id = +req.params.user_id
    if (user) {
        let follower = await dbModel.getfollower(user.user_id, user_id)
        let isFollowing = follower.map(already => already.follower).includes(user.user_id)
        await dbModel.deleteFollow(user.user_id, user_id)
        let [totalFollower] = await dbModel.getTotalFollower(user_id)

        res.json({
            follower: totalFollower.total_follower,
            followed: totalFollower.total_followed
        })
    }
})

router.get("/edit/:user_id", async (req, res) => {
    const user = await dbModel.getUser(req.session.whoami)
    const users = await dbModel.getUsers()
    let posts = await dbModel.getPosts()
    const user_id = +req.params.user_id
    let profileUser
    let userPosts
    let thisUser
    let totalFollower
    let isFollowing
    if (user) {
        thisUser = await dbModel.getPostByUserId(user_id)
        userPosts = await dbModel.getUserPosts(user.user_id)
        totalFollower = await dbModel.getTotalFollower(user_id)
        profileUser = users.filter(user => user.user_id === user_id)
        let follower = await dbModel.getfollower(user.user_id, user_id)
        isFollowing = follower.map(already => already.follower).includes(user.user_id)
    }
    const commentId = await dbModel.getComments()
    if (!user) {
        res.redirect("/authentication/403");
    }
    if (!(user.user_id === user_id)) {
        res.redirect(`/profile/${user_id}`);
    }
    res.render("editProfile", { user, user_id, users, posts, userPosts, commentId, thisUser, profileUser, totalFollower, isFollowing });
})
router.post("/edit/:user_id", upload.single("image"), async (req, res) => {
    const user = await dbModel.getUser(req.session.whoami)
    const users = await dbModel.getUsers()
    let posts = await dbModel.getPosts()
    const user_id = +req.params.user_id
    if (user) {
        thisUser = await dbModel.getPostByUserId(user_id)
        userPosts = await dbModel.getUserPosts(user.user_id)
        totalFollower = await dbModel.getTotalFollower(user_id)
        profileUser = users.filter(user => user.user_id === user_id)
        let follower = await dbModel.getfollower(user.user_id, user_id)
        isFollowing = follower.map(already => already.follower).includes(user.user_id)
    }
    const commentId = await dbModel.getComments()
    if (!user) {
        res.redirect("/authentication/403");
    }
    if (!(user.user_id === user_id)) {
        res.redirect(`/profile/${user_id}`);
    }
    const { filename, path } = req.file
    const first_name = req.body.first_name
    const bio = req.body.bio
    const email = req.body.email
    const url = await s3.uploadFile(req.file)
    console.log(req.body)
    const profile = `https://direct-upload-s3-bucket-idsp.s3.us-west-2.amazonaws.com/${url.Key}`
    await dbModel.updateUser(first_name, bio, email, profile, user_id)
    res.redirect(`/profile/${user_id}`)

});

router.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    console.error(err);
    res.status(500).send({ error: "something bad happened" });
});

module.exports = router;