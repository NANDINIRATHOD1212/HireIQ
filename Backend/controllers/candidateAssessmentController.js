import QuestionSet from '../models/QuestionSet.js';
import CandidateAnswer from '../models/CandidateAnswer.js';
import User from '../models/User.js'; 
import Job from '../models/Job.js';

export const showAvailableAssessments = async (req, res) => {
  try {
    const assessments = await QuestionSet.findAll({
      include: [
        {
          model: User,
          attributes: ['name', 'email', 'company']
        },
        {
          model: Job,
          attributes: ['title', 'location', 'description', 'type', 'salary', 'skillsRequired']
        }
      ]
    });

    res.status(200).json({ success: true, assessments });
  } catch (err) {
    console.error('Error loading assessments:', err);
    res.status(500).json({ success: false, message: 'Failed to load assessments' });
  }
};

// export const showAvailableAssessments= async (req, res) => {
//   try {
//     const assessments = await QuestionSet.findAll();
//     res.status(200).json({ success: true, assessments });
//   } catch (err) {
//     console.error('Error loading assessments:', err);
//     res.status(500).json({ success: false, message: 'Failed to load assessments' });
//   }
// };
export const viewSubmittedAnswers =  async (req, res) => {
  const candidateId = req.session.user.id;

  try {
    const answers = await CandidateAnswer.findAll({
      where: { candidateId },
      order: [['createdAt', 'DESC']]
    });

    const grouped = {};
    for (let ans of answers) {
      if (!grouped[ans.questionSetId]) {
        const set = await QuestionSet.findByPk(ans.questionSetId);
        grouped[ans.questionSetId] = {
          title: set?.title || 'Unknown',
          questions: []
        };
      }
      grouped[ans.questionSetId].questions.push({
        question: ans.question,
        answer: ans.answer
      });
    }

    res.status(200).json({ success: true, assessments: grouped });
  } catch (err) {
    console.error('Error loading submitted answers:', err);
    res.status(500).json({ success: false, message: 'Error loading answers' });
  }
};
