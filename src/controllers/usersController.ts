import { Request, Response } from "express";

import { APIResponse } from "models/model";

async function createUser(req: Request, res: Response) {
    try {
        const {username, password, name} = req.body;
        const answer: APIResponse = {
            success: true,
            message: "Successfully created user",
            data: {
                username,
                name
            }
        }
        res.status(200).json(answer);
    } catch (err) {
        const error: APIResponse = {
            success: false,
            message: "There was an error attempting to create your user",
            error: String(err),
        }
        res.status(400).json(error);
    }
}

async function login(req: Request, res: Response) {
    try {
        const {username, password} = req.body;


        //TODO: hash password and search in user table
        const answer: APIResponse = {
            success: true,
            message: "Successfully logged in",
            data: {
                username,                
            }
        }
        res.status(200).json(answer);
    } catch (err) {
        const error: APIResponse = {
            success: false,
            message: "There was an error logging in",
            error: String(err),
        }
        res.status(400).json(error);
    }
}

export default {
    createUser,
    login
}