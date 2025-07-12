import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  getMateriels,
  createMateriel,
  updateMateriel,
  deleteMateriel,
} from "../../../../Services/userservice";
import "./materiel.css";

const MaterielManager = () => {
  const [materiels, setMateriels] = useState([]);
  const [formData, setFormData] = useState({
    nom: "",
    categorie: "",
    description: "",
    quantite: "",
    etat: "",
    technicienId: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [filterTechId, setFilterTechId] = useState("");

  useEffect(() => {
    loadMateriels();
  }, []);

  const loadMateriels = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMateriels();
      if (Array.isArray(data)) {
        setMateriels(data);
      } else if (data && Array.isArray(data.materiels)) {
        setMateriels(data.materiels);
      } else {
        setMateriels([]);
      }
    } catch {
      setError("Erreur chargement matériels");
      setMateriels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.nom ||
      !formData.categorie ||
      !formData.quantite ||
      !formData.etat ||
      !formData.technicienId
    ) {
      setError("Tous les champs obligatoires doivent être remplis");
      return;
    }

    try {
      if (editingId) {
        await updateMateriel(editingId, {
          ...formData,
          quantite: Number(formData.quantite),
        });
      } else {
        const data = new FormData();
        data.append("nom", formData.nom);
        data.append("categorie", formData.categorie);
        data.append("description", formData.description || "");
        data.append("quantite", formData.quantite);
        data.append("etat", formData.etat);
        data.append("technicienId", formData.technicienId);
        if (imageFile) data.append("image", imageFile);

        await createMateriel(data);
      }

      resetForm();
      loadMateriels();
    } catch (err) {
      console.error("❌ Erreur lors de la sauvegarde :", err);
      setError("Erreur lors de la sauvegarde");
    }
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      categorie: "",
      description: "",
      quantite: "",
      etat: "",
      technicienId: "",
    });
    setImageFile(null);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Confirmer la suppression ?")) {
      try {
        await deleteMateriel(id);
        loadMateriels();
      } catch {
        setError("Erreur suppression matériel");
      }
    }
  };

  const handleEdit = (materiel) => {
    setFormData({
      nom: materiel.nom || "",
      categorie: materiel.categorie || "",
      description: materiel.description || "",
      quantite: materiel.quantite?.toString() || "",
      etat: materiel.etat || "",
      technicienId: materiel.technicienId || "",
    });
    setEditingId(materiel.id);
    setShowForm(true);
  };

  const filteredMateriels = filterTechId
    ? materiels.filter((m) => m.technicienId === filterTechId)
    : materiels;

  const qrValue = JSON.stringify(
    filteredMateriels.map(({ nom, categorie, description, quantite, etat }) => ({
      nom, categorie, description, quantite, etat,
    }))
  );

  return (
    <div className="materiel-wrapper">
      <div className="materiel-container">
        <h2>Gestion des Matériels</h2>
        {error && <div className="error">{error}</div>}
        {loading && <div>Chargement...</div>}

        <div className="qr-code-container">
          <QRCode value={qrValue} size={140} />
        </div>

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Filtrer par ID Technicien"
            value={filterTechId}
            onChange={(e) => setFilterTechId(e.target.value)}
            style={{ padding: "10px", width: "300px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </div>

        <table className="materiel-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Description</th>
              <th>Quantité</th>
              <th>État</th>
              <th>Technicien</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMateriels.length > 0 ? (
              filteredMateriels.reverse().map((m) => (
                <tr key={m.id}>
                  <td>{m.nom}</td>
                  <td>{m.categorie}</td>
                  <td>{m.description}</td>
                  <td>{m.quantite}</td>
                  <td>{m.etat}</td>
                  <td>{m.technicienId}</td>
                  <td>
                    {m.imagePath && (
                      <img
                        src={`http://localhost:3000/uploads/materiels/${m.imagePath}`}
                        alt={m.nom}
                        className="materiel-image"
                      />
                    )}
                  </td>
                  <td>
                    <button
                      className="icon-button edit"
                      onClick={() => handleEdit(m)}
                      title="Modifier"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="icon-button delete"
                      onClick={() => handleDelete(m.id)}
                      title="Supprimer"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">Aucun matériel trouvé</td>
              </tr>
            )}
          </tbody>
        </table>

        <button
          className="toggle-button"
          onClick={() => {
            setShowForm((prev) => !prev);
            if (showForm) resetForm();
          }}
        >
          {showForm ? "Fermer le formulaire" : "Ajouter un matériel"}
        </button>

        {showForm && (
          <form className="materiel-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="nom"
              placeholder="Nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="categorie"
              placeholder="Catégorie"
              value={formData.categorie}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />
            <input
              type="number"
              name="quantite"
              placeholder="Quantité"
              value={formData.quantite}
              onChange={handleChange}
              required
            />
            <select
              name="etat"
              value={formData.etat}
              onChange={handleChange}
              required
            >
              <option value="">-- État --</option>
              <option value="Fonctionnelle">Fonctionnelle</option>
              <option value="En panne">En panne</option>
              <option value="En maintenance">En maintenance</option>
              <option value="Hors service">Hors service</option>
            </select>
            <input
              type="text"
              name="technicienId"
              placeholder="ID Technicien"
              value={formData.technicienId}
              onChange={handleChange}
              required
            />
            {!editingId && (
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
            )}
            <button type="submit">{editingId ? "Modifier" : "Ajouter"}</button>
            {editingId && (
              <button type="button" onClick={resetForm}>
                Annuler
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default MaterielManager;
