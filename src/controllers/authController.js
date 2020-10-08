const getLoginRegister = (req, res) => {
  return res.render('auth/loginRegister');
};

const getLogout = (req, res) => {};

module.exports = { getLoginRegister, getLogout };
