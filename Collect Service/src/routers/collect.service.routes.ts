import express, { Router } from "express";
import { createEntryInCollect, deleteEntryInCollect, readEntryInCollect, updateEntryInCollect } from "../controllers/collect.service.controller"

const router : Router = express.Router();

router.post('/create', createEntryInCollect);
router.get('/read/:response_id', readEntryInCollect);
router.patch('/update', updateEntryInCollect);
router.delete('/delete', deleteEntryInCollect);

export = router;