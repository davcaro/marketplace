const categoryDAL = require('./category-dal');
const AppError = require('../../utils/app-error');

const readCategories = async () => {
  try {
    return await categoryDAL.findAll();
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const createCategory = async body => {
  try {
    return await categoryDAL.create(body);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const updateCategory = async (id, body) => {
  try {
    return await categoryDAL.updateById(id, body);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const deleteCategory = async id => {
  let deletedRows;

  try {
    deletedRows = await categoryDAL.deleteById(id);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  if (deletedRows === 0) {
    throw new AppError(404, 'Category not found');
  }

  return deletedRows;
};

module.exports = {
  readCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
