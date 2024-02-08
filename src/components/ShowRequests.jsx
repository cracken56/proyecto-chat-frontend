import { useState } from 'react';
import ShowRequestsPopup from './ShowRequestsPopup';

import './ShowRequests.scss';

const ShowRequests = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(undefined);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handlePendingRequestUpdate = (pendingRequests) => {
    setPendingRequests(pendingRequests);
  };

  return (
    <div>
      <button className="show-requests-button" onClick={openPopup}>
        {pendingRequests
          ? `Mostrar Solicitudes (${pendingRequests})`
          : 'Mostrar Solicitudes'}
      </button>

      {isPopupOpen && (
        <ShowRequestsPopup
          onClose={closePopup}
          onPendingRequestUpdate={handlePendingRequestUpdate}
        />
      )}
    </div>
  );
};

export default ShowRequests;
