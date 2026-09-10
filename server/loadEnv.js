import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the absolute path to server/.env
const envPath = path.resolve(__dirname, '.env');
const envTxtPath = path.resolve(__dirname, '.env.txt');

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else if (fs.existsSync(envTxtPath)) {
  // Handle Windows notepad auto-appending .txt
  dotenv.config({ path: envTxtPath });
} else {
  // Fallback to default dotenv resolution
  dotenv.config();
}

export default process.env;
