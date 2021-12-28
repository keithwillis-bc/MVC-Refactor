const express = require("express");

const Post = require("../models/post");
const blogControllers = require("../controllers/post-controllers");

const router = express.Router();

router.get("/", blogControllers.getHome);

router.get("/admin", blogControllers.getAdmin);

router.post("/posts", blogControllers.addPost);

router.get("/posts/:id/edit", blogControllers.getPost);

router.post("/posts/:id/edit", blogControllers.editPost);

router.post("/posts/:id/delete", blogControllers.deletePost);

module.exports = router;
