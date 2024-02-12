import firestore from '../firestore';
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import ChatBox from './ChatBox';
import CharmTickDouble from './CharmTickDouble';
import CharmTick from './CharmTick';
import axiosInstance from '../api';

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
            if (!messages) return;
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

  useEffect(() => {
    updateRead();
  }, [user, conversation, messages]);

  const updateRead = async () => {
    if (!conversation || !user) return;

    try {
      const requestData = {
        conversationId: conversation,
        updateRead: { reader: user },
      };

      await axiosInstance.put('/api/message', requestData);
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 500) {
          console.log('No se han podido actualizar los leídos.');
        }
      }
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
    adjustChatContactWidth();
  }, [messages]);

  const adjustChatContactWidth = () => {
    const bubbleElements = document.querySelectorAll('.bubble');

    bubbleElements.forEach((bubble) => {
      const bubbleText = bubble.querySelector('.bubble-text');
      if (bubbleText) {
        const numChars = bubbleText.textContent.length;
        const charWidth = 8;
        let bubbleWidth = numChars * charWidth;

        const maxWidth = window.innerHeight * 0.5;
        const minWidth = 51;
        bubbleWidth = Math.max(minWidth, Math.min(bubbleWidth, maxWidth));

        bubble.style.maxWidth = `${bubbleWidth}px`;
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
                  <div className="bubble-text">{message.text}</div>
                  <div className="bubble-info">
                    <div className="timestamp">
                      {format(new Date(message.timestamp), 'HH:mm')}
                    </div>
                    <div className="bubble-read">
                      {message.sender !== contact &&
                        (message.sender === user && message.readBy[contact] ? (
                          <CharmTickDouble />
                        ) : (
                          <CharmTick />
                        ))}
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
