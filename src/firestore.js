import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDzHQYXdQ-M1DB0ptU5PfAH3vpwVHBLz3E',
  authDomain: 'brave-server-401207.firebaseapp.com',
  projectId: 'brave-server-401207',
  storageBucket: 'brave-server-401207.appspot.com',
  messagingSenderId: '218939717929',
  appId: '1:218939717929:web:dd3e7b1f9f4bc2e3a95f38',
};

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export default firestore;
