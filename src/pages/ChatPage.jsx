import ContactList from '../components/ContactList';
import Chat from '../components/Chat';

import './ChatPage.scss';

const ChatPage = () => {
  return (
    <div className="chat-page">
      <ContactList />
      <Chat />
    </div>
  );
};

export default ChatPage;
