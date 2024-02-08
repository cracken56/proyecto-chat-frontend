import { useState } from 'react';
import './AddContact.scss';
import AddContactPopup from './AddContactPopup';

const AddContact = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
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
