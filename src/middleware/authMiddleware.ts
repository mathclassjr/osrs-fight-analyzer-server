import {NextFunction, Request, Response} from 'express'

async function authorization(req: Request, res: Response, next: NextFunction) {
    try {
        next();//all good to go
    } catch (err) {
        
    }
}

export default authorization