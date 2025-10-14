import { onCall } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();

// Minimal callable just to prove deploy works
export const ping = onCall(() => {
  return { ok: true, ts: Date.now() };
});
