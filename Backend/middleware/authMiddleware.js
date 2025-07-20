export const isRecruiter = (req, res, next) => {
  console.log('Session:', req.session.user);
      if (req.session?.user && req.session.user.role === 'recruiter') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied. Recruiter only.' });
  };
  
  export const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
      next();
    } else {
      res.status(403).send('Access denied');
    }
  };
  
  export const isCandidate = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'candidate') {
      next();
    } else {
      res.status(403).send('Access denied');
    }
  };
  
  