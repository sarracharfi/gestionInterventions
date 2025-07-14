import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import {
  getDemandesIntervention,
  createDemandeIntervention,
  updateDemandeIntervention,
  deleteDemandeIntervention,
  getClients,
} from "../../../../Services/userservice";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaFilePdf, FaEdit, FaTrash } from "react-icons/fa";
import "./demande.css";

// Statuts exacts côté backend (en minuscules et underscore)
const STATUSES = [
  { value: "en_attente", label: "En attente" },
  { value: "confirmee", label: "Confirmée" },
  { value: "terminee", label: "Terminée" },
  { value: "annulee", label: "Annulée" },
];

const Demande = () => {
  const [demandes, setDemandes] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterClient, setFilterClient] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");

  // Formulaire
  const [form, setForm] = useState({
    id: null,
    titre: "",
    description: "",
    dateIntervention: "",
    clientId: "",
    status: "en_attente",
  });

  // Socket.io client
  const socketRef = useRef(null);

  useEffect(() => {
    // Connexion au serveur Socket.IO (adapter URL si besoin)
    socketRef.current = io("http://localhost:3000");

    // Écoute événement 'statusChanged' venant du serveur
    socketRef.current.on("statusChanged", ({ demandeId, nouveauStatus, titre }) => {
      alert(`La demande "${titre}" a changé de statut : ${mapStatusToLabel(nouveauStatus)}`);

      // Mise à jour locale dans le tableau
      setDemandes((prev) =>
        prev.map((d) =>
          d.id === demandeId ? { ...d, status: nouveauStatus } : d
        )
      );
    });

    fetchData();

    // Déconnexion socket à la destruction du composant
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Fonction pour récupérer les données (clients + demandes)
  const fetchData = async () => {
    setLoading(true);
    try {
      const clientsData = await getClients();
      setClients(clientsData);

      const demandesData = await getDemandesIntervention();
      setDemandes(demandesData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Convertir valeur status backend en label visible
  const mapStatusToLabel = (statusValue) => {
    const found = STATUSES.find((s) => s.value === statusValue);
    return found ? found.label : statusValue || "-";
  };

  // Gestion formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.titre.trim()) return "Le titre est obligatoire.";
    if (!form.description.trim()) return "La description est obligatoire.";
    if (!form.clientId) return "Vous devez sélectionner un client.";
    if (!form.status) return "Le statut est obligatoire.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errMsg = validateForm();
    if (errMsg) {
      setError(errMsg);
      return;
    }
    setError("");

    const demandeData = {
      titre: form.titre.trim(),
      description: form.description.trim(),
      clientId: form.clientId,
      status: form.status,
    };
    if (form.dateIntervention) {
      demandeData.dateIntervention = form.dateIntervention;
    }

    try {
      if (editMode) {
        await updateDemandeIntervention(form.id, demandeData);
        alert("Demande mise à jour !");

        // Émettre l'événement socket pour informer les autres clients
        socketRef.current.emit("updateStatus", {
          demandeId: form.id,
          nouveauStatus: demandeData.status,
          titre: form.titre,
        });

      } else {
        await createDemandeIntervention(demandeData);
        alert("Demande créée !");
      }
      await fetchData();
      resetForm();
      setFormVisible(false);
    } catch (err) {
      console.error("Erreur création demande :", err.response?.data);
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement");
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      titre: "",
      description: "",
      dateIntervention: "",
      clientId: "",
      status: "en_attente",
    });
    setEditMode(false);
    setError("");
  };

  const handleEdit = (demande) => {
    setForm({
      id: demande.id,
      titre: demande.titre,
      description: demande.description,
      dateIntervention: demande.dateIntervention
        ? demande.dateIntervention.split("T")[0]
        : "",
      clientId: demande.client ? demande.client.id : "",
      status: demande.status || "en_attente",
    });
    setEditMode(true);
    setError("");
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette demande ?")) return;
    try {
      await deleteDemandeIntervention(id);
      setDemandes((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      alert("Erreur suppression");
      console.error(err);
    }
  };

  const demandesFiltres = demandes.filter((d) => {
    if (!filterClient.trim()) return true;
    if (!d.client) return false;
    const fullName = `${d.client.nom} ${d.client.prenom}`.toLowerCase();
    return fullName.includes(filterClient.trim().toLowerCase());
  });

  // Générer PDF
  const generatePDFForDemande = (demande) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Détails de la Demande d'Intervention", 14, 20);
    doc.setFontSize(12);
    doc.text(`Titre: ${demande.titre}`, 14, 40);
    doc.text(`Description: ${demande.description}`, 14, 50);
    doc.text(
      `Date intervention: ${
        demande.dateIntervention ? demande.dateIntervention.split("T")[0] : "-"
      }`,
      14,
      60
    );
    doc.text(
      `Client: ${
        demande.client ? `${demande.client.nom} ${demande.client.prenom}` : "-"
      }`,
      14,
      70
    );
    doc.text(`Statut: ${mapStatusToLabel(demande.status)}`, 14, 80);
    doc.save(`demande_${demande.id}.pdf`);
  };

  if (loading)
    return (
      <p className="text-muted" style={{ textAlign: "center", marginTop: 50 }}>
        Chargement...
      </p>
    );

  return (
    <div className="demande-container">
      <h2>Gestion des Demandes d'Intervention</h2>

      <input
        type="text"
        placeholder="Filtrer par nom client"
        value={filterClient}
        onChange={(e) => setFilterClient(e.target.value)}
        className="filter-input"
      />

      <h3 className="section-title">Liste des demandes</h3>
      {demandesFiltres.length === 0 ? (
        <p className="text-muted">Aucune demande trouvée.</p>
      ) : (
        <table className="demande-table" border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Description</th>
              <th>Date intervention</th>
              <th>Client</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {demandesFiltres.map((d) => (
              <tr key={d.id}>
                <td>{d.titre}</td>
                <td>{d.description}</td>
                <td>{d.dateIntervention ? d.dateIntervention.split("T")[0] : "-"}</td>
                <td>{d.client ? `${d.client.nom} ${d.client.prenom}` : "-"}</td>
                <td>{mapStatusToLabel(d.status)}</td>
                <td
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "center",
                  }}
                >
                  <button
                    className="action-button edit"
                    onClick={() => handleEdit(d)}
                    title="Modifier"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="action-button delete"
                    onClick={() => handleDelete(d.id)}
                    title="Supprimer"
                  >
                    <FaTrash />
                  </button>
                  <button
                    className="action-button pdf"
                    onClick={() => generatePDFForDemande(d)}
                    title="Télécharger PDF"
                  >
                    <FaFilePdf />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!formVisible && (
        <button
          className="btn-add"
          onClick={() => {
            resetForm();
            setFormVisible(true);
          }}
        >
          Ajouter une demande
        </button>
      )}

      {formVisible && (
        <form className="demande-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}

          <label htmlFor="titre">Titre *</label>
          <input
            id="titre"
            name="titre"
            type="text"
            value={form.titre}
            onChange={handleChange}
            required
          />

          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
          />

          <label htmlFor="dateIntervention">Date intervention</label>
          <input
            id="dateIntervention"
            name="dateIntervention"
            type="date"
            value={form.dateIntervention}
            onChange={handleChange}
          />

          <label htmlFor="clientId">Client *</label>
          <select
            id="clientId"
            name="clientId"
            value={form.clientId}
            onChange={handleChange}
            required
          >
            <option value="">-- Sélectionnez un client --</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom} {c.prenom} ({c.email})
              </option>
            ))}
          </select>

          <label htmlFor="status">Statut *</label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            required
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              marginTop: "24px",
            }}
          >
            <button type="submit" className="btn-submit">
              {editMode ? "Mettre à jour" : "Créer"}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setFormVisible(false);
              }}
              className="btn-cancel"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Demande;
