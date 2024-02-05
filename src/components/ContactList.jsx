import Contact from './Contact';

import firestore from '../firestore';
import {
  doc,
  onSnapshot,
  // collection,
  // query,
  // where,
  // orderBy,
  getDoc,
} from 'firebase/firestore';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

import './ContactList.scss';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    let unsubscribe;
    const fetchContacts = async () => {
      try {
        const userDocRef = doc(firestore, 'users', user);

        unsubscribe = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            const contacts = snapshot.data().contacts;
            const contactsArray = contacts.map((user) => ({ name: user }));
            setContacts(contactsArray);
          }
        });
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      }
    };

    fetchContacts();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  return (
    <div className="contact-list">
      {contacts.map((contact, index) => (
        <Contact key={index} name={contact.name} />
      ))}
    </div>
  );
};

export default ContactList;
