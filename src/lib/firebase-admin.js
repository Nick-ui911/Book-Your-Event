import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// This expects your FIREBASE_CREDENTIALS to be a stringified JSON object
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS || "{}");

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const adminAuth = getAuth();

export { adminAuth };
