const express = require("express");

const blogController = require("../controllers/post-controller");

const router = express.Router();

router.get("/", blogController.getHome);

router.get("/admin", blogController.getAdmin);

router.post("/posts", blogController.addPost);

router.get("/posts/:id/edit", blogController.getPost);

router.post("/posts/:id/edit", blogController.editPost);

router.post("/posts/:id/delete", blogController.deletePost);

module.exports = router;
