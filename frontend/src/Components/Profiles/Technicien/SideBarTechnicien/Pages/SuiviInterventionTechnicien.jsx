import React, { useEffect, useState } from "react";
import {
  getDemandesIntervention,        // Récupérer toutes les demandes
  updateDemandeIntervention,      // Mettre à jour une demande
} from "../../../../Services/userservice";

const STATUSES = ["Nouvelle", "En cours", "Reporté", "Terminé"];

const SuiviInterventionTechnicien = ({ technicienId }) => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [commentaire, setCommentaire] = useState("");
  const [statusUpdate, setStatusUpdate] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Récupérer toutes les demandes, puis filtrer celles assignées au technicien
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
    }
    fetchData();
  }, [technicienId]);

  const handleSelectDemande = (demande) => {
    setSelectedDemande(demande);
    setCommentaire(demande.commentaire || "");
    setStatusUpdate(demande.status || "Nouvelle");
  };

  const handleSaveUpdate = async () => {
    if (!selectedDemande) return;
    try {
      await updateDemandeIntervention(selectedDemande.id, {
        status: statusUpdate,
        commentaire: commentaire,
      });
      alert("Mise à jour enregistrée.");

      // Met à jour la liste localement
      setDemandes((prev) =>
        prev.map((d) =>
          d.id === selectedDemande.id
            ? { ...d, status: statusUpdate, commentaire }
            : d
        )
      );

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
        <table border="1" cellPadding="8" style={{ width: "100%", marginBottom: 20 }}>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Description</th>
              <th>Date Intervention</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {demandes.map((d) => (
              <tr key={d.id}>
                <td>{d.titre}</td>
                <td>{d.description}</td>
                <td>{d.dateIntervention ? d.dateIntervention.split("T")[0] : "-"}</td>
                <td>{d.status}</td>
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

      {/* Formulaire modification détail intervention */}
      {selectedDemande && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "600px",
            marginBottom: "30px",
          }}
        >
          <h3>Détail intervention : {selectedDemande.titre}</h3>
          <p><strong>Description :</strong> {selectedDemande.description}</p>
          <p><strong>Date intervention :</strong> {selectedDemande.dateIntervention ? selectedDemande.dateIntervention.split("T")[0] : "-"}</p>
          <p><strong>Client :</strong> {selectedDemande.client ? `${selectedDemande.client.nom} ${selectedDemande.client.prenom}` : "-"}</p>

          <label>
            Statut :
            <select
              value={statusUpdate}
              onChange={(e) => setStatusUpdate(e.target.value)}
              style={{ marginLeft: 10 }}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <br /><br />

          <label>
            Commentaires / Rapport d'intervention :
            <textarea
              rows={4}
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              placeholder="Ajouter un commentaire ou un rapport"
              style={{ width: "100%", marginTop: 8 }}
            />
          </label>

          <br />

          <button onClick={handleSaveUpdate} style={{ marginTop: 15 }}>
            Enregistrer la mise à jour
          </button>

          <button
            onClick={() => setSelectedDemande(null)}
            style={{ marginLeft: 10, marginTop: 15 }}
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  );
};

export default SuiviInterventionTechnicien;
