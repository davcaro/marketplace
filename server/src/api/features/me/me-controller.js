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
      _id: id,
      email,
      name,
      avatar: req.file.filename,
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

module.exports = {
  getUser,
  updateUser,
  deleteUser
};
