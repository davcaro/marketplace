const articleService = require('./article-service');
const AppError = require('../../utils/app-error');

const getArticles = async (req, res, next) => {
  try {
    const articles = await articleService.readArticles();

    return res.json(articles);
  } catch (e) {
    return next(e);
  }
};

const getArticle = async (req, res, next) => {
  const { id } = req.params;

  try {
    const article = await articleService.readArticle(id);

    return res.json(article);
  } catch (e) {
    return next(e);
  }
};

const uploadImage = async (req, res, next) => {
  return res.json({
    image: req.file.filename
  });
};

const createArticle = async (req, res, next) => {
  req.body.userId = req.user.id;

  try {
    const article = await articleService.createArticle(req.body);

    return res.json(article);
  } catch (e) {
    return next(e);
  }
};

const updateArticle = async (req, res, next) => {
  const { id } = req.params;

  try {
    await articleService.updateArticle(id, req.body);

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

const addImage = async (req, res, next) => {
  const { id } = req.params;

  try {
    await articleService.addImage(id, req.file.filename);

    return res.json({ image: req.file.filename });
  } catch (e) {
    return next(e);
  }
};

const deleteArticle = async (req, res, next) => {
  const { id } = req.params;

  try {
    await articleService.deleteArticle(id);

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

const removeImage = async (req, res, next) => {
  const { imageId } = req.params;
  const articleId = req.params.id;

  try {
    await articleService.removeImage(imageId, articleId);

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

const hasPermission = async (req, res, next) => {
  const { id } = req.params;

  if (!req.user.isAdmin()) {
    try {
      const article = await articleService.readArticle(id);

      if (article.userId !== req.user.id) {
        throw new AppError(403, 'Forbidden');
      }
    } catch (e) {
      return next(e);
    }
  }

  return next();
};

module.exports = {
  getArticles,
  getArticle,
  uploadImage,
  createArticle,
  updateArticle,
  addImage,
  deleteArticle,
  removeImage,
  hasPermission
};
