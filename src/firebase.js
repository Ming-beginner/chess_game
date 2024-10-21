// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAJF1aEugCkKCGxkzanijS0CEx7bxeT3-s',
  authDomain: 'onlinechessgame-1d280.firebaseapp.com',
  projectId: 'onlinechessgame-1d280',
  storageBucket: 'onlinechessgame-1d280.appspot.com',
  messagingSenderId: '131369149368',
  appId: '1:131369149368:web:13f1ae555ab63c18c6254d',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
