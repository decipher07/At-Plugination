import express, { Router } from "express";
import { validateServiceController } from "../controllers/validate.service.controller";

const router : Router = express.Router();

router.post('/entry', validateServiceController);

export = router;