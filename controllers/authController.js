import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';
import moment from 'moment';
import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';

const { User } = db;

export const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: 'Name, email, password, and confirmPassword are required.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = randomBytes(32).toString('hex');
    const verificationDeadline = moment().add(30, 'minutes').toDate();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      is_verified: false,
      verification_token: verificationToken,
      verification_deadline: verificationDeadline,
    });

    const verificationLink = `https://yourapp.com/verify?token=${verificationToken}`;

    // ✅ Use your fixed Mailtrap credentials
    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '3053bf6e834ff8', // your Mailtrap username
        pass: '378d0227ee763d'  // your Mailtrap password
      }
    });

    const mailOptions = {
      from: '"NoReply" <no-reply@yourapp.com>',
      to: email,
      subject: 'Verify Your Email Address',
      text: `Hello ${name},\n\nPlease verify your email by clicking the link below. This link will expire in 30 minutes:\n\n${verificationLink}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Verification email sent: ${info.messageId}`);

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
    });

  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ error: 'Error during registration.' });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    // Find the user with the matching token
    const user = await User.findOne({ where: { verification_token: token } });

    if (
      !user ||
      !user.verification_deadline ||
      new Date(user.verification_deadline) < new Date()
    ) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Clear verification fields and mark user as verified
    user.is_verified = true;
    user.verification_token = null;
    user.verification_deadline = null;
    await user.save();

    res.status(200).json({
      message: 'Email verified successfully',
    });
  } catch (err) {
    console.error('Error verifying email:', err);
    res.status(500).json({ message: 'Email verification failed. Please try again later.' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ message: 'User not found. Please register first.' });
    }

    // Check if the user is verified
    if (!user.is_verified) {
      return res.status(400).json({ message: 'Please verify your email first.' });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate OTP (Two-Factor Authentication)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();  // 6-digit OTP
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);  // OTP expires in 10 minutes

    // Store OTP and its expiration in the database
    user.otp = otp;
    user.otp_expires_at = otpExpiresAt;
    await user.save();  // Make sure to save the OTP and expiration time to the database

    // Create transporter using user-provided email and password for SMTP authentication
    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '3053bf6e834ff8', // your Mailtrap username
        pass: '378d0227ee763d'  // your Mailtrap password
      }
    });
    // Define the OTP email content
    const mailOptions = {
      from: `"NoReply" <dillan.gerhold69@ethereal.email>`,  // Sender email (fixed value)
      to: email,    // Send OTP to the user's email
      subject: 'Your OTP for Login',
      text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
    };

    // Send OTP email
    const info = await transporter.sendMail(mailOptions);
    console.log(`OTP sent: ${info.messageId}`);

    res.status(200).json({ message: 'OTP sent to your email. Please verify.' });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed. Try again later.' });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    // Check if the user exists, and if the OTP is valid and not expired
    if (!user || user.otp !== otp || new Date(user.otp_expires_at) < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // OTP is valid, so clear the OTP fields
    user.is_verified = true;  // Mark the user as verified
    user.otp = null;  // Clear the OTP
    user.otp_expires_at = null;  // Clear the OTP expiration time
    await user.save();  // Save the changes to the database

    // Generate JWT token after successful OTP verification
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',  // Token expiration time (1 hour)
    });

    // Store the token and its expiration in the database
    user.login_token = token;
    user.login_token_expires_at = new Date(Date.now() + 1 * 60 * 60 * 1000);  // Set the expiration time to 1 hour
    await user.save();  // Save the updated user data with the token

    // Respond with a success message and the generated JWT token
    res.status(200).json({ message: 'Logged in successfully', token });

  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ message: 'OTP verification failed. Please try again later.' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    // Step 1: Find the user by email
    const user = await User.findOne({ where: { email } });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Step 2: Generate a password reset token and expiration
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = moment().add(30, 'minutes').toDate();  // Token valid for 30 minutes

    // Step 3: Store token and expiration in the database
    user.verification_token = resetToken;
    user.verification_deadline = resetTokenExpiry;
    await user.save();

    // Step 4: Send password reset email
    const resetLink = `https://yourapp.com/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '3053bf6e834ff8', // your Mailtrap username
        pass: '378d0227ee763d'  // your Mailtrap password
      }
    });

    const mailOptions = {
      from: `"NoReply" <${process.env.EMAIL_SENDER}>`,
      to: email,
      subject: 'Password Reset Request',
      text: `Hello, \n\nWe received a request to reset your password. Please click the link below to reset your password. The link will expire in 30 minutes.\n\n${resetLink}`,
    };

    // Send the reset email
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Password reset email sent: ${info.messageId}`);
    console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

    res.status(200).json({
      message: 'Password reset email sent. Please check your inbox.',
    });

  } catch (err) {
    console.error('❌ Forgot password error:', err);
    res.status(500).json({ error: 'An error occurred while requesting password reset.' });
  }
};

export const verifyForgotPasswordToken = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const user = await User.findOne({ where: { verification_token: token } });

    if (
      !user ||
      !user.verification_deadline ||
      new Date(user.verification_deadline) < new Date()
    ) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.verification_token = null;
    user.verification_deadline = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ message: 'Password reset failed. Please try again later.' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }

    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'New passwords do not match.' });
    }

    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Old password is incorrect.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Failed to reset password.' });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    // Check if the authorization header exists and is in the correct format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing or malformed' });
    }

    const token = authHeader.split(' ')[1]; // Extract token from Bearer

    let decoded;

    // Verify the token
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Find the user associated with the token
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Clear token and expiration fields in the database
    user.login_token = null;
    user.login_token_expires_at = null;

    // Save the user record with the cleared token fields
    await user.save();

    return res.status(200).json({ message: 'Logged out successfully' });

  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ message: 'Logout failed' });
  }
};
