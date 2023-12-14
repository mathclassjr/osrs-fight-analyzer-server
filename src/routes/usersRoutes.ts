import express, { Router } from "express";

import usersController from '../controllers/usersController.ts'

const router: Router = express.Router();

router.post("/create", usersController.createUser)
    .get('/login', usersController.login);


export default router