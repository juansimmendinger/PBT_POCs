import * as dotenv from 'dotenv'

dotenv.config();

export const CORS_DOMAINS = process.env.CORS_DOMAINS || 'https://nfc-pbt.web.app'