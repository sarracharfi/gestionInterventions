import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";
// Inscription (clients)
export const createClient = async (client) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/clients/signup`, client);
    return response.data;
  } catch (error) {
    console.error("Erreur création client :", error.response?.data || error.message);
    throw error;
  }
};

// Connexion
export const signIn = async (data) => {
  const url = `${API_BASE_URL}/clients/signin`;
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error("Signin Error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// -------------------- Clients CRUD --------------------

export const getClients = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/clients`);
    return response.data;
  } catch (error) {
    console.error("Erreur récupération clients :", error.response?.data || error.message);
    throw error;
  }
};

export const getClientById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/clients/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur récupération client :", error.response?.data || error.message);
    throw error;
  }
};

export const updateClient = async (id, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/clients/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Erreur mise à jour client :", error.response?.data || error.message);
    throw error;
  }
};

export const deleteClient = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/clients/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur suppression client :", error.response?.data || error.message);
    throw error;
  }
};
 


// Récupérer tous les utilisateurs
export const getUsers = async () => {
  const url = `${API_BASE_URL}/users`.trim();

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Get Users Error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Comptables (CRUD)
export const createComptable = async (comptable) => {
  const url = `${API_BASE_URL}/comptables`.trim();

  try {
    const response = await axios.post(url, comptable);
    return response.data;
  } catch (error) {
    console.error("Error creating comptable:", error.response?.data || error.message);
    throw error;
  }
};

export const getComptables = async () => {
  const url = `${API_BASE_URL}/comptables`.trim();

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching comptables:", error.response?.data || error.message);
    throw error;
  }
};

export const updateComptable = async (id, data) => {
  const url = `${API_BASE_URL}/comptables/${id}`.trim();

  try {
    const response = await axios.put(url, data);
    return response.data;
  } catch (error) {
    console.error("Error updating comptable:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteComptable = async (id) => {
  const url = `${API_BASE_URL}/comptables/${id}`.trim();

  try {
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    console.error("Error deleting comptable:", error.response?.data || error.message);
    throw error;
  }
};

// Factures (CRUD)
export const createFacture = async (facture) => {
  const url = `${API_BASE_URL}/factures`.trim();

  try {
    const response = await axios.post(url, facture);
    return response.data;
  } catch (error) {
    console.error("Error creating facture:", error.response?.data || error.message);
    throw error;
  }
};

export const getFactures = async () => {
  const url = `${API_BASE_URL}/factures`.trim();

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching factures:", error.response?.data || error.message);
    throw error;
  }
};

export const updateFacture = async (id, data) => {
  const url = `${API_BASE_URL}/factures/${id}`.trim();

  try {
    const response = await axios.put(url, data);
    return response.data;
  } catch (error) {
    console.error("Error updating facture:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteFacture = async (id) => {
  const url = `${API_BASE_URL}/factures/${id}`.trim();

  try {
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    console.error("Error deleting facture:", error.response?.data || error.message);
    throw error;
  }
};

// Contact (envoi message)
export const sendContactMessage = async (messageData) => {
  const url = `${API_BASE_URL}/contact`.trim();

  try {
    const response = await axios.post(url, messageData);
    return response.data;
  } catch (error) {
    console.error("Erreur envoi contact :", error.response?.data || error.message);
    throw error;
  }
};
///// Techniciens (CRUD)
export const createTechnicien = async (technicien) => {
  const url = `${API_BASE_URL}/technicien/signup`.trim();

  try {
    const response = await axios.post(url, technicien);
    return response.data;
  } catch (error) {
    console.error("Erreur création technicien:", error.response?.data || error.message);
    throw error;
  }
};

export const getTechniciens = async () => {
  const url = `${API_BASE_URL}/technicien`.trim();

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Erreur récupération techniciens:", error.response?.data || error.message);
    throw error;
  }
};

export const updateTechnicien = async (id, data) => {
  const url = `${API_BASE_URL}/technicien/${id}`.trim();

  try {
    const response = await axios.put(url, data);
    return response.data;
  } catch (error) {
    console.error("Erreur mise à jour technicien:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteTechnicien = async (id) => {
  const url = `${API_BASE_URL}/technicien/${id}`.trim();

  try {
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    console.error("Erreur suppression technicien:", error.response?.data || error.message);
    throw error;
  }
};
// Récupérer la liste des matériels
export const getMateriels = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/materiels`);
    return response.data;
  } catch (error) {
    console.error("Erreur récupération matériels :", error);
    throw error;
  }
};

// Créer un matériel avec image (multipart/form-data)
export const createMateriel = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/materiels/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur création matériel:", error.response?.data || error.message);
    throw error;
  }
};

// Mettre à jour un matériel (sans image ici)
export const updateMateriel = async (id, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/materiels/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Erreur mise à jour matériel:", error.response?.data || error.message);
    throw error;
  }
};

// Supprimer un matériel
export const deleteMateriel = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/materiels/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur suppression matériel:", error.response?.data || error.message);
    throw error;
  }
};
//
// POST - Enregistrer ou mettre à jour position
export const saveTechnicienPosition = async ({ technicienId, latitude, longitude }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/geoloc`, {
      technicienId,
      latitude,
      longitude,
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la position :", error.response?.data || error.message);
    throw error;
  }
};

// GET - Récupérer position par ID technicien
export const getTechnicienPosition = async (technicienId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/geoloc/${technicienId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la position :", error.response?.data || error.message);
    throw error;
  }
};



// -------- DEMANDE INTERVENTION CRUD --------


export const createDemandeIntervention = async (demande) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/demandes-intervention`, demande);
    return response.data;
  } catch (error) {
    console.error("Erreur création demande :", error.response?.data || error.message);
    throw error;
  }
};
export const getDemandesIntervention = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/demandes-intervention`);
    return response.data;
  } catch (error) {
    console.error("Erreur récupération demandes :", error.response?.data || error.message);
    throw error;
  }
};

