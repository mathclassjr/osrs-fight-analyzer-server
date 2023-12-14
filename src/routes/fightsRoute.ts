import express, { Router } from "express";

import fightController from '../controllers/fightsController.ts'

const router: Router = express.Router();

router.post("/", fightController.uploadFight);

router.get("/players/:playerName", fightController.getFights);

export default router