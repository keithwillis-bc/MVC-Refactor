function isAccountValid(email, confirmEmail, password) {
  return (
    email &&
    confirmEmail &&
    password &&
    password.trim().length > 6 &&
    email === confirmEmail &&
    email.includes("@")
  );
}

module.exports = {
  isAccountValid,
};
