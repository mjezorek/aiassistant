const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());

const pluginPath = path.join(__dirname, "src", "plugins");
const pluginNames = fs.readdirSync(pluginPath);

app.get("/api/plugins", (req, res) => {
  res.json({
    plugins: pluginNames,
  });
});

app.get("/plugins/:plugin/:file", (req, res) => {
  const plugin = req.params.plugin;
  const file = req.params.file;
  res.sendFile(path.join(pluginPath, plugin, file));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
