import PropTypes from 'prop-types';

import firestore from '../firestore';
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  // orderBy,
  // getDoc,
  getDocs,
} from 'firebase/firestore';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

import './Contact.scss';

const Contact = ({ name }) => {
  const [unreadAmount, setUnreadAmount] = useState(0);
  const [lastUnreadMessage, setLastUnreadMessage] = useState('');
  const { user, contact, setContact } = useAuth();

  useEffect(() => {
    let unsubscribe;
    const fetchUnreadMessages = async () => {
      try {
        const conversationsRef = collection(firestore, 'conversations');

        const condition1 = where(`participants.${user}`, '==', true);
        const condition2 = where(`participants.${name}`, '==', true);

        const conversationQuery = query(
          conversationsRef,
          condition1,
          condition2
        );

        const conversationsSnapshot = await getDocs(conversationQuery);

        if (!conversationsSnapshot.empty) {
          const conversation = conversationsSnapshot.docs[0];
          const conversationRef = doc(conversationsRef, conversation.id);

          unsubscribe = onSnapshot(conversationRef, (snapshot) => {
            const messages = snapshot.data().messages;
            const unreadMessages = messages
              .filter(
                (message) => message.readBy && message.readBy[user] === false
              )
              .sort((a, b) => b.timestamp - a.timestamp);

            setUnreadAmount(unreadMessages.length);
            setLastUnreadMessage(unreadMessages[0]?.text);
          });
        }
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
    };

    fetchUnreadMessages();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleClick = () => {
    setContact(name);

    //TODO: Set all messages to read
    // if (name == contact) {
    //   setUnreadAmount(0);
    // }
  };

  return (
    <button className="contact" onClick={handleClick}>
      <div className="contact-info">
        <h3>{name}</h3>
        <div className="unread-info">
          <span className="message">{lastUnreadMessage}</span>
          <span className="circle">{unreadAmount}</span>
        </div>
      </div>
    </button>
  );
};

Contact.propTypes = {
  name: PropTypes.string.isRequired,
  lastMessage: PropTypes.string,
};

export default Contact;
