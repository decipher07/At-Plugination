import express, { Router } from "express";
import { createEntryInCollect } from "../controllers/collect.service.controller"

const router : Router = express.Router();

router.post('/create', createEntryInCollect );

export = router;