import React, { useEffect, useState } from "react";
import {
  getTechniciens,
  deleteTechnicien,
  updateTechnicien,
  createTechnicien,
} from "../../../../Services/userservice";
import { FaEdit, FaTrash, FaPlus, FaUserCog } from "react-icons/fa";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import "./gestiontechnicien.css";

const AdminTechniciensGestion = () => {
  // États
  const [techniciens, setTechniciens] = useState([]);
  const [editingTechnicien, setEditingTechnicien] = useState(null);
  const [newTechnicien, setNewTechnicien] = useState({
    nom: "",
    prenom: "",
    email: "",
    specialite: "",
    telephone: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState({
    table: false,
    delete: false,
    create: false,
    update: false,
  });
  const [errors, setErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [technicienToDelete, setTechnicienToDelete] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Chargement initial des techniciens
  useEffect(() => {
    fetchTechniciens();
  }, []);

  // Récupérer la liste des techniciens
  const fetchTechniciens = async () => {
    setIsLoading((prev) => ({ ...prev, table: true }));
    try {
      const data = await getTechniciens();
      setTechniciens(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des techniciens :", error);
      toast.error("Erreur lors du chargement des techniciens");
    } finally {
      setIsLoading((prev) => ({ ...prev, table: false }));
    }
  };

  // Validation du formulaire technicien
  const validateTechnicien = (technicien, isCreation = false) => {
    const errors = {};
    if (!technicien.nom?.trim()) errors.nom = "Nom requis";
    if (!technicien.prenom?.trim()) errors.prenom = "Prénom requis";
    if (!technicien.email?.trim()) errors.email = "Email requis";
    else if (!/^\S+@\S+\.\S+$/.test(technicien.email)) errors.email = "Email invalide";
    if (!technicien.specialite?.trim()) errors.specialite = "Spécialité requise";
    if (!technicien.telephone?.trim()) errors.telephone = "Téléphone requis";
    if (isCreation && !technicien.password) errors.password = "Mot de passe requis";
    if (technicien.password && technicien.password.length < 6)
      errors.password = "Le mot de passe doit contenir au moins 6 caractères";
    return errors;
  };

  // Confirmation de suppression
  const confirmDelete = (technicien) => {
    setTechnicienToDelete(technicien);
    setShowDeleteModal(true);
  };

  // Suppression effective du technicien
  const handleDelete = async () => {
    setShowDeleteModal(false);
    setIsLoading((prev) => ({ ...prev, delete: true }));
    try {
      await deleteTechnicien(technicienToDelete.id);
      toast.success("Technicien supprimé avec succès");
      fetchTechniciens();
    } catch (error) {
      console.error("Erreur lors de la suppression du technicien :", error);
      toast.error("Une erreur est survenue lors de la suppression");
    } finally {
      setIsLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  // Gestion de l'édition
  const handleEdit = (technicien) => {
    setEditingTechnicien({ ...technicien });
    setErrors({});
  };

  // Mise à jour du technicien
  const handleUpdate = async () => {
    const validationErrors = validateTechnicien(editingTechnicien);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading((prev) => ({ ...prev, update: true }));
    try {
      await updateTechnicien(editingTechnicien.id, editingTechnicien);
      setEditingTechnicien(null);
      toast.success("Technicien mis à jour avec succès");
      fetchTechniciens();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du technicien :", error);
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setIsLoading((prev) => ({ ...prev, update: false }));
    }
  };

  // Création d'un nouveau technicien
  const handleCreate = async () => {
    const trimmedTechnicien = {
      nom: newTechnicien.nom.trim(),
      prenom: newTechnicien.prenom.trim(),
      email: newTechnicien.email.trim(),
      specialite: newTechnicien.specialite.trim(),
      telephone: newTechnicien.telephone.trim(),
      password: newTechnicien.password.trim(),
    };

    console.log("Data being sent to createTechnicien:", trimmedTechnicien); // Debug log

    const validationErrors = validateTechnicien(trimmedTechnicien, true);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading((prev) => ({ ...prev, create: true }));
    try {
      await createTechnicien(trimmedTechnicien);
      setNewTechnicien({ nom: "", prenom: "", email: "", specialite: "", telephone: "", password: "" });
      setErrors({});
      setShowCreateForm(false);
      toast.success("Technicien créé avec succès");
      fetchTechniciens();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Erreur lors de la création";
      console.error("Erreur lors de la création du technicien :", {
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
      });
      toast.error(errorMessage);
    } finally {
      setIsLoading((prev) => ({ ...prev, create: false }));
    }
  };

  // Annuler l'édition
  const cancelEdit = () => {
    setEditingTechnicien(null);
    setErrors({});
  };

  // Annuler la création
  const cancelCreate = () => {
    setShowCreateForm(false);
    setNewTechnicien({ nom: "", prenom: "", email: "", specialite: "", telephone: "", password: "" });
    setErrors({});
  };

  return (
    <div className="admin-container p-4">
      <h2 className="mb-4 text-primary">
        <FaUserCog className="me-2" />
        Gestion des Techniciens
      </h2>

      {/* Bouton pour ouvrir le formulaire de création */}
      <div className="mb-4">
        <button 
          className="btn btn-primary btn-3d"
          onClick={() => setShowCreateForm(true)}
          disabled={showCreateForm}
        >
          <FaPlus className="me-2" />
          Ajouter un technicien
        </button>
      </div>

      {/* Formulaire de création (conditionnel) */}
      {showCreateForm && (
        <div className="card p-4 mb-4 shadow-sm create-technicien-card">
          <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
            <h4>Ajouter un nouveau technicien</h4>
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={cancelCreate}
            >
              Fermer
            </button>
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Nom*</label>
              <input
                type="text"
                className={`form-control ${errors.nom ? "is-invalid" : ""}`}
                value={newTechnicien.nom}
                onChange={(e) => setNewTechnicien({ ...newTechnicien, nom: e.target.value })}
              />
              {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Prénom*</label>
              <input
                type="text"
                className={`form-control ${errors.prenom ? "is-invalid" : ""}`}
                value={newTechnicien.prenom}
                onChange={(e) => setNewTechnicien({ ...newTechnicien, prenom: e.target.value })}
              />
              {errors.prenom && <div className="invalid-feedback">{errors.prenom}</div>}
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Email*</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                value={newTechnicien.email}
                onChange={(e) => setNewTechnicien({ ...newTechnicien, email: e.target.value })}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Téléphone*</label>
              <input
                type="text"
                className={`form-control ${errors.telephone ? "is-invalid" : ""}`}
                value={newTechnicien.telephone}
                onChange={(e) => setNewTechnicien({ ...newTechnicien, telephone: e.target.value })}
              />
              {errors.telephone && <div className="invalid-feedback">{errors.telephone}</div>}
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Spécialité*</label>
              <input
                type="text"
                className={`form-control ${errors.specialite ? "is-invalid" : ""}`}
                value={newTechnicien.specialite}
                onChange={(e) => setNewTechnicien({ ...newTechnicien, specialite: e.target.value })}
              />
              {errors.specialite && <div className="invalid-feedback">{errors.specialite}</div>}
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Mot de passe*</label>
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                value={newTechnicien.password}
                onChange={(e) => setNewTechnicien({ ...newTechnicien, password: e.target.value })}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            
            <div className="col-12 mt-3">
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-primary px-4 btn-3d"
                  onClick={handleCreate}
                  disabled={isLoading.create}
                >
                  {isLoading.create ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Création...
                    </>
                  ) : (
                    "Créer le technicien"
                  )}
                </button>
                <button 
                  className="btn btn-outline-secondary px-4"
                  onClick={cancelCreate}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tableau des techniciens */}
      <div className="card shadow-sm">
        <div className="card-body">
          {isLoading.table && techniciens.length === 0 ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Chargement des techniciens...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Spécialité</th>
                    <th>Téléphone</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {techniciens.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        {isLoading.table ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Aucun technicien trouvé"
                        )}
                      </td>
                    </tr>
                  ) : (
                    techniciens.map((technicien) => (
                      <tr key={technicien.id}>
                        {editingTechnicien?.id === technicien.id ? (
                          <>
                            <td>
                              <input
                                className={`form-control form-control-sm ${errors.nom ? "is-invalid" : ""}`}
                                value={editingTechnicien.nom}
                                onChange={(e) => setEditingTechnicien({ ...editingTechnicien, nom: e.target.value })}
                              />
                              {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
                            </td>
                            <td>
                              <input
                                className={`form-control form-control-sm ${errors.prenom ? "is-invalid" : ""}`}
                                value={editingTechnicien.prenom}
                                onChange={(e) => setEditingTechnicien({ ...editingTechnicien, prenom: e.target.value })}
                              />
                              {errors.prenom && <div className="invalid-feedback">{errors.prenom}</div>}
                            </td>
                            <td>
                              <input
                                className={`form-control form-control-sm ${errors.email ? "is-invalid" : ""}`}
                                value={editingTechnicien.email}
                                onChange={(e) => setEditingTechnicien({ ...editingTechnicien, email: e.target.value })}
                              />
                              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </td>
                            <td>
                              <input
                                className={`form-control form-control-sm ${errors.specialite ? "is-invalid" : ""}`}
                                value={editingTechnicien.specialite}
                                onChange={(e) => setEditingTechnicien({ ...editingTechnicien, specialite: e.target.value })}
                              />
                              {errors.specialite && <div className="invalid-feedback">{errors.specialite}</div>}
                            </td>
                            <td>
                              <input
                                className={`form-control form-control-sm ${errors.telephone ? "is-invalid" : ""}`}
                                value={editingTechnicien.telephone}
                                onChange={(e) => setEditingTechnicien({ ...editingTechnicien, telephone: e.target.value })}
                              />
                              {errors.telephone && <div className="invalid-feedback">{errors.telephone}</div>}
                            </td>
                            <td className="text-end">
                              <div className="d-flex gap-2 justify-content-end">
                                <button 
                                  className="btn btn-sm btn-success btn-3d"
                                  onClick={handleUpdate}
                                  disabled={isLoading.update}
                                >
                                  {isLoading.update ? (
                                    <Spinner animation="border" size="sm" />
                                  ) : "Enregistrer"}
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={cancelEdit}
                                >
                                  Annuler
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td>{technicien.nom}</td>
                            <td>{technicien.prenom}</td>
                            <td>{technicien.email}</td>
                            <td>{technicien.specialite}</td>
                            <td>{technicien.telephone}</td>
                            <td className="text-end">
                              <div className="d-flex gap-2 justify-content-end">
                                <button 
                                  className="btn btn-sm btn-outline-primary btn-3d"
                                  onClick={() => handleEdit(technicien)}
                                  disabled={isLoading.update}
                                >
                                  <FaEdit />
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger btn-3d"
                                  onClick={() => confirmDelete(technicien)}
                                  disabled={isLoading.delete}
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Êtes-vous sûr de vouloir supprimer le technicien <strong>{technicienToDelete?.nom} {technicienToDelete?.prenom}</strong> ?
          </p>
          <div className="alert alert-warning">
            Cette action est irréversible. Toutes les données associées à ce technicien seront perdues.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete} 
            disabled={isLoading.delete}
            className="btn-3d"
          >
            {isLoading.delete ? (
              <Spinner animation="border" size="sm" />
            ) : "Confirmer la suppression"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminTechniciensGestion;