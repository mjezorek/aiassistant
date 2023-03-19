const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { plugins } = require('./plugins');

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));


for (const plugin of plugins) {
  app.use(plugin.route, plugin.router);
}
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = server;