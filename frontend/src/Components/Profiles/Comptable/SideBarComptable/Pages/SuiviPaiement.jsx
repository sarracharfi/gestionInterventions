import React, { useEffect, useState } from "react";
import axios from "axios";
import "./suiviPaiement.css";

const API_URL = "http://localhost:3000/api/factures";

const SuiviPaiement = () => {
  const [factures, setFactures] = useState([]);
  const [filterPayee, setFilterPayee] = useState("toutes"); // 'toutes' | 'payee' | 'impayee'

  // Récupérer les factures
  const fetchFactures = async () => {
    try {
      const res = await axios.get(API_URL);
      setFactures(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des factures :", error);
    }
  };

  useEffect(() => {
    fetchFactures();
  }, []);

  // Filtrer les factures selon statut paiement
  const facturesFiltres = factures.filter((facture) => {
    if (filterPayee === "payee") return facture.estPayee === true;
    if (filterPayee === "impayee") return facture.estPayee === false;
    return true; // toutes
  });

  // Fonction pour sécuriser l'affichage des montants (cast en nombre)
  const formatMontant = (valeur) => {
    const num = Number(valeur);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  // Fonction pour afficher un code suivi valide ou fallback
  const afficherCodeSuivi = (facture) => {
    if (facture.codeSuivi && facture.codeSuivi.trim() !== "") {
      return facture.codeSuivi;
    }
    // fallback format FACYYYYMMDD-XXXX
    const datePart = facture.dateEmission
      ? facture.dateEmission.slice(0, 10).replace(/-/g, "")
      : "00000000";
    return `FAC${datePart}-XXXX`;
  };

  return (
    <div className="suivi-container">
      <h2>Suivi des paiements</h2>

      <div className="filter-section">
        <label>Filtrer par statut :</label>
        <select
          value={filterPayee}
          onChange={(e) => setFilterPayee(e.target.value)}
        >
          <option value="toutes">Toutes</option>
          <option value="payee">Payées</option>
          <option value="impayee">Non payées</option>
        </select>
      </div>

      <table className="facture-table">
        <thead>
          <tr>
            <th>Code suivi</th>
            <th>Description</th>
            <th>Client</th>
            <th>Montant TTC (€)</th>
            <th>Statut paiement</th>
          </tr>
        </thead>
        <tbody>
          {facturesFiltres.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Aucune facture à afficher.
              </td>
            </tr>
          )}

          {facturesFiltres.map((facture) => (
            <tr key={facture.id || facture._id}>
              <td>{afficherCodeSuivi(facture)}</td>
              <td>{facture.description || "-"}</td>
              <td>{facture.clientNom || "-"}</td>
              <td>{formatMontant(facture.montantTTC)} €</td>
              <td>
                {facture.estPayee ? (
                  <span className="payee">Payée</span>
                ) : (
                  <span className="impayee">Non payée</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SuiviPaiement;
