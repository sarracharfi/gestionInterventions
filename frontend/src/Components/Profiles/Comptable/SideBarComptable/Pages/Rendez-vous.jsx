import React from 'react';
import './rendez-vous.css'; // contient seulement les styles de cette page

const RendezVous = () => {
  return (
    <div className="rendezvous-page">
      <iframe
        className="rendezvous-calendar"
        src="https://calendly.com/sarracharfi1999/comptable"
        title="Calendrier"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default RendezVous;
