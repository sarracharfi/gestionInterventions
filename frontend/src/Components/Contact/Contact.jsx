import React from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFax,
  FaPaperPlane,
} from "react-icons/fa";
import styles from "./Contact.module.css";
import Navbar from "../Navbar/Navbar";

const Contact = () => {
  return (
    <>
      <Navbar />
      <div className={styles.contactPage}>
        <div className={styles.contactLeft}>
          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <div className={styles.iconCircle}>
                <FaMapMarkerAlt className={styles.contactIcon} />
              </div>
              <h3>NOTRE BUREAU PRINCIPAL</h3>
              <p>Parc Technologique El Ghazala Bloc N°3 Route de Raoued Km 3,5 </p>
              <p>Ariana, Tunisie, 2088, Tunisie</p>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.iconCircle}>
                <FaPhone className={styles.contactIcon} />
              </div>
              <h3>NUMÉRO DE TÉLÉPHONE</h3>
              <p> 31 378 800</p>
         </div>

            <div className={styles.contactCard}>
              <div className={styles.iconCircle}>
                <FaEnvelope className={styles.contactIcon} />
              </div>
              <h3>E-MAIL</h3>
              <p>capgemini@capgemini.com</p>
            </div>
          </div>
        </div>

        <div className={styles.contactRight}>
          <h2>Nous contacter</h2>
          <form className={styles.contactForm}>
            <input type="text" placeholder="Entrez votre nom" required />
            <input type="email" placeholder="Entrez votre adresse email" required />
            <textarea placeholder="Votre message" rows="6" required></textarea>
            <button type="submit" className={styles.submitBtn}>
              NOUS FAIRE PARVENIR
              <FaPaperPlane style={{ marginLeft: "8px" }} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contact;
