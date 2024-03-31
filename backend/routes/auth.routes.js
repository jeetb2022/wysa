import { Router } from 'express';
import { signup, login, verifyToken, logout, } from '../controllers/auth.controller.js';
import verifyJWT from '../middlewares/auth.middlewares.js';

const authRouter = Router();

authRouter.route("/auth/signup").post(signup);
authRouter.route("/auth/verify").get(verifyJWT, verifyToken);
authRouter.route("/auth/logout").delete(verifyJWT, logout);
authRouter.route("/auth/login").post(login);

export default authRouter;
