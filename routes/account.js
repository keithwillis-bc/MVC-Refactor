const express = require("express");
const authController = require("../controllers/auth-controller");

const router = express.Router();

router.get("/signup", authController.getSignUp);

router.get("/login", authController.getLogin);

router.post("/signup", authController.addAccount);

router.post("/login", authController.performLogin);

router.post("/logout", authController.performLogout);

router.get("/401", authController.get401);

module.exports = router;
