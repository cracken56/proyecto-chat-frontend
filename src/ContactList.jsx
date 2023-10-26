import Contact from './Contact';
import PropTypes from 'prop-types';
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
