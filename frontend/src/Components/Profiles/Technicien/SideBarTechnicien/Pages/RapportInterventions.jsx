import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const RapportIntervention = () => {
   const loadFromLocalStorage = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

   const [clientData, setClientData] = useState(
    loadFromLocalStorage('clientData', {
      clientNom: "",
      clientAdresse: "",
      clientVille: "",
      clientTelephone: "",
      clientEmail: "",
      technicien: "",
      dateInterventionPrevue: "",
      reference: "",
    })
  );

  const [items, setItems] = useState(loadFromLocalStorage('interventionItems', []));
  const [newItem, setNewItem] = useState({ reference: "", quantity: "", price: "" });
  const [editingIndex, setEditingIndex] = useState(null);

  // Sauvegarde automatique
  useEffect(() => {
    localStorage.setItem('clientData', JSON.stringify(clientData));
    localStorage.setItem('interventionItems', JSON.stringify(items));
  }, [clientData, items]);

  // Gestion des changements
  const handleClientChange = (e) => {
    setClientData({ ...clientData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  // Opérations CRUD
  const handleAddItem = () => {
    if (newItem.reference && newItem.quantity && newItem.price) {
      if (editingIndex !== null) {
        const updatedItems = [...items];
        updatedItems[editingIndex] = newItem;
        setItems(updatedItems);
        setEditingIndex(null);
      } else {
        setItems([...items, newItem]);
      }
      setNewItem({ reference: "", quantity: "", price: "" });
    }
  };

  const handleEditItem = (index) => {
    setNewItem(items[index]);
    setEditingIndex(index);
  };

  const handleDeleteItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const clearAllData = () => {
    if (window.confirm("Êtes-vous sûr de vouloir effacer toutes les données ?")) {
      localStorage.removeItem('clientData');
      localStorage.removeItem('interventionItems');
      setClientData({
        clientNom: "",
        clientAdresse: "",
        clientVille: "",
        clientTelephone: "",
        clientEmail: "",
        technicien: "",
        dateInterventionPrevue: "",
        reference: "",
      });
      setItems([]);
    }
  };

  // Génération PDF
  const downloadPDF = () => {
    try {
      const {
        clientNom,
        clientAdresse,
        clientVille,
        clientTelephone,
        clientEmail,
        technicien,
        dateInterventionPrevue,
        reference,
      } = clientData;

      // Validation
      if (!clientNom || !clientAdresse || !clientVille || !clientTelephone || 
          !clientEmail || !technicien || !dateInterventionPrevue) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
      }

      const doc = new jsPDF();
      
      // En-tête
      doc.setFontSize(18);
      doc.text("Rapport d'Intervention", 14, 20);
      
      // Informations client
      doc.setFontSize(12);
      doc.text(`Client : ${clientNom}`, 14, 30);
      doc.text(`Adresse : ${clientAdresse}, ${clientVille}`, 14, 38);
      doc.text(`Téléphone : ${clientTelephone}`, 14, 46);
      doc.text(`Email : ${clientEmail}`, 14, 54);
      doc.text(`Date prévue : ${dateInterventionPrevue}`, 14, 62);
      doc.text(`Technicien : ${technicien}`, 14, 70);
      doc.text(`Référence : ${reference}`, 14, 78);

      // Tableau des articles
      const itemData = items.map((item) => [
        item.reference, 
        item.quantity, 
        `${parseFloat(item.price).toFixed(2)} €`
      ]);

      autoTable(doc, {
        startY: 85,
        head: [["Référence", "Quantité", "Prix"]],
        body: itemData.length > 0 ? itemData : [["-", "-", "-"]],
      });

      // Calcul et affichage du total
      const total = items.reduce(
        (sum, item) => sum + (parseFloat(item.price) * parseInt(item.quantity)), 
        0
      );

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        body: [[
          { 
            content: `Total: ${total.toFixed(2)} €`, 
            colSpan: 3, 
            styles: { halign: 'right' } 
          }
        ]],
        styles: { fontSize: 14, fontStyle: 'bold' }
      });

      doc.save(`rapport_${reference || "intervention"}.pdf`);
    } catch (error) {
      console.error("Erreur PDF :", error);
      alert("Une erreur est survenue lors de la génération du PDF.");
    }
  };

  // Styles
  const styles = {
    container: {
      fontFamily: "Arial",
      maxWidth: "900px",
      margin: "0 auto",
      padding: "20px",
      border: "1px solid #ccc",
      backgroundColor: "#fff",
    },
    title: {
      textAlign: "center",
      fontSize: "26px",
      marginBottom: "20px",
    },
    formGroup: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      marginBottom: "20px",
    },
    input: {
      flex: "1 1 250px",
      padding: "8px",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    separator: {
      margin: "20px 0",
      borderTop: "1px solid #ccc",
    },
    addButton: {
      padding: "8px 16px",
      backgroundColor: "#28a745",
      color: "#fff",
      border: "none",
      cursor: "pointer",
    },
    editButton: {
      backgroundColor: "#ffc107",
      color: "#000",
      border: "none",
      cursor: "pointer",
      marginRight: "5px",
      padding: "5px 10px",
    },
    deleteButton: {
      backgroundColor: "#dc3545",
      color: "#fff",
      border: "none",
      cursor: "pointer",
      padding: "5px 10px",
    },
    downloadButton: {
      marginTop: "20px",
      backgroundColor: "#007bff",
      color: "#fff",
      padding: "10px 20px",
      border: "none",
      cursor: "pointer",
      marginRight: "10px",
    },
    clearButton: {
      marginTop: "20px",
      backgroundColor: "#dc3545",
      color: "#fff",
      padding: "10px 20px",
      border: "none",
      cursor: "pointer",
    },
    itemsTable: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
    },
    tableHeader: {
      border: "1px solid #ddd",
      backgroundColor: "#f4f4f4",
      padding: "8px",
      textAlign: "left",
    },
    tableCell: {
      border: "1px solid #ddd",
      padding: "8px",
    },
    actionCell: {
      border: "1px solid #ddd",
      padding: "8px",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>RAPPORT D'INTERVENTION</h1>

      <h3>Informations du Client et Intervention</h3>
      <div style={styles.formGroup}>
        {[
          {name: "clientNom", label: "Nom du Client"},
          {name: "clientAdresse", label: "Adresse"},
          {name: "clientVille", label: "Ville"},
          {name: "clientTelephone", label: "Téléphone"},
          {name: "clientEmail", label: "Email", type: "email"},
          {name: "technicien", label: "Technicien"},
          {name: "dateInterventionPrevue", label: "Date prévue", type: "date"},
          {name: "reference", label: "Référence"}
        ].map((field, index) => (
          <input
            key={index}
            type={field.type || "text"}
            name={field.name}
            placeholder={`${field.label} *`}
            value={clientData[field.name]}
            onChange={handleClientChange}
            style={styles.input}
          />
        ))}
      </div>

      <hr style={styles.separator} />

      <h3>Articles de l'intervention</h3>
      <div style={styles.formGroup}>
        <input
          type="text"
          name="reference"
          placeholder="Référence"
          value={newItem.reference}
          onChange={handleItemChange}
          style={styles.input}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantité"
          value={newItem.quantity}
          onChange={handleItemChange}
          style={styles.input}
        />
        <input
          type="number"
          name="price"
          placeholder="Prix (€)"
          value={newItem.price}
          onChange={handleItemChange}
          style={styles.input}
        />
        <button onClick={handleAddItem} style={styles.addButton}>
          {editingIndex !== null ? "Modifier" : "Ajouter"}
        </button>
        {editingIndex !== null && (
          <button 
            onClick={() => {
              setNewItem({ reference: "", quantity: "", price: "" });
              setEditingIndex(null);
            }} 
            style={styles.deleteButton}
          >
            Annuler
          </button>
        )}
      </div>

      {items.length > 0 ? (
        <table style={styles.itemsTable}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Référence</th>
              <th style={styles.tableHeader}>Quantité</th>
              <th style={styles.tableHeader}>Prix (€)</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td style={styles.tableCell}>{item.reference}</td>
                <td style={styles.tableCell}>{item.quantity}</td>
                <td style={styles.tableCell}>{parseFloat(item.price).toFixed(2)}</td>
                <td style={styles.actionCell}>
                  <button
                    onClick={() => handleEditItem(index)}
                    style={styles.editButton}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteItem(index)}
                    style={styles.deleteButton}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucun article ajouté</p>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={downloadPDF} style={styles.downloadButton}>
          📄 Télécharger PDF
        </button>
        <button onClick={clearAllData} style={styles.clearButton}>
          🗑️ Effacer tout
        </button>
      </div>
    </div>
  );
};

export default RapportIntervention;