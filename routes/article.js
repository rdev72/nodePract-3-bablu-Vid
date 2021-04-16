const express = require ('express');
const articleSchema = require('../models/articleschema')
const ensureCorrectAid = require('../ensureCorrectAid')
const ensureLoggedIn = require('../ensureLoggedIn')
const router = express.Router()

router.post("/add",ensureLoggedIn, (req, res) => {
    articleSchema
      .create({
        tittle: req.body.tittle,
        auther: req.session.user._id,
        description: req.body.description
      })
      .then(article => {
        //console.log(article);
        res.redirect("/console");
      })
      .catch(err => console.log(err));
  });
  
  router.get("/edit/:aid",ensureLoggedIn,ensureCorrectAid, (req, res) => {
   
      articleSchema
        .findById(req.params.aid)
        .then(article => {
          if (article && article.auther == req.session.user._id) {
            res.render("editArticle", {
              user: req.session.user,
              article: article
            });
          } else {
            res.render("editArticle", {
              user: req.session.user,
              msg: "Article not exist or not authorised to edit"
            });
          }
        })
        .catch(err => console.log(err));
  });
  
  router.post("/edit/:aid",ensureLoggedIn,ensureCorrectAid, (req, res) => {
  
      const toUpdate = {};
      req.body.tittle && (toUpdate['tittle'] = req.body.tittle);
      req.body.description && (toUpdate['description'] = req.body.description);
      articleSchema
        .findByIdAndUpdate(req.params.aid, { $set: toUpdate })
        .then(article => res.redirect("/console"))
        .catch(err => console.log(err));
   
  
  });
  
  router.get("/delete/:aid",ensureLoggedIn,ensureCorrectAid, (req, res) => {
    articleSchema
      .findByIdAndDelete(req.params.aid)
      .then(article => res.redirect("/console"))
      .catch(err => console.log(err));
  });
  

module.exports = router