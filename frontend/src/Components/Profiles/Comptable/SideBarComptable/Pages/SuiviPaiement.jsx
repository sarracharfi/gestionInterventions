import React, { useEffect, useState } from 'react';
import axios from 'axios';
 import { FaEdit, FaTrash } from 'react-icons/fa';
import "./suiviPaiement.css";


const API_URL = 'http://localhost:3000/api/factures';

const SuiviPaiement = () => {
  const [factures, setFactures] = useState([]);
  const [filtre, setFiltre] = useState('toutes');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFactures = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_URL);
        const facturesFormatees = res.data.map(facture => ({
          ...facture,
          montantTTC: typeof facture.montantTTC === 'string' 
            ? parseFloat(facture.montantTTC) 
            : facture.montantTTC,
          dateEmission: facture.dateEmission 
            ? new Date(facture.dateEmission).toLocaleDateString() 
            : 'Non spécifiée'
        }));
        setFactures(facturesFormatees);
      } catch (err) {
        console.error('Erreur chargement des factures:', err);
        setError('Erreur lors du chargement des factures');
      } finally {
        setLoading(false);
      }
    };

    fetchFactures();
  }, []);

  const facturesFiltrees = factures.filter(facture => {
    if (filtre === 'payees') return facture.estPayee;
    if (filtre === 'impayees') return !facture.estPayee;
    return true;
  });

  if (loading) return <div className="loading">Chargement en cours...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="suivi-container">
      <h2>Suivi des paiements</h2>

      <div className="filtre-buttons">
        <button 
          onClick={() => setFiltre('toutes')} 
          className={filtre === 'toutes' ? 'active' : ''}
        >
          Toutes
        </button>
        <button 
          onClick={() => setFiltre('payees')} 
          className={filtre === 'payees' ? 'active' : ''}
        >
          Payées
        </button>
        <button 
          onClick={() => setFiltre('impayees')} 
          className={filtre === 'impayees' ? 'active' : ''}
        >
          Impayées
        </button>
      </div>

      <table className="table-paiement">
        <thead>
          <tr>
            <th>Client</th>
            <th>Description</th>
            <th>Date</th>
            <th>Montant TTC</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {facturesFiltrees.map((facture) => (
            <tr key={facture.id || facture._id}>
              <td>{facture.clientNom || 'Non spécifié'}</td>
              <td>{facture.description || 'Aucune description'}</td>
              <td>{facture.dateEmission}</td>
              <td>
                {typeof facture.montantTTC === 'number' 
                  ? facture.montantTTC.toFixed(2) + ' €'
                  : 'Montant invalide'}
              </td>
              <td>
                <span className={`badge ${facture.estPayee ? 'payee' : 'impayee'}`}>
                  {facture.estPayee ? 'Payée' : 'Impayée'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SuiviPaiement;