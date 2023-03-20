module.exports = {
  routes: [
    {
      method: 'post',
      path: '/submit-form',
      handler: (req, res) => {
        // In a real-world scenario, you should parse the request body
        // and handle the form data accordingly.
        res.json({
          message: 'Form submitted successfully!',
          data: 'Form data received by the Form Plugin',
        });
      },
    },
  ],
};
