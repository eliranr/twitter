import { initializeApp, getApp, getApps } from "firebase/app";
import {getFireStore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "coins-651f8.firebaseapp.com",
  projectId: "coins-651f8",
  storageBucket: "coins-651f8.appspot.com",
  messagingSenderId: "131534638974",
  appId: "1:131534638974:web:3aa4bd1acbf7dbfbcfed2f"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFireStore();
const storage = getStorage();
export { app, db, storage };