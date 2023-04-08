const database = require('./databaseConnection');

async function getUsers() {
    const [users] = await database.query("SELECT * FROM foodie_user");
    return users;
}

async function getUser(email) {
    let query = "SELECT * FROM foodie_user WHERE email = :email";
    let params = { email: email }
    const [user] = await database.query(query, params)
    return user[0]
}

async function getUserbyUserId(user_id) {
    let query = "SELECT * FROM foodie_user WHERE user_id = :user_id";
    let params = { user_id: user_id }
    const [user] = await database.query(query, params)
    return user[0]
}

async function getPosts() {
    let query = `
    select post_id, user_id, image_url, description, restaurant_name, latitude, longitude, address, display_phone, restaurant_url, rating, review_count, id, address2, categories, date_format(timestamp, '%M %e, %Y')as timestamp, 
    total_likes, total_comments from posts
    order by post_id desc;
    `
    const [posts] = await database.query(query);
    return posts;
}
async function getFollower(user_id) {
    let query = `
    select foodie_user.*
    from foodie_user
    left join relationship on relationship.user_id = foodie_user.user_id
    left join posts on relationship.user_id = :user_id
    where foodie_user.user_id = :user_id;
    `
    let params = { user_id: user_id }
    const [posts] = await database.query(query, params);
    return posts;
}

async function getUserPosts(user_id) {
    let query = `
    select posts.post_id, posts.user_id, posts.image_url, posts.description, date_format(posts.timestamp, '%M %e, %Y')as timestamp, 
    posts.total_likes, posts.total_comments,  if (post_likes.like_id is not null, 1, 0) as liked_by_current_user
    from posts
    left join post_likes on post_likes.post_id = posts.post_id 
    AND post_likes.user_id = :user_id;
    `
    let params = { user_id: user_id }
    const [posts] = await database.query(query, params);
    return posts;
}

async function getComments() {
    let query = `
    select * from comments;
    `
    const [comments] = await database.query(query);
    return comments;
}
async function getCommentsByPost(post_id) {
    let query = `
    select * from comments where post_id = :post_id
    `
    let params = { post_id: post_id }
    const [comments] = await database.query(query, params);
    return comments;
}
async function getPostByPostId(post_id) {
    let query = `
    select * from posts where post_id = :post_id
    `
    let params = { post_id: post_id }
    const [post] = await database.query(query, params);
    return post;
}
async function getTotalFollower(user_id) {
    let query = `
    SELECT user_id, (SELECT COUNT(*) FROM relationship WHERE follower = :user_id) 
    AS 'total_follower', (SELECT COUNT(*) FROM relationship WHERE followed = :user_id) 
    AS 'total_followed', first_name, last_name, bio, email, timestamp FROM foodie_user WHERE user_id = :user_id;
    `
    let params = { user_id: user_id }
    const [post] = await database.query(query, params)
    return post
}

async function getPostByUserId(user_id) {
    let query = `
    select posts.*, foodie_user.first_name, foodie_user.last_name from posts
    left join foodie_user on foodie_user.user_id = posts.user_id 
    WHERE foodie_user.user_id = :user_id;
    `
    let params = { user_id: user_id }
    const [post] = await database.query(query, params);
    return post;
}

