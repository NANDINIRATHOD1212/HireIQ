import QuestionSet from '../models/QuestionSet.js';
import mammoth from 'mammoth';
import multer from 'multer';
import fs from 'fs';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import CandidateAnswer from '../models/CandidateAnswer.js';
import User from '../models/User.js';
const upload = multer({ dest: 'uploads/' });

export const handlePdfUpload = [
  upload.single('pdf'),
  async (req, res) => {
    const filePath = req.file.path;
    const title = req.body.title;
    const recruiterId = req.session.user?.id || req.body.recruiterId;
    const jobId = req.body.jobId;

    if (!recruiterId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Recruiter ID missing' });
    }

    try {
      let textContent = '';

      if (req.file.mimetype === 'application/pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const parsedData = await pdfParse(dataBuffer);
        textContent = parsedData.text;
      } else if (
        req.file.mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const result = await mammoth.extractRawText({ path: filePath });
        textContent = result.value;
      } else {
        throw new Error('Unsupported file type');
      }

      const lines = textContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '');

      const questions = [];

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('Q:') && lines[i + 1]?.startsWith('A:')) {
          const q = lines[i].replace('Q:', '').trim();
          const a = lines[i + 1].replace('A:', '').trim();
          questions.push({ question: q, answer: a });
          i++;
        }
      }

      if (questions.length === 0) {
        return res.status(400).json({ success: false, message: 'No valid Q/A pairs found' });
      }

      const questionSet = await QuestionSet.create({
        title,
        recruiterId,
        jobId,
        questions: JSON.stringify(questions),
      });

      res.json({ success: true, message: 'Questions saved', questionSet });

    } catch (err) {
      console.error(' Upload Error:', err);
      res.status(500).json({ success: false, message: 'Error processing file' });
    } finally {
      fs.unlinkSync(filePath);
    }
  }
];


export const saveCustomQuestions = async (req, res) => {
  const { title, questions,jobId } = req.body;
  const recruiterId = req.session.user.id;

  try {
    const raw = questions.split('\n');
    const parsed = raw.map(line => {
      const [q, a] = line.split('|');
      return { question: q.trim(), answer: a?.trim() || '' };
    });

    const questionSet = await QuestionSet.create({
      title,
      recruiterId,
      jobId,
      questions: JSON.stringify(parsed),
    });

    res.json({ success: true, message: 'Custom questions saved', questionSet });
  } catch (err) {
    console.error('Error saving questions:', err);
    res.status(500).json({ success: false, message: 'Error saving question set' });
  }
};

export const viewSavedQuestions = async (req, res) => {
  try {
    const recruiterId = req.session.user?.id; // ✅ get ID from session

    if (!recruiterId) {
      return res.status(401).json({ error: 'Unauthorized: No session found' });
    }

    const questions = await QuestionSet.findAll({
      where: { recruiterId },
    });

    res.status(200).json(questions);
  } catch (err) {
    console.error('❌ Error fetching questions:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


// export const getQuestionSetById = async (req, res) => {
//   try {
//     const questionSet = await QuestionSet.findByPk(req.params.id);

//     if (!questionSet) {
//       return res.status(404).json({ success: false, message: 'Question set not found' });
//     }

//     const parsedQuestions = JSON.parse(questionSet.questions);
//     res.json({ success: true, questionSet: { ...questionSet.dataValues, questions: parsedQuestions } });
//   } catch (err) {
//     console.error('Error fetching set:', err);
//     res.status(500).json({ success: false, message: 'Error fetching question set' });
//   }
// };

export const updateQuestionSet = async (req, res) => {
  const { title, questions } = req.body;

  try {
    const parsed = questions.split('\n').map(line => {
      const [q, a] = line.split('|');
      return { question: q.trim(), answer: a?.trim() || '' };
    });

    await QuestionSet.update(
      { title, questions: JSON.stringify(parsed) },
      { where: { id: req.params.id } }
    );

    res.json({ success: true, message: 'Question set updated' });
  } catch (err) {
    console.error('Error updating:', err);
    res.status(500).json({ success: false, message: 'Error updating question set' });
  }
};


export const deleteQuestionSet= async (req, res) => {
  try {
    await QuestionSet.destroy({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Question set deleted' });
  } catch (err) {
    console.error('Error deleting:', err);
    res.status(500).json({ success: false, message: 'Error deleting question set' });
  }
};

export const viewResults = async (req, res) => {
  try {
    const questionSets = await QuestionSet.findAll({ where: { recruiterId: req.session.user.id } });

    const results = [];

    for (const set of questionSets) {
      const correctQuestions = JSON.parse(set.questions);

      const allAnswers = await CandidateAnswer.findAll({
        where: { questionSetId: set.id },
        include: [{ model: User, as: 'candidate' }]
      });

      const grouped = {};

      allAnswers.forEach(ans => {
        if (!grouped[ans.candidateId]) {
          grouped[ans.candidateId] = {
            candidate: ans.candidate,
            total: correctQuestions.length,
            correct: 0,
          };
        }

        const original = correctQuestions.find(q => q.question === ans.question);
        if (original && original.answer.trim().toLowerCase() === ans.answer.trim().toLowerCase()) {
          grouped[ans.candidateId].correct++;
        }
      });

      for (const id in grouped) {
        results.push({
          questionSetTitle: set.title,
          candidate: {
            id: grouped[id].candidate.id,
            name: grouped[id].candidate.name,
            email: grouped[id].candidate.email,
          },
          totalQuestions: grouped[id].total,
          correctAnswers: grouped[id].correct,
          scorePercentage: ((grouped[id].correct / grouped[id].total) * 100).toFixed(2)
        });
      }
    }

    return res.status(200).json({ success: true, results });
  } catch (err) {
    console.error(' Error generating results:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate results.' });
  }
};