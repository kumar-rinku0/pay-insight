import { configDotenv } from "dotenv";
if (process.env.NODE_ENV != "development") {
  configDotenv();
}

const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID || "";
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET || "";
const REDIRECT_URL = process.env.GOOGLE_OAUTH_REDIRECT_URL || "";

const getToken = async (code) => {
  const body = new URLSearchParams({
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URL,
    grant_type: "authorization_code",
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const error = await res.json();
    return error; // Returns the error response
  }

  return res.json(); // Returns the token response
};

export { getToken };
