const express = require('express');
const { Octokit } = require('@octokit/core');
const { OpenAI } = require('openai');


const router = express.Router();

const createOctokitInstance = (githubToken) => {
  return new Octokit({ auth: githubToken });
};

const createOpenAIInstance = (openaiApiKey) => {
  return new OpenAI(openaiApiKey);
};

router.post('/create-issue', async (req, res) => {
  const { owner, repo, title, body, githubToken } = req.body;

  try {
    const octokit = createOctokitInstance(githubToken);
    const result = await octokit.rest.issues.create({ owner, repo, title, body });
    res.status(200).json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create issue.' });
  }
});

router.get('/read-issue', async (req, res) => {
  const { owner, repo, issueNumber, githubToken } = req.query;

  try {
    const octokit = createOctokitInstance(githubToken);
    const result = await octokit.rest.issues.get({ owner, repo, issue_number: issueNumber });
    res.status(200).json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to read issue.' });
  }
});

router.patch('/update-issue', async (req, res) => {
  const { owner, repo, issueNumber, title, body, state, githubToken } = req.body;

  try {
    const octokit = createOctokitInstance(githubToken);
    const result = await octokit.rest.issues.update({ owner, repo, issue_number: issueNumber, title, body, state });
    res.status(200).json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update issue.' });
  }
});

router.post('/suggest-solution', async (req, res) => {
  const { issueTitle, issueBody, openaiApiKey } = req.body;

  try {
    const openai = createOpenAIInstance(openaiApiKey);
    const prompt = `Issue: ${issueTitle}\n\nDescription: ${issueBody}\n\nProposed solution:`;

    const result = await openai.completions.create({
      engine: 'davinci-codex',
      prompt: prompt,
      max_tokens: 100,
      n: 1,
      stop: null,
      temperature: 0.5,
    });

    const suggestion = result.choices[0].text.trim();
    res.status(200).json({ suggestion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to suggest a solution.' });
  }
});

module.exports = {
  name: 'Code Management',
  route: '/code-management',
  router: router,
  icon: 'fas fa-code',
  componentPath: 'plugins/code-management/ui.html',
};