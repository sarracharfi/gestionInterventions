import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import './rapport.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Rapport = () => {
  const [periode, setPeriode] = useState('mensuel');
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [moisSelectionne, setMoisSelectionne] = useState(null);
  const [data, setData] = useState([]);

  // Chargement données
  const fetchRapport = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/factures', {
        params: { annee },
      });

      const processedData = res.data.map((f) => {
        const quantite = parseFloat(f.quantite) || 0;
        const prixUnitaire = parseFloat(f.prixUnitaire) || 0;
        const tva = parseFloat(f.tva) || 0;

        const montantHT = quantite * prixUnitaire;
        const montantTVA = montantHT * (tva / 100);
        const montantTTC = montantHT + montantTVA;

        return {
          ...f,
          montantHT,
          montantTVA,
          montantTTC,
          dateEmission: f.dateEmission || f.date || '',
        };
      });

      setData(processedData);
      setMoisSelectionne(null);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
    }
  };

  useEffect(() => {
    fetchRapport();
  }, [annee]);

  // Filtrer selon période et mois
  const filteredData = () => {
    if (periode === 'annuel') return data;
    if (moisSelectionne === null) return [];
    return data.filter((f) => {
      const dateObj = new Date(f.dateEmission || f.date);
      return dateObj.getFullYear() === annee && dateObj.getMonth() === moisSelectionne;
    });
  };

  // Calculs financiers selon filtre actif (période + mois)
  const calculIndicateurs = () => {
    const factures = periode === 'annuel' ? data : filteredData();

    const totalDette = factures.reduce(
      (acc, f) => (!f.estPayee ? acc + (parseFloat(f.montantTTC) || 0) : acc),
      0,
    );
    const totalBenefice = factures.reduce(
      (acc, f) => (f.estPayee ? acc + (parseFloat(f.montantTTC) || 0) : acc),
      0,
    );
    const totalCredit = totalBenefice; // ici crédit = bénéfice (adapter selon besoin)
    const differenceBudgetaire = totalBenefice - totalDette;

    return { totalDette, totalBenefice, totalCredit, differenceBudgetaire };
  };

  const { totalDette, totalBenefice, totalCredit, differenceBudgetaire } = calculIndicateurs();

  // Résumé financier tableau
  const resumeFinancier = [
    { nom: 'Dette (impayés)', valeur: totalDette },
    { nom: 'Bénéfice (payés)', valeur: totalBenefice },
    { nom: 'Crédit', valeur: totalCredit },
    { nom: 'Différence budgétaire', valeur: differenceBudgetaire },
  ];

  // Données PieChart Dette vs Bénéfice
  const pieDataResume = [
    { name: 'Dette', value: totalDette },
    { name: 'Bénéfice', value: totalBenefice },
  ].filter((d) => d.value > 0);

  // Données BarChart indicateurs
  const barDataResume = resumeFinancier.map((item) => ({
    nom: item.nom,
    valeur: Number(item.valeur.toFixed(2)),
  }));

  // Total montant TTC factures filtrées (pour tableau)
  const totalMontant = filteredData()
    .reduce((acc, val) => acc + (parseFloat(val.montantTTC) || 0), 0)
    .toFixed(2);

  // Gestion clic mois
  const handleMoisClick = (index) => {
    setPeriode('mensuel');
    setMoisSelectionne(index === moisSelectionne ? null : index);
  };

  // Export PDF (resume + tableau factures)
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Rapport ${periode} - ${annee}`, 14, 20);

    // Résumé financier
    const resumeColumns = ['Indicateur', 'Montant (€)'];
    const resumeRows = resumeFinancier.map((item) => [
      item.nom,
      item.valeur.toFixed(2),
    ]);
    autoTable(doc, {
      startY: 30,
      head: [resumeColumns],
      body: resumeRows,
      styles: { fontSize: 11 },
      headStyles: { fillColor: [220, 220, 220] },
      theme: 'striped',
    });

    // Tableau factures filtrées
    const startYFactures = doc.lastAutoTable.finalY + 10;
    const factureColumns = ['Facture', 'Date', 'Montant TTC (€)', 'Statut'];
    const factureRows = filteredData().map((f) => [
      f.num || f.id || f._id || 'N/A',
      f.dateEmission || 'N/A',
      f.montantTTC.toFixed(2),
      f.estPayee ? 'Payée' : 'Impayée',
    ]);
    autoTable(doc, {
      startY: startYFactures,
      head: [factureColumns],
      body: factureRows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [240, 240, 240] },
      theme: 'grid',
    });

    doc.save(`rapport-${periode}-${annee}${moisSelectionne !== null ? '-' + (moisSelectionne + 1) : ''}.pdf`);
  };

  // Export Excel (resume + tableau factures)
  const exportExcel = () => {
    // Feuille résumé
    const wsResume = XLSX.utils.json_to_sheet(
      resumeFinancier.map((item) => ({
        Indicateur: item.nom,
        'Montant (€)': item.valeur.toFixed(2),
      })),
    );
    // Feuille factures
    const wsFactures = XLSX.utils.json_to_sheet(
      filteredData().map((f) => ({
        Facture: f.num || f.id || f._id || 'N/A',
        Date: f.dateEmission || 'N/A',
        'Montant TTC (€)': f.montantTTC.toFixed(2),
        Statut: f.estPayee ? 'Payée' : 'Impayée',
      })),
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsResume, 'Résumé financier');
    XLSX.utils.book_append_sheet(wb, wsFactures, 'Factures');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `rapport-${periode}-${annee}${moisSelectionne !== null ? '-' + (moisSelectionne + 1) : ''}.xlsx`);
  };

  return (
    <div className="rapport-container" style={{ padding: 30, maxWidth: 1000, margin: 'auto' }}>
      <h2>Rapports Financiers</h2>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <select value={periode} onChange={(e) => setPeriode(e.target.value)}>
          <option value="mensuel">Mensuel</option>
          <option value="annuel">Annuel</option>
        </select>

        <input
          type="number"
          value={annee}
          onChange={(e) => setAnnee(Number(e.target.value))}
          placeholder="Année"
          min="2000"
          max="2100"
        />

        {periode === 'mensuel' && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', maxWidth: '600px' }}>
            {Array.from({ length: 12 }, (_, i) => (
              <button
                key={i}
                style={{
                  padding: '6px 10px',
                  borderRadius: '5px',
                  border: moisSelectionne === i ? '2px solid #3498db' : '1px solid #ccc',
                  backgroundColor: moisSelectionne === i ? '#d6e9ff' : 'white',
                  cursor: 'pointer',
                  fontWeight: moisSelectionne === i ? 'bold' : 'normal',
                  minWidth: '50px',
                }}
                onClick={() => handleMoisClick(i)}
              >
                {new Date(0, i).toLocaleString('fr-FR', { month: 'short' })}
              </button>
            ))}
          </div>
        )}

        <button onClick={exportPDF}>Exporter PDF</button>
        <button onClick={exportExcel}>Exporter Excel</button>
      </div>

      {/* Tableau résumé financier */}
      <table
        border="1"
        cellPadding="8"
        style={{ marginBottom: 20, width: '100%', borderCollapse: 'collapse' }}
      >
        <thead>
          <tr>
            <th>Indicateur</th>
            <th>Montant (€)</th>
          </tr>
        </thead>
        <tbody>
          {resumeFinancier.map((item, i) => (
            <tr
              key={i}
              style={{ fontWeight: item.nom === 'Différence budgétaire' ? 'bold' : 'normal' }}
            >
              <td>{item.nom}</td>
              <td>{item.valeur.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tableau factures simplifié */}
      <table
        border="1"
        cellPadding="10"
        style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 40 }}
      >
        <thead>
          <tr>
            <th>Facture</th>
            <th>Date</th>
            <th>Montant TTC (€)</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {filteredData().length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>
                Aucune facture à afficher
              </td>
            </tr>
          ) : (
            filteredData().map((facture, i) => (
              <tr key={i}>
                <td>{facture.num || facture.id || facture._id || 'N/A'}</td>
                <td>{facture.dateEmission || 'N/A'}</td>
                <td>{facture.montantTTC.toFixed(2)}</td>
                <td>{facture.estPayee ? 'Payée' : 'Impayée'}</td>
              </tr>
            ))
          )}
        </tbody>
        {filteredData().length > 0 && (
          <tfoot>
            <tr>
              <td colSpan="2">
                <strong>Total</strong>
              </td>
              <td colSpan="2">
                <strong>{totalMontant} €</strong>
              </td>
            </tr>
          </tfoot>
        )}
      </table>

      {/* Graphiques résumé financier */}
      <div
        style={{
          display: 'flex',
          gap: 30,
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: 50,
        }}
      >
        {/* PieChart Dette vs Bénéfice */}
        <div style={{ width: 300, height: 300 }}>
          <h4>Dette vs Bénéfice</h4>
          {pieDataResume.length === 0 ? (
            <p>Aucune donnée.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieDataResume}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieDataResume.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => val.toFixed(2) + ' €'} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* BarChart indicateurs financiers */}
        <div style={{ width: 400, height: 300 }}>
          <h4>Indicateurs financiers</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barDataResume}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="nom" />
              <YAxis />
              <Tooltip formatter={(val) => val.toFixed(2) + ' €'} />
              <Bar dataKey="valeur" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Rapport;
