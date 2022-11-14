import express, { Router } from "express";
import { createEntryInCollect, readEntryInCollect } from "../controllers/collect.service.controller"

const router : Router = express.Router();

router.post('/create', createEntryInCollect );
router.get('/read/:response_id', readEntryInCollect);

export = router;