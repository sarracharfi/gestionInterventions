import React from "react";

const RapportIntervention = ({
  reference = "",
  dateInterventionPrevue = "",
  numeroCommande = "",
  clientId = "",
  clientNom = "",
  clientAdresse = "",
  clientVille = "",
  clientTelephone = "",
  clientEmail = "",
  items = [],
  dateHeureIntervention = "",
  technicien = "",
  societeNom = "",
  societeAdresse = "",
  societeVille = "",
  societeTelephone = "",
  societeEmail = "",
  societeSite = "",
  siren = "",
  tva = ""
}) => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>RAPPORT D'INTERVENTION</h1>
      
      <div style={styles.societeHeader}>
        <h2 style={styles.societeName}>{societeNom}</h2>
        <p style={styles.societeAddress}>{societeAdresse}</p>
        <p style={styles.societeCity}>{societeVille}</p>
        <p style={styles.societePhone}>Téléphone : {societeTelephone}</p>
      </div>

      <hr style={styles.separator} />

      <div style={styles.referenceSection}>
        <p><strong>Référence :</strong> {reference}</p>
        <p><strong>Date d'intervention prévue :</strong> {dateInterventionPrevue}</p>
        <p><strong>Numéro de commande :</strong> {numeroCommande}</p>
        <p><strong>Identifiant du client :</strong> {clientId}</p>
      </div>

      <hr style={styles.separator} />

      <div style={styles.clientSection}>
        <p><strong>{clientNom}</strong></p>
        <p>{clientAdresse}</p>
        <p>{clientVille}</p>
        <p>Téléphone : {clientTelephone}</p>
        <p>E-mail : {clientEmail}</p>
      </div>

      <hr style={styles.separator} />

      <table style={styles.itemsTable}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Référence</th>
            <th style={styles.tableHeader}>Quantité</th>
            <th style={styles.tableHeader}>Prix</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td style={styles.tableCell}>{item.reference}</td>
              <td style={styles.tableCell}>{item.quantity}</td>
              <td style={styles.tableCell}>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr style={styles.separator} />

      <div style={styles.interventionDetails}>
        <p><strong>Date et heure d'intervention :</strong> {dateHeureIntervention}</p>
        <p><strong>Technicien :</strong> {technicien}</p>
      </div>

      <hr style={styles.separator} />

      <div style={styles.photosSignature}>
        <p><strong>Photos :</strong></p>
        <p><strong>Signature :</strong></p>
      </div>

      <hr style={styles.separator} />

      <div style={styles.footer}>
        <p><strong>Siège social</strong></p>
        <p><em>{societeNom}</em></p>
        <p><em>{societeAdresse}</em></p>
        <p><em>{societeVille}</em></p>
        <p><em>N° SIREN : {siren}</em></p>
        <p><em>N° TVA Intra. : {tva}</em></p>

        <hr style={styles.separator} />

        <p><strong>Coordonnées</strong></p>
        <p><em>Téléphone : {societeTelephone}</em></p>
        <p><em>E-mail : {societeEmail}</em></p>
        <p><em>{societeSite}</em></p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ccc"
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "20px"
  },
  societeHeader: {
    marginBottom: "15px"
  },
  societeName: {
    fontSize: "18px",
    marginBottom: "5px"
  },
  separator: {
    margin: "15px 0",
    border: "none",
    borderTop: "1px solid #ccc"
  },
  referenceSection: {
    marginBottom: "15px"
  },
  clientSection: {
    marginBottom: "15px"
  },
  itemsTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "15px"
  },
  tableHeader: {
    borderBottom: "1px solid #000",
    textAlign: "left",
    padding: "8px"
  },
  tableCell: {
    padding: "8px",
    borderBottom: "1px solid #ddd"
  },
  interventionDetails: {
    marginBottom: "15px"
  },
  photosSignature: {
    marginBottom: "15px"
  },
  footer: {
    marginTop: "20px",
    fontSize: "14px"
  }
};

export default RapportIntervention;