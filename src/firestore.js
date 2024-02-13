import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: 'AIzaSyDzHQYXdQ-M1DB0ptU5PfAH3vpwVHBLz3E',
//   authDomain: 'brave-server-401207.firebaseapp.com',
//   projectId: 'brave-server-401207',
//   storageBucket: 'brave-server-401207.appspot.com',
//   messagingSenderId: '218939717929',
//   appId: '1:218939717929:web:dd3e7b1f9f4bc2e3a95f38',
// };

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export default firestore;
