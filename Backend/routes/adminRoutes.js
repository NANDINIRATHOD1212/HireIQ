
import express from 'express';
import { showAdminAnalytics,getAllJobs,getAllUsers,updateJobById,deleteJobById,updateUserById,deleteUserById} from '../controllers/adminController.js';
import User from '../models/User.js';
const router = express.Router();


router.get('/admin/users', getAllUsers);
router.get('/admin/jobs', getAllJobs);

router.get('/admin/analytics', showAdminAnalytics);
router.put('/admin/jobs/:id', updateJobById); 
router.delete('/admin/jobs/:id', deleteJobById); 
router.put('/admin/users/:id', updateUserById); 
router.delete('/admin/users/:id', deleteUserById); 



router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

export default router;
