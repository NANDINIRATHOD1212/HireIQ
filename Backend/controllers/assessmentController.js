import QuestionSet from "../models/QuestionSet.js";
import AssessmentResult from '../models/AssessmentResult.js'
import CandidateAnswer from '../models/CandidateAnswer.js';
export const renderAssessmentForm = async (req, res) => {
  try {
    const setId = Number(req.params.id);
    const candidateId = req.session?.user?.id || 2;

    console.log('📥 Request received - Assessment ID:', setId);
    console.log('👤 Candidate ID:', candidateId);

    const questionSet = await QuestionSet.findByPk(setId);

    if (!questionSet) {
      console.log(' Assessment not found in DB');
      return res.status(404).json({
        success: false,
        message: 'Assessment not found.'
      });
    }

    const existingResult = await AssessmentResult.findOne({
      where: { candidateId, questionSetId: setId }
    });

    if (existingResult) {
      console.log(' Candidate already submitted this assessment');
      return res.status(409).json({
        success: false,
        message: 'Assessment already submitted.'
      });
    }

    console.log(' Assessment retrieved:', questionSet.title);
    console.log(' Raw questions:', questionSet.questions);

    let parsedQuestions = [];
    try {
      parsedQuestions = JSON.parse(questionSet.questions || '[]');
    } catch (parseError) {
      console.error(' Failed to parse questions JSON:', parseError);
      return res.status(500).json({
        success: false,
        message: 'Invalid question format in assessment.'
      });
    }

    if (!Array.isArray(parsedQuestions)) {
      console.error(' Parsed questions is not an array');
      return res.status(500).json({
        success: false,
        message: 'Assessment questions must be an array.'
      });
    }

    return res.status(200).json({
      success: true,
      title: questionSet.title,
      questions: parsedQuestions,
      setId
    });

  } catch (err) {
    console.error(' Error rendering assessment form (API):', err);
    return res.status(500).json({
      success: false,
      message: 'Unable to load assessment.'
    });
  }
};


export const submitAssessment = async (req, res) => {
  const setId = Number(req.params.setId || req.params.id);
  const candidateId = req.session?.user?.id || 2;
  const answers = req.body.answers;

  try {
    const questionSet = await QuestionSet.findByPk(setId);
    if (!questionSet) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found.'
      });
    }

    const parsedQuestions = JSON.parse(questionSet.questions || '[]');
    let score = 0;

    for (let index in answers) {
      const userAnswer = answers[index].toLowerCase();
      const question = parsedQuestions[index];

      let rawKeywords = question.keywords;
      if (!rawKeywords || rawKeywords.length === 0) {
        console.warn(" No keywords found, generating fallback from answer");
        rawKeywords = question.answer?.split(/\W+/).slice(0, 5) || [];
      }

      const keywords = rawKeywords.map(k => k.toLowerCase());
      const matched = keywords.some(keyword => userAnswer.includes(keyword));
      if (matched) score++;

      await CandidateAnswer.create({
        questionSetId: setId,
        candidateId,
        question: question.question,
        answer: answers[index]
      });
    }

    await AssessmentResult.create({
      candidateId,
      questionSetId: setId,
      totalScore: score
    });

    return res.status(200).json({
      success: true,
      message: 'Assessment submitted successfully.',
      score,
      total: parsedQuestions.length
    });

  } catch (err) {
    console.error(' Error submitting assessment (API):', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit your assessment.'
    });
  }
};

export const getMySubmissions = async (req, res) => {
  const candidateId = req.session.user.id;

  try {
    const results = await AssessmentResult.findAll({
      where: { candidateId },
      include: [
        {
          model: QuestionSet,
          
          attributes: ['title']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const formatted = results.map(result => ({
      title: result.QuestionSet?.title || 'Unknown',
      totalScore: result.totalScore,
      date: result.createdAt
    }));

    res.status(200).json({ success: true, submissions: formatted });
  } catch (err) {
    console.error('Error loading my submissions:', err);
    res.status(500).json({ success: false, message: 'Failed to load submissions' });
  }
};


