const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const app = express();
const authentication = require("./routes/authentication");
const posts = require("./routes/posts");
const chat = require("./routes/chat")
const profile = require("./routes/profile")

const database = require("./databaseConnection");
const dbModel = require("./databaseAccessLayer")
const bcrypt = require("bcrypt")
const cors = require("cors")

app.use(
  cors({
    origin: "*",
    credentials: true
    
  })
)
app.set('view engine', 'ejs');
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cookieSession({
  name: 'whoami',
  httpOnly: "true",
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000 //24hrs
}))
// app.use(cors()) 

app.use("/authentication", authentication);
app.use("/posts", posts);
app.use("/chat", chat);
app.use("/profile", profile)


app.get("/", async (req, res) => {
  const email = req.session.whoami
  const user = await dbModel.getUser(email);
  console.log(user)
  res.render("signup", { user });
})

app.post("/", async (req, res) => {
  const first_name = req.body.first_name
  const last_name = req.body.last_name
  const email = req.body.email
  const password = req.body.password
  const hash = await bcrypt.hash(password, 10)
  const users = await dbModel.getUsers()
  adduser = await dbModel.addUser(first_name, last_name, email, hash)
  res.redirect("/authentication/login");
})

app.get("/home", async (req, res) => {
  const email = req.session.whoami
  const user = await dbModel.getUser(email);
  res.render("index", { user });
})

app.get("/location", async (req, res) => {
  const email = req.session.whoami
  const user = await dbModel.getUser(email);
  res.render("location", { user });
})

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err);
  res.status(500).send({ error: "something bad happened" });
});

module.exports = app;
