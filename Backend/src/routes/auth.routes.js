
import { Router } from 'express';
import { register,verifyEmail,login,getMe,resendVerificationEmail,logout} from '../controllers/auth.controller.js';
import { registerValidator ,loginValidator} from '../../validators/auth.validator.js';
import { authUser } from '../middleware/auth.middleware.js';

const authRouter = Router();

// POST /register
// → Create a new user account after validating input
// → Sends email verification link
authRouter.post('/register', registerValidator, register);

// GET /verify-email
// → Verify user's email using token from email
authRouter.get('/verify-email', verifyEmail);

// POST /resend-verification
// → Send a new verification email if user is not verified
authRouter.post('/resend-verification', resendVerificationEmail);

// POST /login
// → Authenticate user and return access token/session
authRouter.post('/login', loginValidator, login);

// GET /logout
// → Log out the currently authenticated user
authRouter.get('/logout',authUser,logout)

// GET /get-me
// → Get details of the currently logged-in user
authRouter.get('/get-me', authUser, getMe);


export default authRouter;