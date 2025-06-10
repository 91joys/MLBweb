// src/firebase/firebase-init.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDhRo41R7lPJn9ygsnw2Mo_gw5yMQlaacI",
  authDomain: "mlb-web-a67a3.firebaseapp.com",
  projectId: "mlb-web-a67a3",
  storageBucket: "mlb-web-a67a3.firebasestorage.app",
  messagingSenderId: "18880880524",
  appId: "1:18880880524:web:d422e98058d09e17c2c0a9",
  measurementId: "G-PS3QR31GGJ",
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// Firebase 各服務
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth, analytics };
