module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/all',
      handler: 'all.index',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
