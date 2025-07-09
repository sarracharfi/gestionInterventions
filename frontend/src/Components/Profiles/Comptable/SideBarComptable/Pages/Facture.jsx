import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaTrash, FaEdit, FaFilePdf } from 'react-icons/fa';
import './facture.css';

const API_URL = 'http://localhost:3000/api/factures';

const Facture = () => {
  const [factures, setFactures] = useState([]);
  const [editId, setEditId] = useState(null);
  const [derniereFacture, setDerniereFacture] = useState(null);

  const [form, setForm] = useState({
    description: '',
    quantite: '',
    unite: 'h',
    prixUnitaire: '',
    tva: 20,
    dateEmission: '',
    estPayee: false,
    clientNom: '',
    clientAdresse: '',
    clientCodePostal: '',
    clientVille: '',
  });

  // Récupération de toutes les factures au chargement pour vérifier si id existe
  const fetchFactures = async () => {
    try {
      const res = await axios.get(API_URL);
      setFactures(res.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des factures:", err);
    }
  };

  useEffect(() => {
    fetchFactures();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const montantHT = form.quantite * form.prixUnitaire;
      const montantTVA = montantHT * (form.tva / 100);
      const montantTTC = montantHT + montantTVA;

      const factureData = {
        ...form,
        montantHT,
        montantTVA,
        montantTTC,
        dateEmission: form.dateEmission || new Date().toISOString().split('T')[0]
      };

      if (editId) {
        await axios.put(`${API_URL}/${editId}`, factureData);
        setEditId(null);
      } else {
        const res = await axios.post(API_URL, factureData);
        factureData.id = res.data.id || res.data._id; // S'assurer d'avoir l'id
      }

      setDerniereFacture(factureData);
      fetchFactures();

      setForm({
        description: '',
        quantite: '',
        unite: 'h',
        prixUnitaire: '',
        tva: 20,
        dateEmission: '',
        estPayee: false,
        clientNom: '',
        clientAdresse: '',
        clientCodePostal: '',
        clientVille: '',
      });

    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      alert("Facture sans ID, impossible de supprimer !");
      return;
    }
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        if (derniereFacture && (derniereFacture.id === id || derniereFacture._id === id)) {
          setDerniereFacture(null);
        }
        fetchFactures();
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        alert("Erreur lors de la suppression de la facture");
      }
    }
  };

  const handleEdit = (facture) => {
    setForm(facture);
    setEditId(facture.id || facture._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const telechargerPDF = (facture) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('FACTURE', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text('Capgemini', 20, 45);
    doc.text('Parc Technologique El Ghazala', 20, 50);
    doc.text('Ariana, Tunisie, 2088', 20, 55);

    doc.text('Client', 20, 70);
    doc.text(facture.clientNom || 'Nom client', 20, 75);
    doc.text(facture.clientAdresse || 'Adresse', 20, 80);
    doc.text(`${facture.clientCodePostal || ''} ${facture.clientVille || ''}`, 20, 85);

    doc.text(`Date de facturation: ${facture.dateEmission}`, 120, 40);
    doc.text(`Numéro de facture: ${facture.id || facture._id || 'temp'}`, 120, 45);
    doc.text('Échéance: 30 jours', 120, 50);

    autoTable(doc, {
      startY: 100,
      head: [['Description', 'Quantité', 'Unité', 'Prix HT', 'TVA %', 'Montant TVA', 'Total TTC']],
      body: [[
        facture.description,
        facture.quantite,
        facture.unite,
        `${facture.prixUnitaire.toFixed(2)} €`,
        `${facture.tva}%`,
        `${facture.montantTVA.toFixed(2)} €`,
        `${facture.montantTTC.toFixed(2)} €`
      ]],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [240, 240, 240] }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      body: [
        [`Total HT: ${facture.montantHT.toFixed(2)} €`, { content: '', colSpan: 6 }],
        [`Total TVA: ${facture.montantTVA.toFixed(2)} €`, { content: '', colSpan: 6 }],
        [`Total TTC: ${facture.montantTTC.toFixed(2)} €`, { content: '', colSpan: 6 }],
      ],
      styles: { fontSize: 12, fontStyle: 'bold' },
      columnStyles: { 0: { cellWidth: 40 } }
    });

    doc.save(`facture_${facture.id || facture._id || 'temp'}.pdf`);
  };

  return (
    <div className="facture-container">
      <div className="main-content">

        <form className="facture-form" onSubmit={handleSubmit}>
          <h2>{editId ? 'Modifier une facture' : 'Créer une nouvelle facture'}</h2>

          <div className="form-group">
            <label>Description:</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantité:</label>
              <input
                type="number"
                value={form.quantite}
                onChange={(e) => setForm({ ...form, quantite: parseFloat(e.target.value) })}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Unité:</label>
              <select
                value={form.unite}
                onChange={(e) => setForm({ ...form, unite: e.target.value })}
              >
                <option value="h">Heures</option>
                <option value="j">Jours</option>
                <option value="u">Unités</option>
              </select>
            </div>

            <div className="form-group">
              <label>Prix unitaire (€):</label>
              <input
                type="number"
                step="0.01"
                value={form.prixUnitaire}
                onChange={(e) => setForm({ ...form, prixUnitaire: parseFloat(e.target.value) })}
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label>TVA (%):</label>
              <input
                type="number"
                value={form.tva}
                onChange={(e) => setForm({ ...form, tva: parseFloat(e.target.value) })}
                required
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Date d'émission:</label>
            <input
              type="date"
              value={form.dateEmission}
              onChange={(e) => setForm({ ...form, dateEmission: e.target.value })}
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={form.estPayee}
                onChange={(e) => setForm({ ...form, estPayee: e.target.checked })}
              />
              Facture payée
            </label>
          </div>

          <h3>Informations client</h3>

          <div className="form-group">
            <label>Nom du client:</label>
            <input
              type="text"
              value={form.clientNom}
              onChange={(e) => setForm({ ...form, clientNom: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Adresse:</label>
            <input
              type="text"
              value={form.clientAdresse}
              onChange={(e) => setForm({ ...form, clientAdresse: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Code postal:</label>
              <input
                type="text"
                value={form.clientCodePostal}
                onChange={(e) => setForm({ ...form, clientCodePostal: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Ville:</label>
              <input
                type="text"
                value={form.clientVille}
                onChange={(e) => setForm({ ...form, clientVille: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="submit-button">
            {editId ? 'Mettre à jour la facture' : 'Enregistrer la facture'}
          </button>
          {editId && (
            <button
              type="button"
              className="cancel-button"
              onClick={() => {
                setEditId(null);
                setForm({
                  description: '',
                  quantite: '',
                  unite: 'h',
                  prixUnitaire: '',
                  tva: 20,
                  dateEmission: '',
                  estPayee: false,
                  clientNom: '',
                  clientAdresse: '',
                  clientCodePostal: '',
                  clientVille: '',
                });
              }}
            >
              Annuler
            </button>
          )}
        </form>

        {derniereFacture && (
          <div className="facture-preview">
            <h3>Dernière facture enregistrée</h3>
            <div className="preview-details">
              <p><strong>Description :</strong> {derniereFacture.description}</p>
              <p><strong>Client :</strong> {derniereFacture.clientNom}</p>
              <p><strong>Montant TTC :</strong> {derniereFacture.montantTTC?.toFixed(2)} €</p>
              <p><strong>Statut :</strong>
                <span className={`status-badge ${derniereFacture.estPayee ? 'payee' : 'impayee'}`}>
                  {derniereFacture.estPayee ? 'Payée' : 'Impayée'}
                </span>
              </p>
            </div>
            <div className="preview-actions">
              <button
                className="action-button pdf-button"
                onClick={() => telechargerPDF(derniereFacture)}
              >
                <FaFilePdf /> Télécharger PDF
              </button>
              <button
                className="action-button edit-button"
                onClick={() => handleEdit(derniereFacture)}
              >
                <FaEdit /> Modifier
              </button>
              <button
                className="action-button delete-button"
                onClick={() => handleDelete(derniereFacture.id || derniereFacture._id)}
              >
                <FaTrash /> Supprimer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Facture;
