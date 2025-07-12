import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Geolocalisation.css";
import L from "leaflet";
import axios from "axios";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const Geolocalisation = () => {
  const [position, setPosition] = useState(null); // position utilisateur actuel
  const [techniciens, setTechniciens] = useState([]); // liste positions techniciens
  const [error, setError] = useState("");

  useEffect(() => {
    // Récupération position utilisateur (technicien courant)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          setError("Erreur de géolocalisation : " + err.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setError("Géolocalisation non supportée par ce navigateur.");
    }
  }, []);

  useEffect(() => {
    // Récupérer positions de tous les techniciens depuis le backend (route corrigée)
    const fetchTechnicians = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/geoloc");
        setTechniciens(res.data); // adapter selon la structure reçue
      } catch (err) {
        setError("Erreur lors du chargement des positions : " + err.message);
      }
    };

    fetchTechnicians();
  }, []);

  return (
    <div className="geolocalisation-container">
      <h2>Géolocalisation Technicien</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!error && !position && <p>Recherche de votre position...</p>}

      {position && (
        <>
          <p>
            <strong>Votre position :</strong> {position.lat.toFixed(6)} ,{" "}
            {position.lng.toFixed(6)}
          </p>

          <MapContainer
            center={[position.lat, position.lng]}
            zoom={13}
            style={{ height: "400px", width: "100%", marginTop: 20 }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Marker position utilisateur */}
            <Marker position={[position.lat, position.lng]}>
              <Popup>Vous êtes ici</Popup>
            </Marker>

            {/* Markers pour tous les techniciens */}
            {techniciens.map((tech) => (
              <Marker
                key={tech.id}
                position={[tech.latitude, tech.longitude]}  
              >
                <Popup>
                  Technicien: {tech.nom} <br />
                  Position actuelle
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </>
      )}
    </div>
  );
};

export default Geolocalisation;
