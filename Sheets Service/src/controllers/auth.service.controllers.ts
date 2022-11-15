import { Response, Request, NextFunction } from "express";
import { getGoogleAuthURL, oauth2Client } from '../auth/utils'
import Logging from "../Library/logging";

const getGoogleAuthURLController = ( req: Request, res: Response ) => {
    return res.redirect(getGoogleAuthURL());
}

const redirectGoogleAuthController = async ( req: Request, res: Response ) => {
    const code = req.query.code as string;

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.credentials = tokens;
    
        return res.status(200).json({ "success": true, "data": tokens, "message": null });
    } catch ( err: any ){
        Logging.error(err.message);
        return res.status(404).json({"success": false, "data": null, "message": "Error in redirecting"});
    }
}

export { getGoogleAuthURLController, redirectGoogleAuthController };