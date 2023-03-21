const express = require('express');
const path = require('path');
const fs = require('fs');
const { Configuration, OpenAIApi } = require("openai");
const settings = require('../main/settings');

const app = express();
const port = 3000;


app.use(express.json());

function loadPluginRoutes() {
  const pluginDir = path.join(__dirname, '..', 'plugins');
  fs.readdirSync(pluginDir).forEach((pluginName) => {
    const apiPath = path.join(pluginDir, pluginName, 'api.js');
    if (fs.existsSync(apiPath)) {
      const pluginRoutes = require(apiPath);
      app.use('/api/plugins/', pluginRoutes);
    }
  });
}

loadPluginRoutes(); // Ca

app.post('/api/chat', async (req, res) => {
  const userInput = req.body.messages;
  console.log(req.body);
  const apiKey = settings.get('openai-api-key');
  if (!apiKey) {
    res.status(400).json({ error: 'API key not found' });
    return;
  }

  const configuration = new Configuration({
    apiKey: settings.get('openai-api-key')
  });
  const openai = new OpenAIApi(configuration);

  try {
    // Modify the prompt to use chat format
    const result = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: userInput
    });

    // Extract the assistant's response from the result
    const assistantResponse = result.data.choices[0].message.content;
    res.json({ response: assistantResponse });
  } catch (error) {
    console.error('Error using OpenAI API:', error.message);
    res.status(500).json({ error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
