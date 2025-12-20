import { initializeApp, getApps, cert, type App, type ServiceAccount } from "firebase-admin/app";
import { getAuth, type DecodedIdToken } from "firebase-admin/auth";

let adminApp: App | undefined;

function getAdminApp(): App {
  if (adminApp) return adminApp;

  const existingApps = getApps();
  if (existingApps.length > 0 && existingApps[0]) {
    adminApp = existingApps[0];
    return adminApp;
  }

  const serviceAccount: ServiceAccount = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };

  adminApp = initializeApp({
    credential: cert(serviceAccount),
  });

  return adminApp;
}

export async function verifyIdToken(token: string): Promise<DecodedIdToken> {
  const app = getAdminApp();
  const auth = getAuth(app);
  return auth.verifyIdToken(token);
}

export async function getUserFromToken(authHeader: string | null): Promise<DecodedIdToken | null> {
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7);
  if (!token) {
    return null;
  }

  try {
    return await verifyIdToken(token);
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
