/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Notification.scss';

const Notification = () => {
  const { notificationMessage, setNotificationMessage } = useAuth();
  useEffect(() => {
    let timer;

    if (notificationMessage) {
      timer = setTimeout(() => {
        setNotificationMessage(undefined);
      }, 5000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [notificationMessage]);

  return (
    <div>
      {notificationMessage && (
        <div className="notification">{notificationMessage}</div>
      )}
    </div>
  );
};

export default Notification;
