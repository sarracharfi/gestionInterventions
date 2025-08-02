import React from 'react';
import './rendez-vous.css';  

const RendezVousClient = () => {
  return (
    <div className="rendezvous-page">
      <iframe
        className="rendezvous-calendar"
        src=" https://calendly.com/sarracharfi1999/client-1"
        title="Calendrier"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default RendezVousClient;
