const getHome = (req, res) => {
  return res.render('main/home/index', {
    errors: req.flash('errors'),
    success: req.flash('success'),
    user: req.user,
  });
};

export default { getHome };
