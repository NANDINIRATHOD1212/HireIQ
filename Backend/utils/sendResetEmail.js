import nodemailer from 'nodemailer';

const sendResetEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"HireIQ Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'HireIQ Password Reset OTP',
    html: `
      <p>Hi there,</p>
      <p>You requested to reset your password. Here’s your OTP:</p>
      <h2>${otp}</h2>
      <p>This OTP is valid for <strong>10 minutes</strong>.</p>
      <p>If you didn’t request this, you can ignore this email.</p>
      <br>
      <p>Regards,<br>HireIQ Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendResetEmail;
