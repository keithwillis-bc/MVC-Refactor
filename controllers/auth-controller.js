const sessionValidation = require("../util/validation-session");

const accountValidation = require("../util/validation-account");
const Account = require("../models/account");

function getSignUp(req, res) {
  const sessionInputData = sessionValidation.getSessionErrorData(req, {
    email: "",
    confirmEmail: "",
    password: "",
  });

  res.render("signup", {
    inputData: sessionInputData,
  });
}

function getLogin(req, res) {
  const sessionInputData = sessionValidation.getSessionErrorData(req, {
    email: "",
    password: "",
  });

  res.render("login", {
    inputData: sessionInputData,
  });
}

async function addAccount(req, res) {
  const userData = req.body;
  const enteredEmail = userData.email; // userData['email']
  const enteredConfirmEmail = userData["confirm-email"];
  const enteredPassword = userData.password;

  if (
    !accountValidation.isAccountValid(
      enteredEmail,
      enteredConfirmEmail,
      enteredPassword
    )
  ) {
    const sessionInputData = sessionValidation.flashErrorsToSession(
      req,
      {
        message: "Invalid input - please check your data.",
        email: enteredEmail,
        password: enteredPassword,
        confirmEmail: enteredConfirmEmail,
      },
      () => {
        res.redirect("/signup");
      }
    );

    return;
  }

  const existingUser = await accountModel.getAccountByEmail(enteredEmail);

  if (existingUser) {
    const sessionInputData = sessionValidation.flashErrorsToSession(
      req,
      {
        message: "User exists already!",
        email: enteredEmail,
        password: enteredPassword,
        confirmEmail: enteredConfirmEmail,
      },
      () => {
        res.redirect("/signup");
      }
    );

    return;
  }

  const account = new Account(enteredEmail, enteredPassword);

  await accountModel.save();

  res.redirect("/login");
}

async function performLogin(req, res) {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredPassword = userData.password;

  const existingUser = await Account.performLogin(
    enteredEmail,
    enteredPassword
  );

  if (!existingUser) {
    const sessionInputData = sessionValidation.flashErrorsToSession(
      req,
      {
        message: "Could not log you in - please check your credentials!",
        email: enteredEmail,
        password: enteredPassword,
      },
      () => {
        res.redirect("/login");
      }
    );
    return;
  }

  sessionValidation.saveUserToSession(
    req,
    { id: existingUser.id, email: existingUser.email },
    true,
    () => {
      res.redirect("/admin");
    }
  );
}

function performLogout(req, res) {
  sessionValidation.saveUserToSession(req, null, false, () => {
    res.redirect("/");
  });
}

module.exports = {
  getSignUp,
  getLogin,
  addAccount,
  performLogin,
  performLogout,
};
