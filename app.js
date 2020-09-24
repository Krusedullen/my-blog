//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();
const home = "Home";



const homeStartingContent = "Hello and welcome to my blog. This is a little blog about me and some of the things that are happening in my life.";
const aboutContent = "My name is Therese and I live in bergen Norway. I am currently taking a course in full-stack web development where I am learning about how to build web-apps. The creative proccess is fun and it is motivating to see my skill levels increase with each project. In the near future I hope to start building my own project with the React-framework. Maybe I will tell You about it in my blog? 😉";
const contactContent = "You can contact me on email: ";


//connection to mongodb url with our database name at the end of the url
// Local connection: "mongodb://localhost:27017/blogDB"
mongoose.connect(process.env.MONGODB_KEY, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const postSchema = new mongoose.Schema({
  //attributes can be specified as a key:value-pair, or another jSON-object can be passed with more specified options.
  title: {
    type: String,
    required: [true, "no title was specified for this post."]
  },
  url: String,
  content: String,
  date: Date
});

const Post = mongoose.model("Post", postSchema);


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));



app.get("/", function(req, res) {
  Post.find({}, function(err, post) {
    if (!err) {
      res.render("home", {
        homeParagraph: homeStartingContent,
        myPosts: post
      });
    };
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


app.route("/compose")

.get(function(req, res) {
  res.render("compose");
})

.post(function(req, res) {
  postTitle = _.capitalize(req.body.postTitle);
  const newPost = new Post({
    title: postTitle,
    content: req.body.postContent,
    date: new Date(),
    url: _.kebabCase(postTitle)
  });

  newPost.save();
  res.redirect("/");
});

app.get("/editor", function(req, res){
  Post.find({}, function(err, post) {
    if (!err) {
      res.render("editor", {
        myPosts: post
      });
    };
  });
});

app.post("/delete", function(req, res){
  const postID = req.body.deleteBtn;
  Post.deleteOne({
    _id: postID
  }, function(err){
    if(!err){
      res.redirect("/editor");
    };
  });
});


app.get("/posts/:blogpost", function(req, res) {
  const postUrl = req.params.blogpost;

  Post.findOne({
    url: postUrl
  }, function(err, foundPost) {
      if (!err) {
      res.render("post", {
        title: foundPost.title,
        content: foundPost.content
      });
    } else{
      console.log("oops, couldn't load this post");
    }
  });
});




app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
