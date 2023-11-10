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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export default firestore;
