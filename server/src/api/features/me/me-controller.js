const meService = require('./me-service');

const getUser = async (req, res, next) => {
  const { id } = req.user;

  try {
    const user = await meService.readUser(id);

    return res.json(user);
  } catch (e) {
    return next(e);
  }
};

const updateUser = async (req, res, next) => {
  const payload = req.body;

  if (req.file) {
    payload.avatar = req.file.filename;
  }

  try {
    await meService.updateUser(req.user, payload);

    const { id, email, name, location } = req.user;
    return res.send({
      id,
      email,
      name,
      avatar: req.file ? req.file.filename : req.user.avatar,
      location
    });
  } catch (e) {
    return next(e);
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.user;

  try {
    await meService.deleteUser(id);

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

const getFavorites = async (req, res, next) => {
  const { id } = req.user;

  try {
    const favorites = await meService.readFavorites(id, req.query);

    return res.json(favorites);
  } catch (e) {
    return next(e);
  }
};

const getReviews = async (req, res, next) => {
  const { id } = req.user;

  try {
    const reviews = await meService.readReviews(id, req.query);

    return res.json(reviews);
  } catch (e) {
    return next(e);
  }
};

const updateReview = async (req, res, next) => {
  const { id } = req.params;

  try {
    await meService.updateReview(id, req.user.id, req.body);

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

const deleteReview = async (req, res, next) => {
  const { id } = req.params;

  try {
    await meService.deleteReview(id, req.user.id);

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

const getStatistics = async (req, res, next) => {
  const { id } = req.user;
  const { data } = req.query;

  try {
    const statistics = await meService.readStatistics(id, data);

    return res.json(statistics);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getUser,
  updateUser,
  deleteUser,
  getFavorites,
  getReviews,
  updateReview,
  deleteReview,
  getStatistics
};
