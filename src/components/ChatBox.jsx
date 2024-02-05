/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axiosInstance from '../api';
import emojiData from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

import './ChatBox.scss';

const ChatBox = ({ conversationId, sender, contact }) => {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typing, setTyping] = useState(false);

  const handleMessageChange = (e) => {
    setText(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!text.trim()) return;
    setShowEmojiPicker(false);
    try {
      const data = {
        conversationId,
        message: { text, sender, readBy: { [sender]: true, [contact]: false } },
      };

      await axiosInstance.put('/api/message', data);
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 404) {
          console.log('La conversación no existe.');
        } else if (status === 500) {
          console.log('No se ha podido mandar el mensaje.');
        }
      }
    }

    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiButtonClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiSelect = (emoji) => {
    setText(text + emoji.native);
  };

  useEffect(() => {
    const sendTyping = async () => {
      try {
        await axiosInstance.put('/api/typing', {
          conversationId,
          user: sender,
          typing,
        });
      } catch (error) {
        if (error.response) {
          const { status } = error.response;
          if (status === 404) {
            console.log('La conversación no existe.');
          } else if (status === 500) {
            console.log('No se ha podido mandar el estado "escribiendo".');
          }
        }
      }
    };

    sendTyping();
  }, [conversationId, sender, typing]);

  useEffect(() => {
    text ? setTyping(true) : setTyping(false);
  }, [text]);

  return (
    <div className="chat-box">
      <div>
        <textarea
          type="text"
          value={text}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje..."
        />
        <button onClick={handleEmojiButtonClick}>😊</button>
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
      {showEmojiPicker && (
        <Picker data={emojiData} onEmojiSelect={handleEmojiSelect} />
      )}
    </div>
  );
};

export default ChatBox;
