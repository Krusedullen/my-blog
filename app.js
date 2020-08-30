//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();



const homeStartingContent = "Hello and welcome to my blog. This is a little blog about me and some of the things that are happening in my life.";
const aboutContent = "My name is Therese and I live in bergen Norway. I am currently taking a course in full-stack web development where I am learning about how to build web-apps. The creative proccess is fun and it is motivating to see my skill levels increase with each project. In the near future I hope to start building my own project with the React-framework. Maybe I will tell You about it in my blog? 😉";
const contactContent = "You can contact me on email: ";


//connection to mongodb url with our database name at the end of the url
mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true}
);

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  url: String,
  date: Date
});

const Post = mongoose.model("Post", postSchema);

const blogPosts = [];


// Post.find(function(err, posts){
//   if (err){console.log(err);
//   }
//   else {return posts};
// });

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render("home", {
    homeParagraph: homeStartingContent,
    myPosts: blogPosts
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
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postContent,
    url: _.kebabCase(req.body.postTitle.toLowerCase()),
    date: new Date()
  });
  //saves your post to the database
  post.save();

  res.redirect("/");
});


app.get("/posts/:blogpost", function(req, res) {
  posts.forEach(function(post) {
    const postTitle = _.kebabCase(post.title.toLowerCase());
    if (postTitle === post.postURL) {
      res.render("post", {
        myPost: post
      });
    };
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
