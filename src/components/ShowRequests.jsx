import { useState } from 'react';
import ShowRequestsPopup from './ShowRequestsPopup';

import './ShowRequests.scss';

const ShowRequests = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(undefined);

  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
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
