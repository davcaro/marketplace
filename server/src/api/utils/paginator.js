const paginate = (data, limit, offset) => {
  return {
    pagination: {
      limit,
      offset,
      total: data.count
    },
    data: data.rows
  };
};

module.exports = {
  paginate
};
