const categoryService = require('./category-service');

const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.readCategories();

    return res.json(categories);
  } catch (e) {
    return next(e);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);

    return res.json(category);
  } catch (e) {
    return next(e);
  }
};

const updateCategory = async (req, res, next) => {
  const { id } = req.params;

  try {
    await categoryService.updateCategory(id, req.body);

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

const deleteCategory = async (req, res, next) => {
  const { id } = req.params;

  try {
    await categoryService.deleteCategory(id);

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
