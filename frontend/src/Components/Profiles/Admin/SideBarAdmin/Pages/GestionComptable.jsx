import React, { useEffect, useState } from "react";
import {
  getComptables,
  deleteComptable,
  updateComptable,
  createComptable,
} from "../../../../Services/userservice";
import { FaEdit, FaTrash, FaPlus, FaCalculator } from "react-icons/fa";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import "./gestioncomptable.css";

const AdminComptablesGestion = () => {
  // États
  const [comptables, setComptables] = useState([]);
  const [editingComptable, setEditingComptable] = useState(null);
  const [newComptable, setNewComptable] = useState({
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
  const [comptableToDelete, setComptableToDelete] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Chargement initial des comptables
  useEffect(() => {
    fetchComptables();
  }, []);

  // Récupérer la liste des comptables
  const fetchComptables = async () => {
    setIsLoading(prev => ({ ...prev, table: true }));
    try {
      const data = await getComptables();
      setComptables(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des comptables :", error);
      toast.error("Erreur lors du chargement des comptables");
    } finally {
      setIsLoading(prev => ({ ...prev, table: false }));
    }
  };

  // Validation du formulaire comptable
  const validateComptable = (comptable, isCreation = false) => {
    const errors = {};
    if (!comptable.nom?.trim()) errors.nom = "Nom requis";
    if (!comptable.prenom?.trim()) errors.prenom = "Prénom requis";
    if (!comptable.email?.trim()) errors.email = "Email requis";
    else if (!/^\S+@\S+\.\S+$/.test(comptable.email)) errors.email = "Email invalide";
    if (!comptable.specialite?.trim()) errors.specialite = "Spécialité requise";
    if (!comptable.telephone?.trim()) errors.telephone = "Téléphone requis";
    if (isCreation && !comptable.password) errors.password = "Mot de passe requis";
    if (comptable.password && comptable.password.length < 6)
      errors.password = "Le mot de passe doit contenir au moins 6 caractères";
    return errors;
  };

  // Confirmation de suppression
  const confirmDelete = (comptable) => {
    setComptableToDelete(comptable);
    setShowDeleteModal(true);
  };

  // Suppression effective du comptable
  const handleDelete = async () => {
    setShowDeleteModal(false);
    setIsLoading(prev => ({ ...prev, delete: true }));
    
    try {
      await deleteComptable(comptableToDelete.id);
      toast.success("Comptable supprimé avec succès");
      fetchComptables();
    } catch (error) {
      console.error("Erreur lors de la suppression du comptable :", error);
      toast.error("Une erreur est survenue lors de la suppression");
    } finally {
      setIsLoading(prev => ({ ...prev, delete: false }));
    }
  };

  // Gestion de l'édition
  const handleEdit = (comptable) => {
    setEditingComptable({ ...comptable });
    setErrors({});
  };

  // Mise à jour du comptable
  const handleUpdate = async () => {
    const validationErrors = validateComptable(editingComptable);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(prev => ({ ...prev, update: true }));
    try {
      await updateComptable(editingComptable.id, editingComptable);
      setEditingComptable(null);
      toast.success("Comptable mis à jour avec succès");
      fetchComptables();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du comptable :", error);
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setIsLoading(prev => ({ ...prev, update: false }));
    }
  };

  // Création d'un nouveau comptable
  const handleCreate = async () => {
    const validationErrors = validateComptable(newComptable, true);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(prev => ({ ...prev, create: true }));
    try {
      await createComptable({
        ...newComptable,
        role: "comptable" // Ajout du rôle pour le backend
      });
      setNewComptable({ nom: "", prenom: "", email: "", specialite: "", telephone: "", password: "" });
      setErrors({});
      setShowCreateForm(false);
      toast.success("Comptable créé avec succès");
      fetchComptables();
    } catch (error) {
      console.error("Erreur lors de la création du comptable :", error);
      toast.error(error.response?.data?.message || "Erreur lors de la création");
    } finally {
      setIsLoading(prev => ({ ...prev, create: false }));
    }
  };

  // Annuler l'édition
  const cancelEdit = () => {
    setEditingComptable(null);
    setErrors({});
  };

  // Annuler la création
  const cancelCreate = () => {
    setShowCreateForm(false);
    setNewComptable({ nom: "", prenom: "", email: "", specialite: "", telephone: "", password: "" });
    setErrors({});
  };

  return (
    <div className="admin-container p-4">
      <h2 className="mb-4 text-primary">
        <FaCalculator className="me-2" />
        Gestion des Comptables
      </h2>

      {/* Bouton pour ouvrir le formulaire de création */}
      <div className="mb-4">
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(true)}
          disabled={showCreateForm}
        >
          <FaPlus className="me-2" />
          Ajouter un comptable
        </button>
      </div>

      {/* Formulaire de création (conditionnel) */}
      {showCreateForm && (
        <div className="card p-4 mb-4 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
            <h4>Ajouter un nouveau comptable</h4>
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
                value={newComptable.nom}
                onChange={(e) => setNewComptable({ ...newComptable, nom: e.target.value })}
              />
              {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Prénom*</label>
              <input
                type="text"
                className={`form-control ${errors.prenom ? "is-invalid" : ""}`}
                value={newComptable.prenom}
                onChange={(e) => setNewComptable({ ...newComptable, prenom: e.target.value })}
              />
              {errors.prenom && <div className="invalid-feedback">{errors.prenom}</div>}
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Email*</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                value={newComptable.email}
                onChange={(e) => setNewComptable({ ...newComptable, email: e.target.value })}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Téléphone*</label>
              <input
                type="text"
                className={`form-control ${errors.telephone ? "is-invalid" : ""}`}
                value={newComptable.telephone}
                onChange={(e) => setNewComptable({ ...newComptable, telephone: e.target.value })}
              />
              {errors.telephone && <div className="invalid-feedback">{errors.telephone}</div>}
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Spécialité*</label>
              <input
                type="text"
                className={`form-control ${errors.specialite ? "is-invalid" : ""}`}
                value={newComptable.specialite}
                onChange={(e) => setNewComptable({ ...newComptable, specialite: e.target.value })}
              />
              {errors.specialite && <div className="invalid-feedback">{errors.specialite}</div>}
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Mot de passe*</label>
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                value={newComptable.password}
                onChange={(e) => setNewComptable({ ...newComptable, password: e.target.value })}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            
            <div className="col-12 mt-3">
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-primary px-4"
                  onClick={handleCreate}
                  disabled={isLoading.create}
                >
                  {isLoading.create ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Création...
                    </>
                  ) : (
                    "Créer le comptable"
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

      {/* Tableau des comptables */}
      <div className="card shadow-sm">
        <div className="card-body">
          {isLoading.table && comptables.length === 0 ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Chargement des comptables...</p>
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
                  {comptables.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        {isLoading.table ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Aucun comptable trouvé"
                        )}
                      </td>
                    </tr>
                  ) : (
                    comptables.map((comptable) => (
                      <tr key={comptable.id}>
                        {editingComptable?.id === comptable.id ? (
                          <>
                            <td>
                              <input
                                className={`form-control form-control-sm ${errors.nom ? "is-invalid" : ""}`}
                                value={editingComptable.nom}
                                onChange={(e) => setEditingComptable({ ...editingComptable, nom: e.target.value })}
                              />
                              {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
                            </td>
                            <td>
                              <input
                                className={`form-control form-control-sm ${errors.prenom ? "is-invalid" : ""}`}
                                value={editingComptable.prenom}
                                onChange={(e) => setEditingComptable({ ...editingComptable, prenom: e.target.value })}
                              />
                              {errors.prenom && <div className="invalid-feedback">{errors.prenom}</div>}
                            </td>
                            <td>
                              <input
                                className={`form-control form-control-sm ${errors.email ? "is-invalid" : ""}`}
                                value={editingComptable.email}
                                onChange={(e) => setEditingComptable({ ...editingComptable, email: e.target.value })}
                              />
                              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </td>
                            <td>
                              <input
                                className={`form-control form-control-sm ${errors.specialite ? "is-invalid" : ""}`}
                                value={editingComptable.specialite}
                                onChange={(e) => setEditingComptable({ ...editingComptable, specialite: e.target.value })}
                              />
                              {errors.specialite && <div className="invalid-feedback">{errors.specialite}</div>}
                            </td>
                            <td>
                              <input
                                className={`form-control form-control-sm ${errors.telephone ? "is-invalid" : ""}`}
                                value={editingComptable.telephone}
                                onChange={(e) => setEditingComptable({ ...editingComptable, telephone: e.target.value })}
                              />
                              {errors.telephone && <div className="invalid-feedback">{errors.telephone}</div>}
                            </td>
                            <td className="text-end">
                              <div className="d-flex gap-2 justify-content-end">
                                <button 
                                  className="btn btn-sm btn-success"
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
                            <td>{comptable.nom}</td>
                            <td>{comptable.prenom}</td>
                            <td>{comptable.email}</td>
                            <td>{comptable.specialite}</td>
                            <td>{comptable.telephone}</td>
                            <td className="text-end">
                              <div className="d-flex gap-2 justify-content-end">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEdit(comptable)}
                                  disabled={isLoading.update}
                                >
                                  <FaEdit />
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => confirmDelete(comptable)}
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
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Êtes-vous sûr de vouloir supprimer le comptable <strong>{comptableToDelete?.nom} {comptableToDelete?.prenom}</strong> ?
          </p>
          <div className="alert alert-warning">
            Cette action est irréversible. Toutes les données associées à ce comptable seront perdues.
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

export default AdminComptablesGestion;