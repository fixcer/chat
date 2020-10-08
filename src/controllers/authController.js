const getLoginRegister = (req, res) => {
  return res.render('auth/index');
};

const getLogout = (req, res) => {};

module.exports = { getLoginRegister, getLogout };
