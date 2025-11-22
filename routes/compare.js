var express = require("express");
var router = express.Router();
const OpenAI = require("openai");
const AuthenticationMiddleware = require('../middleware/auth');


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* GET: Ask & Compare page */
router.get("/ask", AuthenticationMiddleware, function (req, res) {
  res.render("compare/ask", {
    title: "AI Email & Compare - Ask & Compare",
  });
});

/* POST: handle question and get 3 AI-style answers */
router.post("/ask", AuthenticationMiddleware, async function (req, res) {
  try {
    const question = req.body.question || "";

    if (!question.trim()) {
      return res.render("compare/ask", {
        title: "AI Email & Compare - Ask & Compare",
        errorMessage: "Please enter a question before getting answers.",
      });
    }

    // Base instructions for all three
    const baseSystemMessage =
      "You are an AI tutor helping a college student understand a topic. " +
      "Explain clearly with simple language and helpful structure.";

    // 3 different prompts for 3 styles
    const chatGptMessages = [
      {
        role: "system",
        content: baseSystemMessage + " Answer in a balanced, helpful style.",
      },
      { role: "user", content: question },
    ];

    const claudeMessages = [
      {
        role: "system",
        content:
          baseSystemMessage +
          " Answer in a style inspired by Claude: calm, structured, and analytical. " +
          "Use short sections or bullet points when helpful.",
      },
      { role: "user", content: question },
    ];

    const geminiMessages = [
      {
        role: "system",
        content:
          baseSystemMessage +
          " Answer in a style inspired by Google Gemini: concise, clear, and friendly. " +
          "Avoid very long paragraphs.",
      },
      { role: "user", content: question },
    ];

    // Calling OpenAI 3 times in parallel
    const [chatgptRes, claudeRes, geminiRes] = await Promise.all([
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: chatGptMessages,
        temperature: 0.5,
      }),
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: claudeMessages,
        temperature: 0.5,
      }),
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: geminiMessages,
        temperature: 0.5,
      }),
    ]);

    const chatgptAnswer =
      chatgptRes.choices?.[0]?.message?.content?.trim() ||
      "No response from ChatGPT-style answer.";

    const claudeAnswer =
      claudeRes.choices?.[0]?.message?.content?.trim() ||
      "No response from Claude-style answer.";

    const geminiAnswer =
      geminiRes.choices?.[0]?.message?.content?.trim() ||
      "No response from Gemini-style answer.";

    // Render page with all three answers
    res.render("compare/ask", {
      title: "AI Email & Compare - Ask & Compare",
      question,
      chatgptAnswer,
      claudeAnswer,
      geminiAnswer,
    });
  } catch (error) {
    console.error("Ask & Compare error:", error);

    res.render("compare/ask", {
      title: "AI Email & Compare - Ask & Compare",
      question: req.body.question || "",
      errorMessage:
        "Something went wrong while getting answers. Please try again or check your API key.",
    });
  }
});

module.exports = router;
