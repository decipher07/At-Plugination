import express, { Request, Response, Router } from "express";
import Logging from "../Library/logging";
import { getGoogleAuthURL, oauth2Client } from '../auth/utils'
import { appendSpreadSheetController, createSpreadSheetController } from "../controllers/sheet.service.controller";

const router : Router = express.Router();

router.post('/createspreadsheet', createSpreadSheetController);
router.post('/appenddataspreadsheet', appendSpreadSheetController);

export = router;