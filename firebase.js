// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBD8Cikz2sD1bgRy1oPLjTltDbqBlJdUIE",
    authDomain: "dumy-9ee0a.firebaseapp.com",
    projectId: "dumy-9ee0a",
    storageBucket: "dumy-9ee0a.firebasestorage.app",
    messagingSenderId: "816403449823",
    appId: "1:816403449823:android:639e0056e8df9055baa66a"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };