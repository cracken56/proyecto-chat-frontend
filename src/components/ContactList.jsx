import Contact from './Contact';
import PropTypes from 'prop-types';

import firestore from '../firestore';
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  getDoc,
} from 'firebase/firestore';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const { username } = useAuth();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const userDocRef = doc(firestore, 'users', username);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const userContacts = userData.contacts || [];

          //TODO: get lastMessage in real time using onSnapshot here as well
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
        <Contact
          key={index}
          name={contact.name}
          lastMessage={contact.lastMessage}
        />
      ))}
    </div>
  );
};

ContactList.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      lastMessage: PropTypes.string,
    })
  ).isRequired,
};

export default ContactList;
