const express = require('express');
const serverApp = express();
const http = require('http');
const server = http.createServer(serverApp);
const { plugins } = require('./plugins');

const port = process.env.PORT || 3000;

serverApp.use(express.json());
serverApp.use(express.static('public'));


for (const plugin of plugins) {
  serverApp.use(plugin.route, plugin.router);
}
serverApp.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = {
  serverApp: serverApp,
  server: server,
};