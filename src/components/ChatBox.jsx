/* eslint-disable react/prop-types */
import { useState } from 'react';
import axiosInstance from '../api';
import emojiData from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

import './ChatBox.scss';

const ChatBox = ({ conversationId, sender, contact }) => {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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
      console.log(data);

      const response = await axiosInstance.put('/api/message', data);
      console.log(response);
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
        <button onClick={handleSendMessage}>Send</button>
      </div>
      {showEmojiPicker && (
        <Picker data={emojiData} onEmojiSelect={handleEmojiSelect} />
      )}
    </div>
  );
};

export default ChatBox;
