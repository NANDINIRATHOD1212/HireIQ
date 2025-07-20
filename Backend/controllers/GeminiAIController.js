import axios from 'axios';
import QuestionSet from '../models/QuestionSet.js';

export const generateQuestionsWithGemini = async (req, res) => {
  const { skill, jobId } = req.body;
  const recruiterId = req.session.user?.id;

  if (!skill || !jobId || !recruiterId) {
    return res.status(400).json({ success: false, message: "Skill, jobId, and recruiter ID are required" });
  }

  const prompt = `
Generate 5 technical interview questions for the skill: ${skill}.
Each question should be clear and relevant for intermediate-level candidates.
Return only a valid JSON array like this (no backticks or markdown, just plain JSON):

[
  {
    "question": "What is a closure in JavaScript?",
    "answer": "A closure is a function that has access to its own scope, the outer function's scope, and the global scope."
  }
]
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }
    );

    const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const cleaned = content
      .replace(/```json|```/g, '')
      .replace(/[“”]/g, '"')
      .replace(/\\(?!["\\/bfnrtu])/g, '\\\\')
      .trim();

    let questions;
    try {
      questions = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("JSON parsing error:", parseErr.message);
      return res.status(500).json({
        success: false,
        message: 'Invalid JSON returned from Gemini',
      });
    }

    // ✅ Save to session for later saving
    req.session.previewQuestions = questions;
    req.session.previewTitle = `AI Generated - ${skill}`;

    return res.status(200).json({
      success: true,
      message: 'AI questions generated successfully',
      questions // frontend will preview from this
    });

  } catch (err) {
    console.error('Gemini API error:', err?.response?.data || err.message);
    return res.status(500).json({ success: false, message: 'Failed to generate questions' });
  }
};
