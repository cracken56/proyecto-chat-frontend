import Contact from './Contact';
import PropTypes from 'prop-types';
import Firestore from '@google-cloud/firestore';

const firestore = new Firestore({
  keyFilename: import.meta.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const ContactList = ({ contacts }) => {
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
      lastMessage: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ContactList;
