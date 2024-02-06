/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import firestore from '../firestore';
import { doc, onSnapshot } from 'firebase/firestore';
import axiosInstance from '../api';
import { useAuth } from '../context/AuthContext';
import './ShowRequestsPopup.scss';

const ShowRequestsPopup = ({ onClose, onPendingRequestUpdate }) => {
  const [sentRequests, setSentRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const { user, setNotificationMessage } = useAuth();

  useEffect(() => {
    let unsubscribe;
    const fetchRequests = async () => {
      try {
        const userDocRef = doc(firestore, 'users', user);

        unsubscribe = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            const pendingRequests = snapshot.data().contactRequests;
            setPendingRequests(pendingRequests);
            pendingRequests && onPendingRequestUpdate(pendingRequests.length);
            const sentRequests = snapshot.data().sentRequests;
            setSentRequests(sentRequests);
          }
        });
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      }
    };

    fetchRequests();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  const handleAccept = async (contact) => {
    try {
      const response = await axiosInstance.post(
        `/api/${user}/contacts/requests/accept/${contact}`
      );

      if (response.data.success) {
        setNotificationMessage('Solicitud de contacto aceptada.');
      }
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 404) {
          console.log('El contacto no existe.');
        } else if (status === 500) {
          console.log('No se ha podido aceptar la solicitud de contacto.');
        }
      }
    }
  };

  const handleDecline = async (contact) => {
    try {
      const response = await axiosInstance.post(
        `/api/${user}/contacts/requests/decline/${contact}`
      );

      if (response.data.success) {
        setNotificationMessage('Solicitud de contacto rechazada.');
      }
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 404) {
          console.log('El contacto no existe.');
        } else if (status === 500) {
          console.log('No se ha podido declinar la solicitud de contacto.');
        }
      }
    }
  };

  return (
    <div className="requests-popup">
      <div className="map">
        <h2>Solicitudes pendientes</h2>
        {pendingRequests?.map((contact) => (
          <div className="pending-contact" key={contact}>
            <span>{contact}</span>
            <button onClick={() => handleAccept(contact)}>Aceptar</button>
            <button onClick={() => handleDecline(contact)}>Rechazar</button>
          </div>
        ))}
        {(!pendingRequests || pendingRequests.length === 0) && (
          <span>Ninguna.</span>
        )}
      </div>
      <div className="map">
        <h2>Solicitudes enviadas</h2>
        {sentRequests?.map((contact) => (
          <div className="sent-contact" key={contact}>
            <span>{contact}</span>
          </div>
        ))}
        {(!sentRequests || sentRequests.length === 0) && <span>Ninguna.</span>}
      </div>
      <button className="close-button" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default ShowRequestsPopup;
