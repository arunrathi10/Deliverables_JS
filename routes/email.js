var express = require('express');
var router = express.Router();
const OpenAI = require('openai');

// Create OpenAI client using key from .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* GET email page. */
router.get('/write', function(req, res, next) {
  res.render('email/write', { title: 'AI Email & Compare - Email' });
});

/* POST: rewriting email with AI */
router.post('/write', async function(req, res) {
  try {
    const originalEmail = req.body.originalEmail || '';
    const tone = req.body.tone || 'polite';

    if (!originalEmail.trim()) {
      return res.render('email/write', {
        title: 'AI Email & Compare - Email',
        originalEmail,
        errorMessage: 'Please enter an email before submitting.'
      });
    }

    const systemMessage =
      'You are an assistant that rewrites emails from students to college professors or boss of company. ' +
      'Keep the meaning, remove any rudeness, fix grammar, and make it clear and respectful. ' +
      'Do NOT invent new details.';

    const userMessage = `
Tone to use: ${tone}

Rewrite the following email so it is appropriate to send to a college professor or boss of a company:

"""${originalEmail}"""
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.4,
    });

    const rewrittenEmail =
      completion.choices?.[0]?.message?.content?.trim() ||
      'Sorry, the AI did not return any content.';

    res.render('email/write', {
      title: 'AI Email & Compare - Email',
      originalEmail,
      tone,
      rewrittenEmail,
    });

  } catch (error) {
    console.error('Error calling OpenAI:', error);

    res.render('email/write', {
      title: 'AI Email & Compare - Email',
      originalEmail: req.body.originalEmail || '',
      errorMessage: 'Something went wrong while contacting the AI. Please try again.'
    });
  }
});

module.exports = router;
