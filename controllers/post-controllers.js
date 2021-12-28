const Post = require("../models/post");

function getHome(req, res) {
  res.render("welcome", { csrfToken: req.csrfToken() });
}

async function getAdmin(req, res) {
  if (!res.locals.isAuth) {
    return res.status(401).render("401");
  }

  const posts = await Post.getPosts();

  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      title: "",
      content: "",
    };
  }

  req.session.inputData = null;

  res.render("admin", {
    posts: posts,
    inputData: sessionInputData,
    csrfToken: req.csrfToken(),
  });
}

async function addPost(req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  if (
    !enteredTitle ||
    !enteredContent ||
    enteredTitle.trim() === "" ||
    enteredContent.trim() === ""
  ) {
    req.session.inputData = {
      hasError: true,
      message: "Invalid input - please check your data.",
      title: enteredTitle,
      content: enteredContent,
    };

    res.redirect("/admin");
    return; // or return res.redirect('/admin'); => Has the same effect
  }

  const post = new Post(enteredTitle, enteredContent);
  await post.save();

  res.redirect("/admin");
}

async function getPost(req, res) {
  const post = await Post.getPostById(req.params.id);

  if (!post) {
    return res.render("404"); // 404.ejs is missing at this point - it will be added later!
  }

  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      title: post.title,
      content: post.content,
    };
  }

  req.session.inputData = null;

  res.render("single-post", {
    post: post,
    inputData: sessionInputData,
    csrfToken: req.csrfToken(),
  });
}

async function editPost(req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  if (
    !enteredTitle ||
    !enteredContent ||
    enteredTitle.trim() === "" ||
    enteredContent.trim() === ""
  ) {
    req.session.inputData = {
      hasError: true,
      message: "Invalid input - please check your data.",
      title: enteredTitle,
      content: enteredContent,
    };

    res.redirect(`/posts/${req.params.id}/edit`);
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
