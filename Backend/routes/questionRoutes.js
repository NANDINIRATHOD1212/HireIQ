import express from 'express';
import QuestionSet from '../models/QuestionSet.js';
import {viewResults} from '../controllers/questionController.js'
import {
    handlePdfUpload,
    saveCustomQuestions,
    viewSavedQuestions,
    updateQuestionSet,
    deleteQuestionSet,
   

} from '../controllers/questionController.js';

import {
  generateFromLocal,
  previewQuestions,
  savePreviewedQuestions
} from '../controllers/localAiController.js';
import { generateQuestionsWithGemini } from '../controllers/GeminiAIController.js';

const router = express.Router();

router.post('/questions/upload-pdf', handlePdfUpload);
// router.get('/questions/:id',getQuestionSetById)

router.post('/questions/manual', saveCustomQuestions);

router.get('/questions/saved', viewSavedQuestions);
router.post('/question-set/edit/:id', updateQuestionSet);
router.post('/question-set/delete/:id', deleteQuestionSet);
router.post('/questions/from-local', generateFromLocal);
router.get('/questions/preview', previewQuestions);
router.post('/questions/save-preview', savePreviewedQuestions);
router.post('/generate-ai',generateQuestionsWithGemini)
router.get('/session-check', (req, res) => {
  if (req.session.user) {
    res.json({ sessionUser: req.session.user });
  } else {
    res.json({ sessionUser: 'No session user found' });
  }
});

router.get('/results', viewResults);
export default router;