async function addPost(user_id, description, image_url) {
    let query = "INSERT INTO posts (user_id, description, image_url) VALUES(?, ?, ?)"
    const params = [user_id, description, image_url]
    const [result] = await database.query(query, params)
    return result
}
async function addPostWithRestaurant(user_id, description, image_url, restaurant_name, latitude, longitude, address, display_phone, restaurant_url, rating, review_count, id, address2, categories) {
    let query = "INSERT INTO posts (user_id, description, image_url, restaurant_name, latitude, longitude, address, display_phone, restaurant_url, rating, review_count, id, address2, categories) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    const params = [user_id, description, image_url, restaurant_name, latitude, longitude, address, display_phone, restaurant_url, rating, review_count, id, address2, categories]
    const [result] = await database.query(query, params)
    return result
}
async function getPostsWithRestaurant() {
    let query = `
    select post_id, user_id, image_url, description, restaurant_name, latitude, longitude ,date_format(timestamp, '%M %e, %Y')as timestamp, 
    total_likes, total_comments from posts
    order by post_id desc;
    `
    const [posts] = await database.query(query);
    return posts;
}
async function getPostsWithRestaurantByPostId(post_id) {
    let query = `
    select post_id, user_id, image_url, description, restaurant_name, latitude, longitude, address, display_phone, restaurant_url, rating, review_count, id, address2, categories, date_format(timestamp, '%M %e, %Y')as timestamp, 
    total_likes, total_comments from posts where post_id = :post_id
    order by post_id desc;
    `
    let params = { post_id: post_id }
    const [posts] = await database.query(query, params);
    return posts;
}
async function deletePost(post_id) {
    let query = "DELETE FROM posts WHERE post_id = :post_id";
    let params = { post_id: post_id }
    const [user] = await database.query(query, params)
    return user[0]
}
async function deleteFollow(currentUser, followingUser) {
    let query = "DELETE FROM relationship WHERE user_id = :currentUser AND followed = :followingUser";
    let params = { currentUser, followingUser }
    const [user] = await database.query(query, params)
    return user
}
async function addUser(firtst_name, last_name, email, password) {
    const query = "INSERT INTO foodie_user (first_name, last_name, email, password) VALUES(?, ?, ?, ?)"
    const params = [firtst_name, last_name, email, password]
    const [result] = await database.query(query, params)
    return result

}

async function updatePost(description, image_url, post_id) {
    let query = "UPDATE posts SET description = :description, image_url = :image_url WHERE post_id = :post_id";
    let params = { description: description, image_url: image_url, post_id: post_id }
    const [result] = await database.query(query, params)
    return result
}

async function updateUser(first_name, bio, email, profile, user_id) {
    let query = "UPDATE foodie_user SET first_name = :first_name, bio = :bio, email = :email, profile = :profile WHERE user_id = :user_id";
    let params = { first_name: first_name, bio: bio, email: email, profile: profile, user_id: user_id }
    const [result] = await database.query(query, params)
    return result
}

async function addcomment(user_id, post_id, comments) {
    const query = "INSERT INTO comments (user_id, post_id, comments) VALUES(?, ?, ?)"
    const params = [user_id, post_id, comments]
    const [result] = await database.query(query, params)
    return result
}

async function getCommentsLikes(comment_id) {
    const query =
        "SELECT comment_id, user_id, post_id, comments, (SELECT COUNT(*) FROM likes WHERE comment_id = :comment_id) AS `totalcomments` FROM comments WHERE comment_id = :comment_id"
    const params = { comment_id: comment_id }
    const [rows] = await database.query(query, params)
    const comments = rows[0]
    return comments
}
async function getCommentsFromComment(comment_id) {
    const query =
        "SELECT comment_id, user_id, post_id, comments, (SELECT COUNT(*) FROM comments WHERE comment_id = :comment_id) AS `totalcomments` FROM comments WHERE comment_id = :comment_id"
    const params = { comment_id: comment_id }
    const [rows] = await database.query(query, params)
    const comments = rows
    return comments
}

async function getCommentByUser(user_id) {
    const query =
        "SELECT comment_id, user_id, post_id, comments, (SELECT COUNT(*) FROM comments WHERE user_id = :user_id) AS `totalcomments` FROM comments WHERE user_id = :user_id";
    const params = { user_id: user_id }
    const [rows] = await database.query(query, params)
    const comments = rows
    return comments
}

async function getpostLikesByuser(user_id, post_id) {
    const query =
        "select * from post_likes where user_id = :user_id and post_id = :post_id"
    const params = { user_id: user_id, post_id: post_id }
    const [results] = await database.query(query, params)
    return results
}
async function addPostLikes(user_id, post_id) {
    let [results] = await database.query("select * from post_likes where user_id = :user_id and post_id = :post_id", { user_id: user_id, post_id: post_id })
    if (results) {
        let like_ids = results.map(result => result.like_id)
        for (const like_id of like_ids) {
            await database.query("DELETE FROM post_likes WHERE like_id = :like_id", { like_id: like_id })
        }
    }
    let [result] = await database.query("INSERT INTO post_likes (user_id, post_id) VALUES(?, ?)", [user_id, post_id])
    return result
}
async function getfollower(currentUser, followingUser) {
    const query =
        `select * from relationship WHERE follower = :currentUser and followed = :followingUser;`
    const params = { currentUser, followingUser }
    const [results] = await database.query(query, params)
    return results
}
async function getfollowerByUserId(user_id) {
    const query =
        `select * from relationship where followed = :user_id;`
    const params = { user_id }
    const [results] = await database.query(query, params)
    return results
}
async function getfollowingByUserId(user_id) {
    const query =
        `select * from relationship where follower = :user_id;`
    const params = { user_id }
    const [results] = await database.query(query, params)
    return results
}

