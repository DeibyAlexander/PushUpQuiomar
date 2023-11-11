import { Router } from "express";
import { register,login, logout } from "../controllers/auth.controllers.js";
import { checkVersionHeader } from "../libs/header.js";

const router = Router()

router.post('/register',checkVersionHeader, register)
router.post('/login',checkVersionHeader, login)
router.post('/logout',checkVersionHeader, logout)



export default router