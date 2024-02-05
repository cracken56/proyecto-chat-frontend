import AddContact from '../components/AddContact';
import ShowRequests from '../components/ShowRequests';
import ContactList from '../components/ContactList';
import Chat from '../components/Chat';
import Notification from '../components/Notification';

import './ChatPage.scss';

const ChatPage = () => {
  return (
    <div className="chat-page">
      <div className="left-bar">
        <AddContact />
        <ShowRequests />
        <ContactList />
      </div>
      <Chat />
      <Notification />
    </div>
  );
};

export default ChatPage;
