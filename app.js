//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const homeStartingContent = "Hello and welcome to my blog. This is a little blog about me and some of the things that are happening in my life.";
const aboutContent = "My name is Therese and I live in bergen Norway. I am currently taking a course in full-stack web development where I am learning about how to build web-apps. The creative proccess is fun and it is motivating to see my skill levels increase with each project. In the near future I hope to start building my own project with the React-framework. Maybe I will tell You about it in my blog? 😉";
const contactContent = "You can contact me on email: ";

const app = express();

const posts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render("home", {
    homeParagraph: homeStartingContent,
    myPosts: posts
  });

});

app.get("/contact", function(req, res) {
  res.render("contact", {
    myContactParagraph: contactContent
  });
});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutMeParagraph: aboutContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const post = {
    title: req.body.postTitle,
    content: req.body.postContent
  }

  posts.push(post);

  res.redirect("/");
})








app.listen(3000, function() {
  console.log("Server started on port 3000");
});
