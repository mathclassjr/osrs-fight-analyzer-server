import express, {Express, NextFunction, Request, Response} from 'express';
import morgan from 'morgan';

import client from './db/client.ts';

import fightsRouter from './routes/fightsRoute.ts';
import usersRouter from './routes/usersRoutes.ts';
import playersRouter from './routes/playersRoute.ts';

import { QueryResult } from 'pg';
import { APIResponse } from 'models/model.ts';

const app: Express = express();

app.use(express.json({limit: '25mb'}));

app.use(morgan('combined'));

app.use("/api/v1/fights", fightsRouter);
app.use('/api/v1/user', usersRouter);
app.use('/api/v1/player', playersRouter);


app.get('/', function (req: Request, res: Response) {    
    res.status(200).json({
        message: "API Online!",
        success: true
    })
})

app.use(function (error: unknown, req: Request, res: Response, next: NextFunction) {
    console.log(error);        
    const errorResponse: APIResponse = {
        success: false,
        message: "An unknown error occured",
        error: String(error),
    }
    res.status(500).json(errorResponse);
})

app.listen(3000, async function() {
    console.log("Listening on port 3000");
    try {
        await client.connect();

        const {rows: [result]}: QueryResult = await client.query('SELECT NOW();');
        console.log('Database online:', result.now);
    } catch (err) {
        console.log("Error connecting to database", err);
    }
})