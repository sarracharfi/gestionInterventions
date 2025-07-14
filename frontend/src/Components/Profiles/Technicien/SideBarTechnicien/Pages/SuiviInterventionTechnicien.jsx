import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import {
  getDemandesIntervention,
  updateDemandeIntervention,
} from "../../../../Services/userservice";
import "./suiviInterventionTechnicien.css";

const STATUSES = ["Nouvelle", "En cours", "Reporté", "Terminé"];

const SuiviInterventionTechnicien = ({ technicienId }) => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [commentaire, setCommentaire] = useState("");
  const [statutUpdate, setStatutUpdate] = useState("Nouvelle");

  // Socket.io
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000"); // Adapt URL à ton backend

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, [technicienId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const allDemandes = await getDemandesIntervention();
      const demandesTech = allDemandes.filter(
        (d) => d.technicienId === technicienId
      );
      setDemandes(demandesTech);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemande = (demande) => {
    setSelectedDemande(demande);
    setCommentaire(demande.commentaire || "");
    setStatutUpdate(demande.statut || "Nouvelle");
  };

  const handleSaveUpdate = async () => {
    if (!selectedDemande) return;
    try {
      await updateDemandeIntervention(selectedDemande.id, {
        statut: statutUpdate,
        commentaire: commentaire,
      });

      // Mise à jour locale
      setDemandes((prev) =>
        prev.map((d) =>
          d.id === selectedDemande.id
            ? { ...d, statut: statutUpdate, commentaire }
            : d
        )
      );

      // Envoi événement WebSocket au serveur
      socketRef.current.emit("updateStatus", {
        demandeId: selectedDemande.id,
        nouveauStatus: statutUpdate,
        titre: selectedDemande.titre,
        technicienId: technicienId,
      });

      alert("Mise à jour enregistrée.");

      setSelectedDemande(null);
    } catch (err) {
      alert("Erreur lors de la mise à jour");
      console.error(err);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="suivi-intervention-technicien">
      <h2>Mes Interventions assignées</h2>
      {demandes.length === 0 ? (
        <p>Aucune intervention assignée pour le moment.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Description</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {demandes.map((d) => (
              <tr key={d.id}>
                <td>{d.titre}</td>
                <td>{d.description}</td>
                <td>{d.dateIntervention?.split("T")[0] || "-"}</td>
                <td>{d.statut}</td>
                <td>
                  <button onClick={() => handleSelectDemande(d)}>
                    Voir / Modifier
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedDemande && (
        <div className="update-form">
          <h3>Modifier : {selectedDemande.titre}</h3>
          <label>Statut :</label>
          <select
            value={statutUpdate}
            onChange={(e) => setStatutUpdate(e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <label>Commentaire :</label>
          <textarea
            rows={4}
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
          />

          <button onClick={handleSaveUpdate}>Enregistrer</button>
          <button onClick={() => setSelectedDemande(null)}>Annuler</button>
        </div>
      )}
    </div>
  );
};

export default SuiviInterventionTechnicien;
