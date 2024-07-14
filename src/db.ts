import admin from "firebase-admin";
import { readFileSync } from "fs";

const svc = readFileSync("./service-acc.json", "utf-8");

admin.initializeApp({
  credential: admin.credential.cert('./service-acc.json'),
  databaseURL: "https://db-gamerzer-default-rtdb.asia-southeast1.firebasedatabase.app"
});

export const db = admin.database();
