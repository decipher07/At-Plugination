import express, { Request, Response, Router } from "express";
import Logging from "../Library/logging";
import { getGoogleAuthURL, oauth2Client } from './utils'

const router : Router = express.Router();

router.get('/', ( req: Request, res: Response ) => {
    return res.redirect(getGoogleAuthURL())
})

router.get('/redirect', async ( req: Request, res: Response ) => {
    const code = req.query.code as string;

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.credentials = tokens;
    
        return res.status(200).json({ "success": true, "data": tokens, "message": null });
    } catch ( err: any ){
        Logging.error(err.message);
        return res.status(404).json({"success": false, "data": null, "message": "Error in redirecting"});
    }
})

export = router;