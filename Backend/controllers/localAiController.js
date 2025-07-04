import fs from 'fs';
import path from 'path';
import QuestionSet from '../models/QuestionSet.js';
import { Op } from 'sequelize';
const jsonPath = path.resolve('data', 'questionLibrary.json');


const loadQuestionLibrary = () => {
  try {
    const data = fs.readFileSync(jsonPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load questionLibrary.json:', err);
    return { catogories: {} };
  }
};


export const getSkills = (req, res) => {
  try {
    const data = loadQuestionLibrary();
    const skills = Object.keys(data.catogories);
    res.status(200).json({ skills });
  } catch (err) {
    console.error('Error loading skills:', err);
    res.status(500).json({ error: 'Failed to load skills' });
  }
};


export const generateFromLocal = (req, res) => {
  const selectedSkills = Array.isArray(req.body.selectedSkills)
    ? req.body.selectedSkills
    : [req.body.selectedSkills];

  const customTitle = req.body.title;
  const data = loadQuestionLibrary();
  let allQuestions = [];

  selectedSkills.forEach(skill => {
    if (data.catogories[skill]) {
      allQuestions = allQuestions.concat(data.catogories[skill]);
    }
  });

  const shuffled = allQuestions.sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffled.slice(0, 5); 


  req.session.previewQuestions = selectedQuestions;
  req.session.previewTitle = customTitle;

  res.status(200).json({
    title: customTitle,
    skills: selectedSkills,
    total: selectedQuestions.length,
    questions: selectedQuestions
  });
};


export const previewQuestions = (req, res) => {
  const { skill } = req.query;

  try {
    const data = loadQuestionLibrary();
    const questions = data.categories[skill];

    if (!questions) {
      return res.status(404).json({ error: `Skill '${skill}' not found.` });
    }

    res.status(200).json({ skill, questions });
  } catch (err) {
    console.error('Preview error:', err);
    res.status(500).json({ error: 'Could not preview questions.' });
  }
};


export const savePreviewedQuestions = async (req, res) => {
  const recruiterId = req.session?.user?.id;
  const questions = req.session.previewQuestions;
  const title = req.session.previewTitle;
  const jobId = req.body.jobId; // ✅ Extract from frontend

  if (!recruiterId) {
    return res.status(401).json({ error: 'Unauthorized: Recruiter not logged in.' });
  }

  if (!questions || !title || !jobId) {
    return res.status(400).json({ error: 'Missing session data or jobId.' });
  }

  try {
    const existingSet = await QuestionSet.findOne({
      where: {
        recruiterId,
        jobId,
        title,
      }
    });

    if (existingSet) {
      return res.status(409).json({ error: 'Duplicate question set already exists.' });
    }

    await QuestionSet.create({
      title,
      recruiterId,
      jobId,
      questions: JSON.stringify(questions),
    });

    req.session.previewQuestions = null;
    req.session.previewTitle = null;

    res.status(201).json({ message: 'Question set saved successfully' });
  } catch (err) {
    console.error('Error saving preview set:', err);
    res.status(500).json({ error: 'Failed to save question set' });
  }
};