export const getDemandeInterventionById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/demandes-intervention/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur récupération demande :", error.response?.data || error.message);
    throw error;
  }
};

export const updateDemandeIntervention = async (id, data) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/demandes-intervention/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Erreur mise à jour demande :", error.response?.data || error.message);
    throw error;
  }
};

export const deleteDemandeIntervention = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/demandes-intervention/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur suppression demande :", error.response?.data || error.message);
    throw error;
  }
};

export const changeStatusDemandeIntervention = async (id, status) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/demandes-intervention/${id}/status/${status}`);
    return response.data;
  } catch (error) {
    console.error("Erreur changement statut demande :", error.response?.data || error.message);
    throw error;
  }
};
const API_BASE_EVALUATIONS = "http://localhost:3000/api/evaluations";

export const getEvaluations = async () => {
  try {
    const response = await axios.get(API_BASE_EVALUATIONS);
    return response.data;
  } catch (error) {
    console.error("Erreur récupération évaluations:", error.response?.data || error.message);
    throw error;
  }
};

export const createEvaluation = async (evaluation) => {
  try {
    // S'assurer que evaluation a bien les champs que le backend attend
    const payload = {
      clientNom: evaluation.clientNom,
      clientPrenom: evaluation.clientPrenom,
      technicienNom: evaluation.technicienNom,
      technicienPrenom: evaluation.technicienPrenom,
      note: Number(evaluation.note),
      commentaire: evaluation.commentaire || '',
    };

    const response = await axios.post(API_BASE_EVALUATIONS, payload);
    return response.data;
  } catch (error) {
    console.error("Erreur création évaluation:", error.response?.data || error.message);
    throw error;
  }
};

export const updateEvaluation = async (id, data) => {
  try {
    const response = await axios.put(`${API_BASE_EVALUATIONS}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Erreur mise à jour évaluation:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteEvaluation = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_EVALUATIONS}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur suppression évaluation:", error.response?.data || error.message);
    throw error;
  }
};

//admin

// 👉 1. Créer un admin (inscription)
export const createAdmin = async (admin) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin`, admin);
    return response.data;
  } catch (error) {
    console.error("Erreur création admin:", error.response?.data || error.message);
    throw error;
  }
};

// 👉 2. Connexion admin
export const signInAdmin = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/signin`, credentials);
    return response.data;
  } catch (error) {
    console.error("Erreur connexion admin:", error.response?.data || error.message);
    throw error;
  }
};

// 👉 3. Récupérer tous les admins
export const getAdmins = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin`);
    return response.data;
  } catch (error) {
    console.error("Erreur récupération admins:", error.response?.data || error.message);
    throw error;
  }
};

// 👉 4. Récupérer un admin par ID
export const getAdminById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur récupération admin par ID:", error.response?.data || error.message);
    throw error;
  }
};

// 👉 5. Mettre à jour un admin
export const updateAdmin = async (id, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/admin/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Erreur mise à jour admin:", error.response?.data || error.message);
    throw error;
  }
};

// 👉 6. Supprimer un admin
export const deleteAdmin = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/admin/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur suppression admin:", error.response?.data || error.message);
    throw error;
  }
};
