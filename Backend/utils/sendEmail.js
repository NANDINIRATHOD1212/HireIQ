import nodemailer from 'nodemailer'

const sendVerificationEmail = async (toEmail, name, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Your OTP for Email Verification',
    html: `<p>Hello <b>${name}</b>,</p><p>Your OTP is: <b>${otp}</b></p><p>This OTP will expire in 5 minutes.</p>`
  };

  await transporter.sendMail(mailOptions);
};

export default sendVerificationEmail;
