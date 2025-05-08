function parseFilters(query) {

  // * for wgeb query has "filter" and it is an object
  if (typeof query.filter === 'object' && query.filter !== null) {
    return query.filter;
  }

  const filters = {};

  Object.keys(query).forEach((key) => {
    const match = key.match(/^filter\[(.+?)\]/);
    if (match) {
      const field = match[1];
      filters[field] = query[key];
    }
  });

  return filters;
}

module.exports = { parseFilters };
