import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken';
import { sendEmail } from '../services/mail.service.js';
import redis from '../config/cache.js';

export async function register(req, res) {

    const { username, email, password } = req.body;

    const existingUser = await userModel.findOne({
        $or: [
            { email },
            { username }
        ]
    });


    if (existingUser) {
        return res.status(400).json({
            message: "Email or username already in use",
            success: false,
            err: "User already exists"
        });
    }

    const user = await userModel.create({
        username,
        email,
        password
    });

    const emailVerificationToken = jwt.sign({
        email: user.email,
    },
        process.env.JWT_SECRET);

    // Send a welcome email
    await sendEmail({
        to: user.email,
        subject: "Welcome to Our App",
        html: `
        <p>Hi ${user.username},</p>
        <p>Thank you for registering with our Perplexity! We're excited to have you on board.</p>
        <p>Please verify your email by clicking the link below:</p>
        <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
        <p>If you did not create an account, please ignore this email.</p>
        <p>Best regards,<br/>The Perplexity Team</p>
        `

    });

    res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }

    })
}

export async function login(req, res) {

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "User not found"
        });
    }
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "Invalid email or password"
        });
    }

    if (!user.verified) {
        return res.status(400).json({
            message: "Email not verified",
            success: false,
            err: "Please verify your email before logging in"
        });
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email
    }, process.env.JWT_SECRET, { expiresIn: '7d' });


    res.cookie('token', token)

    res.status(200).json({
        message: "Login successful",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })


}

export async function logout(req, res) {

    const token = req.cookies.token;

    if (token) {
        await redis.set(token, Date.now().toString(), 'EX', 60 * 60);
    }

    res.clearCookie('token');

    return res.status(200).json({
        message: "User logged out successfully",
        success: true
    });
}

export async function verifyEmail(req, res) {

    const { token } = req.query;
    try {
        if (!token) {
            return res.status(400).json({
                message: "Verification token is missing",
                success: false,
                err: "Token is required"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid token",
                success: false,
                err: "User not found"
            });
        }


        if (user.verified) {
            return res.send(`
            <p>Hi ${user.username},</p>
            <p>Your email is already verified. You can log in to your account and start using our services.</p>
            <p>Best regards,<br/>The Perplexity Team</p>
            <a href="http://localhost:5173/login">Go to Login</a>
            `);
        }
        user.verified = true;

        await user.save();

        const htmlContent = `
         <p>Hi ${user.username},</p>
            <p>Your email has been successfully verified. You can now log in to your account and start using our services.</p>
            <p>Best regards,<br/>The Perplexity Team</p>
            <a href="http://localhost:5173/login">Go to Login</a>`;

        return res.send(htmlContent);

    } catch (err) {
        return res.status(400).json({
            message: "Email verification failed",
            success: false,
            err: err.message
        });
    }
}

export async function resendVerificationEmail(req, res) {

    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                success: false,
                err: "Email is required"
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false,
                err: "No user found with the provided email"
            });
        }

        if (user.verified) {
            return res.status(400).json({
                message: "Email already verified",
                success: false,
                err: "Your email is already verified"
            });
        }

        const emailVerificationToken = jwt.sign({
            email: user.email,
        },
            process.env.JWT_SECRET);

        await sendEmail({
            to: user.email,
            subject: "Resend: Verify Your Email",
            html: `
        <p>Hi ${user.username},</p>
        <p>You requested a new verification email.</p>
        <p>Please verify your email by clicking the link below:</p>
        <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
        <p>If you did not create an account, please ignore this email.</p>
        <p>Best regards,<br/>The Perplexity Team</p>
        `

        });

        return res.status(200).json({
            message: "Verification email resent successfully",
            success: true
        });

    } catch (err) {
        return res.status(400).json({
            message: "Failed to resend verification email",
            success: false,
            err: err.message
        });
    }

}

export async function getMe(req, res) {

    const userId = req.user.id;

    const user = await userModel.findById(userId).select('-password');
    res.status(200).json({
        message: "User found",
        success: true,
        user
    });
}

