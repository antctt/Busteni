import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB3xw-2CcOSjQjBN6Rx96nSsdLfVczRTCc",
    authDomain: "busteni-2.firebaseapp.com",
    projectId: "busteni-2",
    storageBucket: "busteni-2.appspot.com",
    messagingSenderId: "355911478784",
    appId: "1:355911478784:web:12e29c99a3b18b4e8832e5"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize authentication and Firestore
const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
