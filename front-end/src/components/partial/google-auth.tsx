const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID;
const REDIRECT_URL = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URL;

const scopes = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
].join(" ");

const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

if (!REDIRECT_URL || !CLIENT_ID) {
  throw new Error(
    "Missing required environment variables: REDIRECT_URL, CLIENT_ID"
  );
}

const options = {
  redirect_uri: REDIRECT_URL,
  client_id: CLIENT_ID,
  response_type: "code",
  access_type: "offline",
  include_granted_scopes: "true", // Convert boolean to string
  scope: scopes,
};

const qs = new URLSearchParams(options);

export const authorizeUrl = `${rootUrl}?${qs.toString()}`;

// export const getToken = async (code: string) => {
//   const res = await axios.post(
//     "https://oauth2.googleapis.com/token",
//     {
//       code,
//       client_id: CLIENT_ID.toString(),
//       client_secret: CLIENT_SECRET.toString(),
//       redirect_uri: REDIRECT_URL.toString(),
//       grant_type: "authorization_code",
//     },
//     {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     }
//   );
//   return res.data;
// };
