 import React, { useEffect, useState } from "react";
import { FiEdit2, FiRefreshCw, FiSend, FiStar, FiTrash2 } from "react-icons/fi";
import {
  createEvaluation,
  deleteEvaluation,
  getClients,
  getTechniciens,
  getEvaluations,
  updateEvaluation,
} from "../../../../Services/userservice";
import styles from "./evaluation.module.css"; 

const Evaluations = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [clients, setClients] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [formData, setFormData] = useState({
    clientId: "",
    technicienId: "",
    comments: "",
    innovationStars: 3,
    marketPotentialStars: 3,
    teamStars: 3,
    feasibilityStars: 3,
    date: new Date().toISOString().split("T")[0],
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [clientsList, techniciensList, evaluationsData] = await Promise.all([
          loadClients(),
          loadTechniciens(),
          loadEvaluations(),
        ]);
        setClients(clientsList);
        setTechniciens(techniciensList);
        setEvaluations(evaluationsData);
      } catch (err) {
        setError(err.message || "Erreur chargement données");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const loadClients = async () => {
    try {
      const response = await getClients();
      const data = response.data || response;
      return (Array.isArray(data) ? data : [data]).map((c) => ({
        id: c._id || c.id,
        name: c.nom + " " + c.prenom,
      }));
    } catch (err) {
      setError("Erreur chargement clients");
      return [];
    }
  };

  const loadTechniciens = async () => {
    try {
      const response = await getTechniciens();
      const data = response.data || response;
      return (Array.isArray(data) ? data : [data]).map((t) => ({
        id: t._id || t.id,
        name: t.nom + " " + t.prenom,
      }));
    } catch (err) {
      setError("Erreur chargement techniciens");
      return [];
    }
  };

  const loadEvaluations = async () => {
    try {
      const response = await getEvaluations();
      const data = response.data || response;
      return Array.isArray(data) ? data : [data];
    } catch (err) {
      setError("Erreur chargement évaluations");
      return [];
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name.includes("Stars") ? parseInt(value, 10) : value }));
  };

  const handleStarChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.clientId || !formData.technicienId) throw new Error("Client ou technicien manquant");

      const client = clients.find((c) => c.id === formData.clientId);
      const technicien = techniciens.find((t) => t.id === formData.technicienId);
      const [clientPrenom = "", clientNom = ""] = client.name.split(" ");
      const [technicienPrenom = "", technicienNom = ""] = technicien.name.split(" ");
      const note = ((formData.innovationStars + formData.marketPotentialStars + formData.teamStars + formData.feasibilityStars) / 4) * 20;

      const payload = {
        clientNom,
        clientPrenom,
        technicienNom,
        technicienPrenom,
        note: Math.round(note),
        commentaire: formData.comments,
      };

      const response = editingId
        ? await updateEvaluation(editingId, payload)
        : await createEvaluation(payload);

      const result = response.data || response;

      setSuccessMessage(`Évaluation ${editingId ? "mise à jour" : "ajoutée"} avec succès !`);
      if (editingId) {
        setEvaluations((prev) => prev.map((item) => (item._id || item.id) === editingId ? result : item));
      } else {
        setEvaluations((prev) => [...prev, result]);
      }
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Erreur lors de l'envoi.");
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const resetForm = () => {
    setFormData({
      clientId: "",
      technicienId: "",
      comments: "",
      innovationStars: 3,
      marketPotentialStars: 3,
      teamStars: 3,
      feasibilityStars: 3,
      date: new Date().toISOString().split("T")[0],
    });
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setFormData({
      clientId: item.client?.id || "",
      technicienId: item.technicien?.id || "",
      comments: item.commentaire || "",
      innovationStars: 3,
      marketPotentialStars: 3,
      teamStars: 3,
      feasibilityStars: 3,
      date: item.dateEvaluation ? item.dateEvaluation.split("T")[0] : new Date().toISOString().split("T")[0],
    });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette évaluation ?")) return;
    setIsLoading(true);
    try {
      await deleteEvaluation(id);
      setEvaluations((prev) => prev.filter((item) => item.id !== id));
      setSuccessMessage("Évaluation supprimée avec succès");
    } catch (err) {
      setError("Erreur lors de la suppression");
    } finally {
      setIsLoading(false);
    }
  };

  const StarRating = ({ value, onChange, name }) => (
    <div className={styles.starRating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          className={`${styles.star} ${star <= value ? styles.filled : ""}`}
          onClick={() => onChange(name, star)}
          style={{ cursor: "pointer" }}
        />
      ))}
    </div>
  );

  const getClientName = (id) => {
    const client = clients.find((c) => c.id === id);
    return client ? client.name : `Client (ID: ${id})`;
  };

  const getTechnicienName = (id) => {
    const tech = techniciens.find((t) => t.id === id);
    return tech ? tech.name : `Technicien (ID: ${id})`;
  };

  return (
    <div className={styles.evaluationContainer}>
      {isLoading && <div className={styles.loaderOverlay}>Chargement en cours...</div>}
      {error && <div className={styles.errorMessage}>⚠️ {error}</div>}
      {successMessage && <div className={styles.successMessage}>✅ {successMessage}</div>}

      <div className={styles.evaluationHeader}>
        <h1>Évaluer un technicien</h1>
        <button onClick={() => window.location.reload()} className={styles.refreshButton}>
          <FiRefreshCw /> 
        </button>
      </div>

      <form className={styles.evaluationForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Client</label>
          <select name="clientId" value={formData.clientId} onChange={handleInputChange} required>
            <option value="">-- Choisir un client --</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Technicien</label>
          <select name="technicienId" value={formData.technicienId} onChange={handleInputChange} required>
            <option value="">-- Choisir un technicien --</option>
            {techniciens.map((tech) => (
              <option key={tech.id} value={tech.id}>{tech.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.criteriaGrid}>
          <div>
            <label>Innovation</label>
            <StarRating name="innovationStars" value={formData.innovationStars} onChange={handleStarChange} />
          </div>
          <div>
            <label>Potentiel du marché</label>
            <StarRating name="marketPotentialStars" value={formData.marketPotentialStars} onChange={handleStarChange} />
          </div>
          <div>
            <label>Équipe</label>
            <StarRating name="teamStars" value={formData.teamStars} onChange={handleStarChange} />
          </div>
          <div>
            <label>Faisabilité</label>
            <StarRating name="feasibilityStars" value={formData.feasibilityStars} onChange={handleStarChange} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Commentaires</label>
          <textarea name="comments" value={formData.comments} onChange={handleInputChange} />
        </div>

        <div className={styles.formActions}>
          <button type="button" onClick={resetForm} className={styles.secondaryButton}>Annuler</button>
          <button type="submit" className={styles.primaryButton}>
            {editingId ? <><FiEdit2 /> Modifier</> : <><FiSend /> Envoyer</>}
          </button>
        </div>
      </form>

      <div className={styles.evaluationList}>
        <h2>Évaluations existantes</h2>
        {evaluations.length === 0 ? <p>Aucune évaluation disponible</p> : (
          evaluations.map((item) => (
            <div key={item.id} className={styles.evaluationCard}>
              <h3>Technicien : {item.technicien?.nom} {item.technicien?.prenom}</h3>
              <p><strong>Client :</strong> {item.client?.nom} {item.client?.prenom}</p>
              <p><strong>Note :</strong> {item.note}/100</p>
              {item.commentaire && <p><strong>Commentaires :</strong> {item.commentaire}</p>}
              <div className={styles.cardActions}>
                <button onClick={() => handleEdit(item)}><FiEdit2 /></button>
                <button onClick={() => handleDelete(item.id)}><FiTrash2 /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Evaluations; 