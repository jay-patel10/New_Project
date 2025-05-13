import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';
import moment from 'moment';
import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
const { User, UserPermission, Permission } = db;

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
      isVerified: false,
      verificationToken,
      verificationDeadline,
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
    const user = await User.findOne({ where: { verificationToken: token } });

    if (
      !user ||
      !user.verificationDeadline ||
      new Date(user.verificationDeadline) < new Date()
    ) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Clear verification fields and mark user as verified
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationDeadline = null;
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
    if (!user.isVerified) {
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
    user.otpExpiresAt = otpExpiresAt;
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

    // Validate OTP and check expiration
    if (!user || user.otp !== otp || new Date(user.otpExpiresAt) < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Get all user permissions
    const userPermissions = await UserPermission.findAll({
      where: { userId: user.id },
      attributes: ['permissionId'],
    });

    let permissionIds = [];

    // Simplify logic to handle permission_id in different formats
    for (const record of userPermissions) {
      const raw = record.permissionId;

      if (Array.isArray(raw)) {
        permissionIds.push(...raw);  // Case 1: Already an array
      } else if (typeof raw === 'string') {
        try {
          // Case 2: Stringified array (JSON string)
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            permissionIds.push(...parsed);
          } else {
            throw new Error('Not an array');
          }
        } catch {
          // Case 3: Comma-separated string (Fallback)
          permissionIds.push(...raw.split(',').map(id => parseInt(id.trim(), 10)).filter(Boolean));
        }
      }
    }

    // Remove duplicates and log the final permissionIds
    permissionIds = [...new Set(permissionIds)];

    // Fetch permissions
    const permissions = await Permission.findAll({
      where: { id: permissionIds },
      attributes: ['name'],
    });

    const permissionNames = permissions.map(p => p.name);

    // Generate token
    const token = jwt.sign(
      {
        userId: user.id,
        permissions: permissionNames,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Save token and expiration time to user
    user.loginToken = token;
    user.loginTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration
    await user.save();

    res.status(200).json({
      message: 'OTP validated successfully, login successful',
      token,
      permissions: permissionNames,
    });

  } catch (err) {
    console.error('Bypass OTP login error:', err);
    res.status(500).json({ message: 'Bypass OTP login failed. Please try again later.' });
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
    const resetTokenExpiry = moment().add(30, 'minutes').toDate();

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Step 3: Send the reset email
    const resetLink = `https://yourapp.com/reset-password?token=${resetToken}`;

    // ✅ Send reset email via Mailtrap
    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '3053bf6e834ff8',
        pass: '378d0227ee763d',
      }
    });

    const mailOptions = {
      from: '"NoReply" <no-reply@yourapp.com>',
      to: email,
      subject: 'Password Reset Request',
      text: `Hello ${user.name},\n\nTo reset your password, click the link below (this link expires in 30 minutes):\n\n${resetLink}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Reset email sent: ${info.messageId}`);

    res.status(200).json({ message: 'Password reset link has been sent to your email.' });

  } catch (err) {
    console.error('Error sending reset email:', err);
    res.status(500).json({ error: 'Error sending password reset email. Please try again later.' });
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

    const user = await User.findOne({ where: { verificationToken: token } });

    if (
      !user ||
      !user.verification_deadline ||
      new Date(user.verificationDeadline) < new Date()
    ) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.verificationToken = null;
    user.verificationTeadline = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ message: 'Password reset failed. Please try again later.' });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required.' });
  }

  try {
    // Find the user by reset token
    const user = await User.findOne({ where: { resetToken: token } });

    // Validate the token and expiration
    if (!user || new Date(user.resetTokenExpiry) < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired reset token.' });
    }

    // Hash the new password and update the user record
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successful. You can now log in.' });

  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ error: 'Error resetting password. Please try again later.' });
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
    user.loginToken = null;
    user.loginTokenExpiresAt = null;

    // Save the user record with the cleared token fields
    await user.save();

    return res.status(200).json({ message: 'Logged out successfully' });

  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ message: 'Logout failed' });
  }
};
