import React, { useEffect, useState } from "react";
import {
  getClients,
  deleteClient,
  updateClient,
  createClient,
} from "../../../../Services/userservice";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import "./gestionclient.css";

const AdminClientsGestion = () => {
  // États
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [newClient, setNewClient] = useState({
    nom: "",
    prenom: "",
    email: "",
    adresse: "",
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
  const [clientToDelete, setClientToDelete] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false); // Nouvel état pour gérer l'affichage du formulaire

  // Chargement initial des clients
  useEffect(() => {
    fetchClients();
  }, []);

  // Récupérer la liste des clients
  const fetchClients = async () => {
    setIsLoading(prev => ({ ...prev, table: true }));
    try {
      const data = await getClients();
      setClients(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des clients :", error);
      toast.error("Erreur lors du chargement des clients");
    } finally {
      setIsLoading(prev => ({ ...prev, table: false }));
    }
  };

  // Validation du formulaire client
  const validateClient = (client, isCreation = false) => {
    const errors = {};
    if (!client.nom?.trim()) errors.nom = "Nom requis";
    if (!client.prenom?.trim()) errors.prenom = "Prénom requis";
    if (!client.email?.trim()) errors.email = "Email requis";
    else if (!/^\S+@\S+\.\S+$/.test(client.email)) errors.email = "Email invalide";
    if (!client.adresse?.trim()) errors.adresse = "Adresse requise";
    if (!client.telephone?.trim()) errors.telephone = "Téléphone requis";
    if (isCreation && !client.password) errors.password = "Mot de passe requis";
    if (client.password && client.password.length < 6)
      errors.password = "Le mot de passe doit contenir au moins 6 caractères";
    return errors;
  };

  // Confirmation de suppression
  const confirmDelete = (client) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  // Suppression effective du client
  const handleDelete = async () => {
    setShowDeleteModal(false);
    setIsLoading(prev => ({ ...prev, delete: true }));
    
    try {
      await deleteClient(clientToDelete.id);
      toast.success("Client supprimé avec succès");
      fetchClients();
    } catch (error) {
      console.error("Erreur lors de la suppression du client :", error);
      toast.error("Une erreur est survenue lors de la suppression");
    } finally {
      setIsLoading(prev => ({ ...prev, delete: false }));
    }
  };

  // Gestion de l'édition
  const handleEdit = (client) => {
    setEditingClient({ ...client });
    setErrors({});
  };

  // Mise à jour du client
  const handleUpdate = async () => {
    const validationErrors = validateClient(editingClient);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(prev => ({ ...prev, update: true }));
    try {
      await updateClient(editingClient.id, editingClient);
      setEditingClient(null);
      toast.success("Client mis à jour avec succès");
      fetchClients();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client :", error);
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setIsLoading(prev => ({ ...prev, update: false }));
    }
  };

  // Création d'un nouveau client
  const handleCreate = async () => {
    const validationErrors = validateClient(newClient, true);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(prev => ({ ...prev, create: true }));
    try {
      await createClient(newClient);
      setNewClient({ nom: "", prenom: "", email: "", adresse: "", telephone: "", password: "" });
      setErrors({});
      setShowCreateForm(false); // Fermer le formulaire après création réussie
      toast.success("Client créé avec succès");
      fetchClients();
    } catch (error) {
      console.error("Erreur lors de la création du client :", error);
      toast.error(error.response?.data?.message || "Erreur lors de la création");
    } finally {
      setIsLoading(prev => ({ ...prev, create: false }));
    }
  };

  // Annuler l'édition
  const cancelEdit = () => {
    setEditingClient(null);
    setErrors({});
  };

  // Annuler la création
  const cancelCreate = () => {
    setShowCreateForm(false);
    setNewClient({ nom: "", prenom: "", email: "", adresse: "", telephone: "", password: "" });
    setErrors({});
  };

  return (
    <div className="admin-container p-4">
      <h2 className="mb-4 text-primary">Gestion des Clients</h2>

      {/* Bouton pour ouvrir le formulaire de création */}
      <div className="mb-4">
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(true)}
          disabled={showCreateForm}
        >
          <FaPlus className="me-2" />
          Ajouter un client
        </button>
      </div>

      {/* Formulaire de création (conditionnel) */}
      {showCreateForm && (
        <div className="card p-4 mb-4 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
            <h4>Ajouter un nouveau client</h4>
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
                value={newClient.nom}
                onChange={(e) => setNewClient({ ...newClient, nom: e.target.value })}
              />
              {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Prénom*</label>
              <input
                type="text"
                className={`form-control ${errors.prenom ? "is-invalid" : ""}`}
                value={newClient.prenom}
                onChange={(e) => setNewClient({ ...newClient, prenom: e.target.value })}
              />
              {errors.prenom && <div className="invalid-feedback">{errors.prenom}</div>}
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Email*</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Téléphone*</label>
              <input
                type="text"
                className={`form-control ${errors.telephone ? "is-invalid" : ""}`}
                value={newClient.telephone}
                onChange={(e) => setNewClient({ ...newClient, telephone: e.target.value })}
              />
              {errors.telephone && <div className="invalid-feedback">{errors.telephone}</div>}
            </div>
            
            <div className="col-12">
              <label className="form-label">Adresse*</label>
              <input
                type="text"
                className={`form-control ${errors.adresse ? "is-invalid" : ""}`}
                value={newClient.adresse}
                onChange={(e) => setNewClient({ ...newClient, adresse: e.target.value })}
              />
              {errors.adresse && <div className="invalid-feedback">{errors.adresse}</div>}
            </div>
            
            <div className="col-12">
              <label className="form-label">Mot de passe*</label>
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                value={newClient.password}
                onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
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
                    "Créer le client"
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

      {/* Tableau des clients */}
      <div className="card shadow-sm">
        <div className="card-body">
          {isLoading.table && clients.length === 0 ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Chargement des clients...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        {isLoading.table ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Aucun client trouvé"
                        )}
                      </td>
                    </tr>
                  ) : (
                    clients.map((client) => (
                      <tr key={client.id}>
                        {editingClient?.id === client.id ? (
                          <>
                            <td>
                              <input
                                className={`form-control form-control-sm ${errors.nom ? "is-invalid" : ""}`}
                                value={editingClient.nom}
                                onChange={(e) => setEditingClient({ ...editingClient, nom: e.target.value })}
                              />
                              {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
                            </td>
                            <td>
                              <input
                                className={`form-control form-control-sm ${errors.prenom ? "is-invalid" : ""}`}
                                value={editingClient.prenom}
                                onChange={(e) => setEditingClient({ ...editingClient, prenom: e.target.value })}
                              />
                              {errors.prenom && <div className="invalid-feedback">{errors.prenom}</div>}
                            </td>
                            <td>
                              <input
                                className={`form-control form-control-sm ${errors.email ? "is-invalid" : ""}`}
                                value={editingClient.email}
                                onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                              />
                              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </td>
                            <td>
                              <input
                                className={`form-control form-control-sm ${errors.telephone ? "is-invalid" : ""}`}
                                value={editingClient.telephone}
                                onChange={(e) => setEditingClient({ ...editingClient, telephone: e.target.value })}
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
                            <td>{client.nom}</td>
                            <td>{client.prenom}</td>
                            <td>{client.email}</td>
                            <td>{client.telephone}</td>
                            <td className="text-end">
                              <div className="d-flex gap-2 justify-content-end">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEdit(client)}
                                  disabled={isLoading.update}
                                >
                                  <FaEdit />
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => confirmDelete(client)}
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
            Êtes-vous sûr de vouloir supprimer le client <strong>{clientToDelete?.nom} {clientToDelete?.prenom}</strong> ?
          </p>
          <div className="alert alert-warning">
            Cette action est irréversible. Toutes les données associées à ce client seront perdues.
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

export default AdminClientsGestion;