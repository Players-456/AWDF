const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'dummy_key' });

router.post('/generate-description', async (req, res) => {
  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: `Write a short task description for: ${req.body.title}` }]
    });
    res.json({ description: completion.choices[0].message.content });
  } catch (err) {
    res.status(200).json({ description: '', fallback: true });
  }
});

module.exports = router;
