//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

//connection url
const mongoURL = "mongodb://localhost:27017";

// database name
const dbName = "blogDB";

//Create a new MongoClient
const client = new MongoClient(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true}
);

const app = express();

const posts = [];

const homeStartingContent = "Hello and welcome to my blog. This is a little blog about me and some of the things that are happening in my life.";
const aboutContent = "My name is Therese and I live in bergen Norway. I am currently taking a course in full-stack web development where I am learning about how to build web-apps. The creative proccess is fun and it is motivating to see my skill levels increase with each project. In the near future I hope to start building my own project with the React-framework. Maybe I will tell You about it in my blog? 😉";
const contactContent = "You can contact me on email: ";

//connects to the database. client has access to the mongoDB url as a global const
client.connect(function(err){
  assert.equal(err, null);
  const db = client.db(dbName);
  // console.log("succsessfully connected to the database");

  insertPosts(db, function(){
    client.close();
  });
});

const insertPosts = function(db, callback){
  const collection = db.collection("posts");

  collection.insertMany([
    {
      _id: "01",
      title: "My second blogpost",
      content: "This is my second blog entry, i hope i can successfully add it to my blog.",
      url: "my-second-blogpost"
    },
    {
      _id: "02",
      title: "My third blogpost",
      content: "This is my third blog entry, i hope i can successfully add it to my blog.",
      url: "my-third-blogpost"
    }
  ], function(err, result){
    assert.equal(err, null);
    console.log("posts inserted");
  });
};


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
    content: req.body.postContent,
    postURL: _.kebabCase(req.body.postTitle.toLowerCase())
  };
  //pushes your new post in to the posts-array
  posts.push(post);

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
