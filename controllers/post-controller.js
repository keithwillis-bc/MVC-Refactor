const session = require("express-session");
const Post = require("../models/post");
const sessionValidation = require("../util/validation-session");
const postValidation = require("../util/validation");

function getHome(req, res) {
  res.render("welcome");
}

async function getAdmin(req, res) {
  const posts = await Post.getPosts();

  const sessionErrorData = sessionValidation.getSessionErrorData(req, {
    title: "",
    content: "",
  });

  res.render("admin", {
    posts: posts,
    inputData: sessionErrorData,
  });
}

async function addPost(req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  if (!postValidation.postIsValid(enteredTitle, enteredContent)) {
    sessionValidation.flashErrorsToSession(
      req,
      {
        message: "Invalid input - please check your data.",
        title: enteredTitle,
        content: enteredContent,
      },
      () => {
        res.redirect("/admin");
      }
    );

    return; // or return res.redirect('/admin'); => Has the same effect
  }

  const post = new Post(enteredTitle, enteredContent);
  await post.save();

  res.redirect("/admin");
}

async function getPost(req, res, next) {
  let post;
  try {
    post = await Post.getPostById(req.params.id);
  } catch (error) {
    next(error);
    return;
  }

  if (!post) {
    return res.render("404"); // 404.ejs is missing at this point - it will be added later!
  }

  const sessionErrorData = sessionValidation.getSessionErrorData(req, post);

  res.render("single-post", {
    post: post,
    inputData: sessionErrorData,
  });
}

async function editPost(req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  if (!postValidation.postIsValid(enteredTitle, enteredContent)) {
    sessionValidation.flashErrorsToSession(
      req,
      {
        message: "Invalid input - please check your data.",
        title: enteredTitle,
        content: enteredContent,
      },
      () => {
        res.redirect(`/posts/${req.params.id}/edit`);
      }
    );

    return;
  }

  const post = await Post.getPostById(req.params.id);

  if (!post) {
    return res.render("404");
  }

  post.title = enteredTitle;
  post.content = enteredContent;

  await post.save();

  res.redirect("/admin");
}

async function deletePost(req, res) {
  const post = await Post.getPostById(req.params.id);

  if (!post) {
    return res.render("404");
  }
  post.delete();

  res.redirect("/admin");
}

module.exports = {
  getHome: getHome,
  getAdmin: getAdmin,
  addPost: addPost,
  getPost: getPost,
  editPost: editPost,
  deletePost: deletePost,
};
