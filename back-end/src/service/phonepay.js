import { configDotenv } from "dotenv";
if (process.env.NODE_ENV != "development") {
  configDotenv();
}
import { StandardCheckoutClient, Env } from "pg-sdk-node";

const clientId = process.env.PHONEPAY_CLIENT_ID;
const clientSecret = process.env.PHONEPAY_SECRET_KEY;
const clientVersion = 1; //insert your client version here
const env = Env.SANDBOX; //change to Env.PRODUCTION when you go live

export const client = StandardCheckoutClient.getInstance(
  clientId,
  clientSecret,
  clientVersion,
  env
);
