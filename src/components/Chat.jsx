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

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import ChatBox from './ChatBox';

import './Chat.scss';

const Chat = () => {
  const chatContainerRef = useRef();
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [conversation, setConversation] = useState(undefined);
  const { user, contact } = useAuth();

  useEffect(() => {
    let unsubscribe;
    const fetchMessages = async () => {
      try {
        const conversationsRef = collection(firestore, 'conversations');

        const condition1 = where(`participants.${user}`, '==', true);
        const condition2 = where(`participants.${contact}`, '==', true);

        const conversationQuery = query(
          conversationsRef,
          condition1,
          condition2
        );

        const conversationsSnapshot = await getDocs(conversationQuery);

        if (!conversationsSnapshot.empty) {
          const conversation = conversationsSnapshot.docs[0];
          const conversationRef = doc(conversationsRef, conversation.id);
          setConversation(conversationRef.id);

          unsubscribe = onSnapshot(conversationRef, (snapshot) => {
            const messages = snapshot.data().messages;
            const typing = snapshot.data().typing[contact];
            setMessages(messages);
            setTyping(typing);
          });
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, contact]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    adjustChatContactWidth();
    //TODO: make this scroll to latest unread in the future(?)
    scrollToBottom();
  }, [messages]);

  const adjustChatContactWidth = () => {
    const chatContactElements = document.querySelectorAll('.chat-contact');

    chatContactElements.forEach((contactElement) => {
      const bubbleTextElement = contactElement.querySelector('.bubble-text');
      const timestampTextElement = contactElement.querySelector('.timestamp');
      if (bubbleTextElement && timestampTextElement) {
        const textWidth = bubbleTextElement.offsetWidth;
        const timestampWidth = timestampTextElement.offsetWidth;
        contactElement.style.maxWidth = `${textWidth + timestampWidth + 40}px`;
      }
    });

    const chatUserElements = document.querySelectorAll('.chat-user');

    chatUserElements.forEach((userElement) => {
      const bubbleTextElement = userElement.querySelector('.bubble-text');
      const timestampTextElement = userElement.querySelector('.timestamp');
      if (bubbleTextElement && timestampTextElement) {
        const textWidth = bubbleTextElement.offsetWidth;
        const timestampWidth = timestampTextElement.offsetWidth;
        userElement.style.maxWidth = `${textWidth + timestampWidth + 40}px`;
      }
    });
  };

  return (
    <div className="chat-window">
      {conversation ? (
        <>
          <div className="chat" ref={chatContainerRef}>
            {messages.map((message) => (
              <div
                key={message.timestamp}
                className={
                  message.sender === contact ? 'chat-contact' : 'chat-user'
                }
              >
                <div className="bubble">
                  <div className="bubble-body">
                    <div className="bubble-text">{message.text}</div>
                    <div className="timestamp">
                      {format(new Date(message.timestamp), 'HH:mm')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {typing && (
            <span className="typing">{contact} está escribiendo...</span>
          )}
          <ChatBox
            conversationId={conversation}
            sender={user}
            contact={contact}
          />
        </>
      ) : (
        <span className="hint">Selecciona un chat.</span>
      )}
    </div>
  );
};

export default Chat;
