import express from 'express';
import multer from 'multer';
import { getResume, saveParsedResume, uploadResume,downloadResume} from '../controllers/resumeController.js';
import { isCandidate } from '../middleware/authMiddleware.js';
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });


router.post('/upload', upload.single('resume'), uploadResume);
router.get('/download-resume', downloadResume);
router.get('/resume',isCandidate,getResume)
router.post('/saveresume',saveParsedResume)
export default router;
