import { useState } from 'react';
import './AddContact.scss';
import AddContactPopup from './AddContactPopup';

const AddContact = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);

  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  return (
    <div>
      <button className="add-contact-button" onClick={openPopup}>
        Añadir Contacto
      </button>

      {isPopupOpen && <AddContactPopup onClose={closePopup} />}
    </div>
  );
};

export default AddContact;
