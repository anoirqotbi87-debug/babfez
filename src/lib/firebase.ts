import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase project config
// You can get this from the Firebase Console: Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "AIzaSy_YOUR_API_KEY_HERE",
  authDomain: "babfez-project.firebaseapp.com",
  projectId: "babfez-project",
  storageBucket: "babfez-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
};

// Initialize Firebase only if it hasn't been initialized yet (avoids Next.js hot-reload issues)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
