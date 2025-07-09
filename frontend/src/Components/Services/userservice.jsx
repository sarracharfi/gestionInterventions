import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

// Inscription
export const signUp = async (data) => {
  const url = `${API_BASE_URL}/auth/signup`.trim();
  console.log("URL signup appelée :", `"${url}"`, `Longueur : ${url.length}`);

  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error("Signup Error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Connexion
export const signIn = async (data) => {
  const url = `${API_BASE_URL}/auth/login`.trim();
  console.log("URL login appelée :", `"${url}"`, `Longueur : ${url.length}`);

  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error("Signin Error:", error.response?.data || error.message);
    throw error.response?.data || error;
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
