import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBdX6tOph4qAS76_lFKj1G6GZ1t3fKWebY',
  authDomain: 'resa-cpa.firebaseapp.com',
  projectId: 'resa-cpa',
  storageBucket: 'resa-cpa.appspot.com',
  messagingSenderId: '1071273318910',
  appId: '1:1071273318910:web:67d1fa804e79afec3f48af',
  measurementId: 'G-ESP07LKGMS',
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
