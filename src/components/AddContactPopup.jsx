/* eslint-disable react/prop-types */
import { useState } from 'react';
import axiosInstance from '../api';
import { useAuth } from '../context/AuthContext';
import './AddContactPopup.scss';

const AddContactPopup = ({ onClose }) => {
  const [newContact, setNewContact] = useState('');
  const { user, setNotificationMessage } = useAuth();

  const handleInputChange = (e) => {
    setNewContact(e.target.value);
  };

  const handleAddContact = async () => {
    try {
      const response = await axiosInstance.post(
        `/api/${user}/contacts/requests/send/${newContact}`
      );

      if (response.data.success) {
        setNotificationMessage('Solicitud de contacto enviada.');
      }
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        let errorMsg;
        if (status === 409) {
          errorMsg = error.response.data.error;
        } else if (status === 400) {
          errorMsg = 'No puedes solicitar contacto a ti mismo.';
        } else if (status === 404) {
          errorMsg = 'El contacto no existe.';
        } else if (status === 500) {
          errorMsg = 'No se ha podido solicitar contacto.';
        }
        setNotificationMessage(errorMsg);
      }
    } finally {
      onClose();
      setNewContact('');
    }
  };

  return (
    <div className="contact-popup">
      <div className="popup-content">
        <h2>Añadir Contacto</h2>
        <input
          type="text"
          placeholder="Escribe su usuario"
          value={newContact}
          onChange={handleInputChange}
        />
        <div className="buttons">
          <button onClick={handleAddContact}>Añadir</button>
          <button onClick={onClose}>Salir</button>
        </div>
      </div>
    </div>
  );
};

export default AddContactPopup;
