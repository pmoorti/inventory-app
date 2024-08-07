// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxShH1kFDnZsR5oV95eBOd1E08PavgHiI",
  authDomain: "pantry-tracker-fd7a3.firebaseapp.com",
  projectId: "pantry-tracker-fd7a3",
  storageBucket: "pantry-tracker-fd7a3.appspot.com",
  messagingSenderId: "953102851598",
  appId: "1:953102851598:web:81be1da63047aff6a9665f",
  measurementId: "G-T8YS5PWRBJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}