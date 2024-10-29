import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDvXLsk1KYGNEB7Hd3mPsPHLT4aNbNVZ-c",
  authDomain: "matrix-todo-landing-page.firebaseapp.com",
  projectId: "matrix-todo-landing-page",
  storageBucket: "matrix-todo-landing-page.appspot.com",
  messagingSenderId: "663810537114",
  appId: "1:663810537114:web:d592f28709dfad0503d123",
  measurementId: "G-WG176B9QR4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics }; 