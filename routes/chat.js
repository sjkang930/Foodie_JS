const express = require("express");
const router = express.Router();
const dbModel = require("../databaseAccessLayer");
const database = require("../databaseConnection");

router.get("/", async (req, res) => {
    const user = await dbModel.getUser(req.session.whoami)
    const users = await dbModel.getUsers()
    if (!user) {
        return res.redirect("/authentication/403");
    }
    res.render("chat", { user, users });
})

module.exports = router;
