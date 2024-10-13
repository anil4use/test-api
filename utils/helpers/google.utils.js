const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECTED_URL,
  GOOGLE_API_KEY
  
} = require("../../configs/server.config");

const { google } = require("googleapis");
const calender=google.calendar({
    version:"v3",
    auth:GOOGLE_API_KEY,
})

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECTED_URL
);

const scopes=['https://www.googleapis.com/auth/calendar']

const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  });

module.exports={url,oauth2Client,calender,GOOGLE_API_KEY};