import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import "./suivitechnicien.css";

// Configuration icône par défaut leaflet
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Composant pour recentrer la carte
function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 13, { animate: true });
    }
  }, [lat, lng, map]);
  return null;
}

const SuiviTechnicienClient = () => {
  const [userPosition, setUserPosition] = useState(null);
  const [techniciens, setTechniciens] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [selectedTechPosition, setSelectedTechPosition] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => setError("Erreur de géolocalisation : " + err.message),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError("Géolocalisation non supportée par ce navigateur.");
    }
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/technicien")
      .then((res) => setTechniciens(res.data))
      .catch((err) =>
        setError("Erreur chargement techniciens : " + err.message)
      );

    axios
      .get("http://localhost:3000/api/geoloc")
      .then((res) => setPositions(res.data))
      .catch((err) =>
        setError("Erreur chargement positions : " + err.message)
      );
  }, []);

  const handleSelectTech = (tech) => {
    setSelectedTech(tech);
    const pos = positions.find((p) => p.technicienId === tech.id);
    setSelectedTechPosition(
      pos?.latitude && pos?.longitude
        ? { lat: pos.latitude, lng: pos.longitude }
        : null
    );
  };

  const techsWithPositions = techniciens.map((tech) => {
    const pos = positions.find((p) => p.technicienId === tech.id);
    return {
      ...tech,
      latitude: pos?.latitude,
      longitude: pos?.longitude,
    };
  });

  return (
    <div className="suivi-container">
      <h2 className="suivi-title">📍 Suivi des Techniciens</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="suivi-content">
        {/* Liste des techniciens */}
        <div className="techniciens-list">
          <h3>Techniciens disponibles :</h3>
          <ul>
            {techsWithPositions.map((tech) => (
              <li key={tech.id}>
                <button
                  onClick={() => handleSelectTech(tech)}
                  className={selectedTech?.id === tech.id ? "selected" : ""}
                >
                  {tech.nom} {tech.prenom}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Carte à droite */}
        <div className="map-section">
          <div className="map-wrapper">
            {userPosition && (
              <MapContainer
                center={[userPosition.lat, userPosition.lng]}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <Marker position={[userPosition.lat, userPosition.lng]}>
                  <Popup>Vous êtes ici</Popup>
                </Marker>

                {techsWithPositions.map(
                  (tech) =>
                    tech.latitude &&
                    tech.longitude && (
                      <Marker
                        key={tech.id}
                        position={[tech.latitude, tech.longitude]}
                      >
                        <Popup>
                          Technicien: {tech.nom} {tech.prenom}
                        </Popup>
                      </Marker>
                    )
                )}

                {selectedTechPosition && (
                  <>
                    <RecenterMap
                      lat={selectedTechPosition.lat}
                      lng={selectedTechPosition.lng}
                    />
                    <Marker
                      position={[
                        selectedTechPosition.lat,
                        selectedTechPosition.lng,
                      ]}
                    >
                      <Popup>
                        Technicien sélectionné: {selectedTech.nom}{" "}
                        {selectedTech.prenom}
                      </Popup>
                    </Marker>
                  </>
                )}
              </MapContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuiviTechnicienClient;
