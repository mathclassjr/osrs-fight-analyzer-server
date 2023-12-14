import express, { Router } from "express";

import playersController from "../controllers/playersController.ts";

const router: Router = express.Router();

router.get('/test', function(req, res) {
    res.status(200).json({message: "Works!"});
})
router.get('/:playerName', playersController.getPlayerData);

export default router