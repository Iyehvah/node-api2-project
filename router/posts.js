const express = require("express")

const post = require("../data/db")

const router = express.Router()

//returns an array of all the post objects contained in the DB
//we no longer have to define the route prefix as "/api/posts" is already being called on the use method in index.js
router.get("/", (req, res) => {
    const opts = {
        sortBy: req.query.sortBy,
        limit: req.query.limit,
    }
    post.find(opts)
    .then ((posts) => {
        res.status(200).json(posts)
    })
    .catch((error) => {
        res.status(500).json({
            message: "The posts information could not be retrieved."
        })
    })
})

//returns a post object with the specified ID
router.get("/:id", (req, res) => {
    post.findById(req.params.id)
    .then ((post) => {
        if(post){
            res.status(200).json(post)
        } else {
            res.status(404).json({
                message: "The post does not exist"
            })
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "The post information could not be retrieved."
        })
    })
})

//returns an array of all the comment objects associated with the post
//with the specified ID
router.get("/:id/comments", (req, res) => {
    post.findCommentById(req.params.id)
    .then((comments) => {
        //if comment comes with an empty body, then it runs that error message
        if(comments == "") {
            res.status(404).json({
                message: "The post with the specified id does not exist."
            })
            //otherwise if the comment comes with info then it will return this json
        } else {
            res.status(200).json(comments)
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "The comment information could not be retrieved."
        })
    })
})

//updates the post with the specified id
// using data from the request body. Returns the modified document, NOT the original.
router.put("/:id", (req, res) => {
    if(!req.body.title || !req.body.contents) {
        return res.status(404).json({
            message: "Please provide a title and contents for post."
        })
    }
    post.update(req.params.id, req.body)
    .then(updatedPost => {
        if(updatedPost) {
            res.status(200).json(updatedPost)
        } else {
            res.status(404).json({
                message: "The post with the specified ID does not exist."
            })
        }
    })
    .catch(error => {
        res.status(500).json({
            message:  "The post information could not be modified."
        })
    })
})

// creates a post using the info sent innside the request body.
router.post("/", (req, res) => {
    if(!req.body.title || !req.body.contents){
        return res.status(400).json({
            message: "Please provide a title and content for the post."
        })
    }
    post.insert(req.body)
    .then(createdPost => {
        res.status(201).json(createdPost)
    })
    .catch(error => {
        res.status(500).json({
            message: "There was an error while saving the post to the database"
        })
    })
})

//removes the post with the specified ID and returns the deleted post object.
router.delete("/:id", (req, res) => {
    post.remove(req.params.id)
    .then(post => {
        if(post > 0){
            res.status(200).json({
                message: "Post has been deleted"
            })
        } else {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "the post could not be removed."
        })
    })
})

//creates a comment for a post with specified Id using info sent inside request body
router.post("/:id/comments", (req, res) => {
  //Here im making variables since data it will have to be saved first before inserting them to the data base

  const { id } = req.params.id;
  //im creating a copy of the body, and updating post_id with the new id of the comment being created ().
  const data = { ...req.body, Post_id: req.params.id };

  // here im pretty much saying that if the client (front end) does not provide to us an input with text: "comments needed to be created"
  // to return an error
  if (!req.body.text) {
    return res.status(400).json({
      message: "Please provide text for the comment."
    });
  }

  //here im finding first the post related with the inputed id

  post
    .findById(id)
    .then(comment => {
      //passing data variable thata contains the copy of the body and post_id
      // to insertComment function thats in the DB.JS file(database)
      //here im just returning new text created along a 201 created status.
      if (comment) {
        post.insertComment(data);
        res.status(201).json(data);
      } else {
        //this logic has to be fixed so that if the id does not return any body it would run this error
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        });
      }
    })

    .catch(error => {
      res.status(500).json({
        message: "There was an error while saving the comment to the database"
      });
    });
});

module.exports = router