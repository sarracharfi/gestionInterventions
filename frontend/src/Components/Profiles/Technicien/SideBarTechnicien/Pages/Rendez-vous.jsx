import React from 'react';
import './rendez-vous.css';  

const RendezVousTechnicien = () => {
  return (
    <div className="rendezvous-page">
      <iframe
        className="rendezvous-calendar"
        src=" https://calendly.com/sarracharfi36/technicien"
        title="Calendrier"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default RendezVousTechnicien;
