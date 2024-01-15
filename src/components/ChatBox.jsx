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
    e.target.value ? setTyping(true) : setTyping(false);
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

      const response = await axiosInstance.put('/api/message', data);

      if (response.data.error) {
        const status = response.status;
        if (status === 404) {
          console.log('La conversación no existe.');
        } else if (status === 500) {
          console.log('No se ha podido mandar el mensaje.');
        }
      }
    } catch (error) {
      console.log(error);
    }

    // Clear the input field after sending the message
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiButtonClick = () => {
    // Toggle the visibility of the emoji picker
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiSelect = (emoji) => {
    // Append the selected emoji to the message text
    setText(text + emoji.native);
  };

  useEffect(() => {
    const sendTyping = async () => {
      try {
        const response = await axiosInstance.put('/api/typing', {
          conversationId,
          user: sender,
          typing,
        });

        if (response.data.error) {
          const status = response.status;
          if (status === 404) {
            console.log('La conversación no existe.');
          } else if (status === 500) {
            console.log('No se ha podido mandar el estado "escribiendo".');
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    sendTyping();
  }, [conversationId, sender, typing]);

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
