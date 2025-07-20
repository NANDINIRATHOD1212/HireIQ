import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import Resume from '../models/Resume.js';
import pdfParse from 'pdf-parse';
import User from '../models/User.js';

const skillSet = JSON.parse(
  fs.readFileSync(path.resolve('data', 'skillKeywords.json'), 'utf-8')
);

export const uploadResume = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });

  const filePath = `uploads/${req.file.filename}`;
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized: User not logged in' });
  }

  try {
    const existingResume = await Resume.findOne({ where: { userId } });

    if (existingResume) {
      await existingResume.update({ filePath });
    } else {
      await Resume.create({ userId, filePath, extractedData: '' });
    }

    return res.status(200).json({ success: true, message: 'Resume uploaded successfully.', filePath });
  } catch (err) {
    console.error('Error saving resume:', err);
    return res.status(500).json({ success: false, message: 'Error saving resume.' });
  }
};


export const downloadResume = async (req, res) => {
  try {
    const userId = req.session?.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const resume = await Resume.findOne({ where: { userId } });
    if (!resume || !resume.filePath) {
      return res.status(404).json({ success: false, message: 'No resume found.' });
    }

    const fullPath = path.resolve(resume.filePath);
    return res.download(fullPath);
  } catch (err) {
    console.error('Error downloading resume:', err);
    return res.status(500).json({ success: false, message: 'Error downloading resume.' });
  }
};


export const getResume = async (req, res) => {
  try {
    const userId = req.session?.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const resume = await Resume.findOne({ where: { userId } });
    const user = await User.findByPk(userId);

    if (!resume) {
      return res.status(200).json({ success: true, extractedData: '', user });
    }

    return res.status(200).json({
      success: true,
      extractedData: resume.extractedData,
      user,
      filePath: resume.filePath
    });

  } catch (err) {
    console.error('Error fetching resume:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ✅ Save parsed resume manually (optional)
export const saveParsedResume = async (req, res) => {
  const { extractedText } = req.body;

  if (!extractedText) {
    return res.status(400).json({ success: false, message: 'No resume content to save' });
  }

  try {
    const userId = req.session.user.id;

    const existingResume = await Resume.findOne({ where: { userId } });

    if (existingResume) {
      await existingResume.update({ extractedData: extractedText });
    } else {
      await Resume.create({ userId, filePath: '', extractedData: extractedText });
    }

    res.status(200).json({ success: true, message: 'Resume saved to database successfully.' });
  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(500).json({ success: false, message: 'Failed to save resume.' });
  }
};

// ✅ Get all candidates with resume info
export const getCandidatesWithResume = async (req, res) => {
  try {
    const candidates = await User.findAll({
      where: { role: 'candidate' },
      include: [{ model: Resume, as: 'resume' }]
    });

    res.json({ success: true, candidates });
  } catch (err) {
    console.error('Error fetching candidates:', err);
    res.status(500).json({ success: false, message: 'Error fetching candidates' });
  }
};
