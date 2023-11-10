import PropTypes from 'prop-types';

const Contact = ({ name, lastMessage }) => {
  return (
    <div className="contact">
      <div className="contact-avatar">
        {/* You can place the contact's avatar here */}
      </div>
      <div className="contact-info">
        <h2>{name}</h2>
        <p>{lastMessage}</p>
      </div>
    </div>
  );
};

Contact.propTypes = {
  name: PropTypes.string.isRequired,
  lastMessage: PropTypes.string,
};

export default Contact;
