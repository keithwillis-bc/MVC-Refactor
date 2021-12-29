function getSessionErrorData(req, defaultValues) {
  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      ...defaultValues,
    };
  }

  req.session.inputData = null;

  return sessionInputData;
}

function flashErrorsToSession(req, data, action) {
  req.session.inputData = {
    hasError: true,
    ...data,
  };

  req.session.save(action);
}

function saveUserToSession(req, user, isAuthenticated, action) {
  req.session.user = user;
  req.session.isAuthenticated = isAuthenticated;
  req.session.save(function () {
    action();
  });
}

module.exports = {
  getSessionErrorData: getSessionErrorData,
  flashErrorsToSession: flashErrorsToSession,
  saveUserToSession: saveUserToSession,
};
