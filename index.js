const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const userSchema = require("./models/userSchema");
const articleSchema = require("./models/articleschema");
const { render } = require("ejs");
const ensureLoggedIn = require('./ensureLoggedIn')

const auth = require('./routes/auth')
const article = require('./routes/article')

const port = 3000;

// MiddleWare

//for express
const app = express();

//templateEngine
app.set("view engine", "ejs");

//bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//mongoose
mongoose.connect("mongodb://localhost:27017/nodekb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
const db = mongoose.connection;
db.once("open", () => console.log("mongo connected"));
db.on("error", err => console.log(err));

//For session
app.use(
  session({
    secret: "i love programming",
    resave: false,
    saveUninitialized: true
  })
);

// using inheritd routes
app.use('/auth',auth)
app.use('/article',article)

app.get("/", (req, res) => {
  articleSchema
    .find()
    .populate("auther", "name -_id")
    .then(articles => {
      res.render("index", {
        tittle: "Root",
        data: articles,
        user: req.session.user
      });
    })
    .catch(err => console.log(err));
});

app.get("/about", (req, res) => res.send("hello about"));

app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
    }
  });
  res.redirect("/");
});

app.get("/console",ensureLoggedIn, (req, res) => {
  articleSchema
  .find({ auther: req.session.user._id })
  .then(userArticles => {
    //console.log(userArticles);
    res.render("console", {
      user: req.session.user,
      userArticles: userArticles
    });
  })
  .catch(err => console.log(err));
  
});




//Edit User Details
app.get('/user/edit',ensureLoggedIn,(req,res)=>{
  res.render('editUser',{user:req.session.user})
})

//Update Edited User Details
app.post('/user/edit',(req,res)=>{
  const toUpdate = {}
  req.body.name && (toUpdate['name'] = req.body.name )
  req.body.email && (toUpdate['email']=req.body.email)
  userSchema.findByIdAndUpdate(req.session.user._id,{ $set: toUpdate})
  .then(user => res.redirect("/console") )
  .catch(err => console.log(err))
})

// Delete User and related Articles
app.get('/user/delete',(req,res)=>{
  articleSchema.deleteMany({auther:req.session.user._id})
  .then(articles => { 
    if (articles) {
      userSchema.findByIdAndDelete(req.session.user._id)
      .then(user => res.redirect('/logout')).catch(err=>console.log(err))
    } else {
      res.redirect('/console')
    }
  })
  .catch(err=>console.log(err))
})

app.listen(port, () =>
  console.log(`server is running at http://localhost:${port}`)
);
