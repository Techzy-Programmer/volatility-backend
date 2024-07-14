import admin from "firebase-admin";
import { readFileSync } from "fs";

const svc = readFileSync("./service-acc.json", "utf-8");


admin.initializeApp({
  credential: admin.credential.cert(svc)
});

const db = admin.firestore();

async function updateStatus(userId: string, analysisId: string, status: string) {
  const docRef = db.collection('users').doc(userId);

  await docRef.get().then((doc) => {
    const val = doc.data();

  });

  await docRef.set({

  })
  
  const docRef2 = db.collection('test-col').doc('another-doc');

  await docRef2.get().then((doc) => {
    console.log("Document is:\n", doc.data());
  });
}

addData().catch(console.error);

