export const getPageParams = (query, defaultLimit = 5) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || defaultLimit;
  return { page, limit };
};

export const getPagination = (total, page, limit) => ({
  total,
  page,
  limit,
  pages: Math.ceil(total / limit),
});