async function addfollower(currentUser, followingUser) {
    let [result] = await database.query("INSERT INTO relationship (user_id, follower, followed) VALUES(:currentUser, :currentUser, :followingUser)", { currentUser, followingUser })
    return result
}

async function deletePostLikes(like_id) {
    let query = "DELETE FROM post_likes WHERE like_id = :like_id";
    let params = { like_id: like_id }
    await database.query(query, params)
    return like_id
}

async function addCommentsLikes(user_id, post_id, comment_id) {
    const query = "INSERT INTO comment_likes (user_id, post_id, comment_id) VALUES(?, ?, ?)"
    const params = [user_id, post_id, comment_id]
    const [result] = await database.query(query, params)
    return result
}

async function getpostComments() {
    const query =
        "select posts.*, json_arrayagg(comments.comments) as comments from posts left join comments on comments.post_id = posts.post_id group by posts.post_id order by comments.post_id asc;"
    const [rows] = await database.query(query)
    const likes = rows
    return likes
}
async function getCommentLikesUsers(user_id) {
    const query =
        "SELECT user_id, comment_id, (SELECT COUNT(*) FROM comment_likes WHERE user_id = :user_id) AS `totallikes` FROM comment_likes WHERE user_id = :user_id";
    const params = { user_id: user_id }
    const [rows] = await database.query(query, params)
    const likes = rows
    return likes
}
async function getLikes() {
    const [likes] = await database.query("");
    return likes;
}



async function getLikesComments(comment_id) {
    const query =
        "SELECT user_id, comment_id, (SELECT COUNT(*) FROM comment_likes WHERE comment_id = :comment_id) AS `totallikes` FROM comment_likes WHERE comment_id = :comment_id";
    const params = { comment_id: comment_id }
    const [rows] = await database.query(query, params)
    const likes = rows[0]
    return likes
}

async function addRestaurant(user_id) {
    const query = "INSERT INTO restaurant(user_id, name) VALUES (?, ?)"
    const params = [user_id]
    const [result] = await database.query(query, params)
    return result
}

async function getRestaurant(user_id) {
    const query = "SELECT * FROM restaurant WHERE user_id = :user_id";
    const params = { user_id: user_id }
    const [rows] = await database.query(query, params)
    const likes = rows[0]
    return likes
}

async function getRestaurantsName() {
    const [restaurant] = await database.query("SELECT name FROM restaurant");
    return restaurant;
}

async function deleteRestaurant(restaurant_id) {
    let query = "DELETE FROM restaurant WHERE restaurant_id = :restaurant_id";
    let params = { restaurant_id: restaurant_id }
    const [user] = await database.query(query, params)
    return user[0]
}

module.exports = {
    getUsers, getUser, getfollowingByUserId, getFollower, getfollowerByUserId, getpostLikesByuser, getLikes, getPostByUserId, addUser, deletePost, deleteFollow, deleteRestaurant, deletePostLikes,
    addPost, getUserPosts, getPosts, addcomment, getCommentByUser, addPostLikes, addCommentsLikes, getpostComments, getfollower, addPostWithRestaurant,
    addfollower, getLikesComments, addRestaurant, getRestaurant, getCommentsFromComment, getCommentsLikes, getRestaurantsName, getPostsWithRestaurant, getPostsWithRestaurantByPostId,
    getLikesComments, getCommentLikesUsers, getUserbyUserId, getComments, getCommentsByPost, updatePost, getPostByPostId, getTotalFollower, updateUser
}
