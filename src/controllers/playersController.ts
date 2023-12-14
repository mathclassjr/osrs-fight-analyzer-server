import { Request, Response, NextFunction } from "express";

import namesDB from "../db/osrsNames.ts";
import { APIResponse } from "models/model";

async function getPlayerData(req: Request, res: Response,  next: NextFunction) {
    try {
        const {playerName} = req.params;

        console.log(req.params);

        const nameData = await namesDB.getNameIdByLowerName(playerName);

        const answer: APIResponse = {
            success: true,
            message: "Successfuly grabbed player data",
            data: nameData
        }

        res.status(200).json(answer);
    } catch (err) {
        next(err);
    }
}

export default {
    getPlayerData
};