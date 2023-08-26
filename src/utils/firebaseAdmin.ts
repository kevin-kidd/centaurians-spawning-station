import * as admin from "firebase-admin";
import { env } from "../env/server.mjs";
import type { Database } from "firebase-admin/lib/database/database";

const APP_NAME = "TournamentApp";

let firebaseApp: admin.app.App;
let firebaseDatabase: Database;

function initializeFirebase() {
  if (!admin.apps.some((app) => app?.name === APP_NAME)) {
    firebaseApp = admin.initializeApp(
      {
        credential: admin.credential.cert({
          projectId: env.FIREBASE_projectId,
          clientEmail: env.FIREBASE_client_email,
          privateKey: env.FIREBASE_private_key.replace(/\\n/g, "\n"),
        }),
        databaseURL: env.FIREBASE_databaseURL,
      },
      APP_NAME
    );
  } else {
    firebaseApp = admin.app(APP_NAME);
  }
}

function getFirebaseDatabase() {
  if (!firebaseDatabase) {
    firebaseDatabase = firebaseApp.database();
  }
  return firebaseDatabase;
}

// Initialize Firebase
initializeFirebase();

export function getDatabaseInstance() {
  return getFirebaseDatabase();
}
