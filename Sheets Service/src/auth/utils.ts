import { google } from 'googleapis';
import { config } from '../config/config'

const oauth2Client = new google.auth.OAuth2(
    config.auth.clientId,
    config.auth.clientSecret,
    config.auth.redirectUri
);

const getGoogleAuthURL = () => {
    const scopes = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/spreadsheets'
    ];

    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: scopes
    });
}

export { oauth2Client, getGoogleAuthURL };