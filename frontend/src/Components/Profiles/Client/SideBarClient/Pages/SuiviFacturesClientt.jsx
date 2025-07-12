import React, { useEffect, useState } from "react";
import axios from "axios";
import "./mesfactures.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFilePdf } from "react-icons/fa";

const API_URL = "http://localhost:3000/api/factures";

const SuiviFacturesClient = () => {
  const [factures, setFactures] = useState([]);
  const [nomClientRecherche, setNomClientRecherche] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(
    "Veuillez saisir un nom client pour lancer la recherche."
  );

  const fetchFactures = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setFactures(res.data);

      const facturesImpayees = res.data.filter((f) => !f.estPayee);
      if (facturesImpayees.length > 0) {
        showUnpaidAlert(facturesImpayees.length);
      }
    } catch (error) {
      console.error("Erreur chargement factures :", error);
      setFactures([]);
      setMessage("Erreur lors du chargement des factures. Veuillez réessayer.");
    }
    setLoading(false);
  };

  const showUnpaidAlert = (count) => {
    toast.warning(`⚠️ Vous avez ${count} facture(s) non payée(s)!`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  useEffect(() => {
    fetchFactures();
  }, []);

  const facturesFiltres = factures.filter((facture) => {
    const nomClient = (facture.clientNom || "").toLowerCase();
    const nomRecherche = nomClientRecherche.trim().toLowerCase();
    return nomRecherche === "" ? false : nomClient.includes(nomRecherche);
  });

  const afficherCodeSuivi = (facture) => {
    const codeSuivi =
      facture.codeSuivi || facture.code_suivi || facture.trackingCode;

    if (codeSuivi && codeSuivi.trim() !== "") {
      return codeSuivi;
    }

    if (facture.dateEmission) {
      const datePart = facture.dateEmission.slice(0, 10).replace(/-/g, "");
      return `FAC${datePart}-TEMP`;
    }

    return "Non disponible";
  };

  // Générer et télécharger PDF facture
  const genererPDF = (facture) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("FACTURE", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text("Votre Société", 20, 40);
    doc.text("Adresse de votre société", 20, 45);
    doc.text("Ville, Pays", 20, 50);

    doc.text("Client:", 20, 70);
    doc.text(facture.clientNom || "Nom client", 20, 75);
    doc.text(facture.clientAdresse || "Adresse client", 20, 80);
    doc.text(`${facture.clientCodePostal || ""} ${facture.clientVille || ""}`, 20, 85);

    doc.text(
      `Date: ${facture.dateEmission || new Date().toLocaleDateString()}`,
      140,
      40
    );
    doc.text(`Facture n°: ${facture.id || facture._id || "N/A"}`, 140, 45);
    doc.text(`Code suivi: ${afficherCodeSuivi(facture)}`, 140, 50);
    doc.text("Échéance: 30 jours", 140, 55);

    autoTable(doc, {
      startY: 100,
      head: [["Description", "Quantité", "Prix unitaire", "TVA", "Montant HT"]],
      body: [
        [
          facture.description || "-",
          Number(facture.quantite) || 1,
          `${Number(facture.prixUnitaire || 0).toFixed(2)} €`,
          `${facture.tva || 0}%`,
          `${Number(facture.montantHT || 0).toFixed(2)} €`,
        ],
      ],
    });

    autoTable(doc, {
      startY: doc.previousAutoTable
        ? doc.previousAutoTable.finalY + 10
        : 120,
      body: [
        [`Total HT: ${Number(facture.montantHT || 0).toFixed(2)} €`, ""],
        [`TVA (${facture.tva || 0}%): ${Number(facture.montantTVA || 0).toFixed(2)} €`, ""],
        [`Total TTC: ${Number(facture.montantTTC || 0).toFixed(2)} €`, ""],
        [`Statut: ${facture.estPayee ? "Payée" : "Non payée"}`, ""],
      ],
      styles: { fontSize: 12, fontStyle: "bold" },
    });

    doc.save(`facture_${afficherCodeSuivi(facture)}.pdf`);
  };

  useEffect(() => {
    if (facturesFiltres.length > 0) {
      const facturesImpayees = facturesFiltres.filter((f) => !f.estPayee);
      if (facturesImpayees.length > 0) {
        toast.info(
          `ℹ️ ${facturesImpayees.length} facture(s) impayée(s) pour ce client`,
          { position: "top-right", autoClose: 3000 }
        );
      }
    }
  }, [facturesFiltres]);

  return (
    <div className="suivi-container">
      <ToastContainer />
      <h2>Rechercher les factures d'un client</h2>

      <div className="search-section">
        <label>
          Nom du client :{" "}
          <input
            type="text"
            value={nomClientRecherche}
            onChange={(e) => setNomClientRecherche(e.target.value)}
            placeholder=""
          />
        </label>
      </div>

      {loading ? (
        <div className="loading-message">Chargement des factures...</div>
      ) : (
        <>
          {nomClientRecherche.trim() === "" || facturesFiltres.length === 0 ? (
            <div className="info-message">{message}</div>
          ) : (
            <table className="facture-table">
              <thead>
                <tr>
                  <th>Code suivi</th>
                  <th>Description</th>
                  <th>Montant TTC (€)</th>
                  <th>Statut paiement</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {facturesFiltres.map((facture) => (
                  <tr
                    key={facture.id || facture._id}
                    className={!facture.estPayee ? "unpaid-row" : ""}
                  >
                    <td className="code-suivi-cell">{afficherCodeSuivi(facture)}</td>
                    <td>{facture.description || "-"}</td>
                    <td>{(Number(facture.montantTTC) || 0).toFixed(2)} €</td>
                    <td>
                      {facture.estPayee ? (
                        <span className="payee">Payée</span>
                      ) : (
                        <span className="impayee">
                          Non payée
                          <button
                            className="reminder-btn"
                            onClick={() =>
                              toast.warning(
                                `Rappel envoyé pour ${afficherCodeSuivi(facture)}`
                              )
                            }
                          >
                            Envoyer rappel
                          </button>
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="pdf-btn"
                        onClick={() => genererPDF(facture)}
                        title="Télécharger PDF"
                      >
                        <FaFilePdf /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default SuiviFacturesClient;
