import express, { Router } from "express";
import { getGoogleAuthURLController, redirectGoogleAuthController } from "../controllers/auth.service.controllers"

const router : Router = express.Router();

router.get('/', getGoogleAuthURLController);
router.get('/redirect', redirectGoogleAuthController);

export = router;