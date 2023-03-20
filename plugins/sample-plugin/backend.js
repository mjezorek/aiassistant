module.exports = {
  routes: [
    {
      method: 'get',
      path: '/sample-plugin-data',
      handler: (req, res) => {
        res.json({
          message: 'Hello from Sample Plugin!',
          data: 'Sample data from the Sample Plugin',
        });
      },
    },
  ],
};
