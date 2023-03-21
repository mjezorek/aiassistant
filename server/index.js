const express = require('express');
const { Configuration, OpenAIApi } = require("openai");
const settings = require('../main/settings');

const app = express();
const port = 3000;

app.use(express.json());



app.post('/api/completions', async (req, res) => {

  const userInput = req.body.userInput;

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
    const result = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: JSON.stringify(userInput),
    });
    console.log(result.data);
    res.json(result.data);
  } catch (error) {
    console.error('Error using OpenAI API:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
