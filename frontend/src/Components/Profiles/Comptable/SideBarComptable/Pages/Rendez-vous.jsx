import React from 'react';
import './rendez-vous.css';  

const RendezVous = () => {
  return (
    <div className="rendezvous-page">
      <iframe
        className="rendezvous-calendar"
        src="https://calendly.com/ghofranxmanaii/comptable"
        title="Calendrier"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default RendezVous;
