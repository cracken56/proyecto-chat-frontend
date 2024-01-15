import Contact from './Contact';

import firestore from '../firestore';
import {
  doc,
  // onSnapshot,
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
    const fetchContacts = async () => {
      try {
        const userDocRef = doc(firestore, 'users', user);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const userContacts = userData.contacts || [];

          const contactsArray = userContacts.map((user) => ({ name: user }));

          setContacts(contactsArray);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  return (
    <div className="contact-list">
      {contacts.map((contact, index) => (
        <Contact key={index} name={contact.name} />
      ))}
    </div>
  );
};

export default ContactList;
