import React from 'react';
import styles from "./About.module.css";

const About = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>À propos</h1>
        <div className={styles.divider}></div>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>📱</div>
            <h2 className={styles.sectionTitle}>Notre Plateforme</h2>
          </div>
          <p className={styles.description}>
            Solution spécialisée pour le domaine embarqué chez Capgemini, développée  pour une gestion centralisée et intuitive des interventions techniques, sur site ou à distance.
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>🎯</div>
            <h2 className={styles.sectionTitle}>Objectifs Clés</h2>
          </div>
          <ul className={styles.featuresList}>
            <li className={styles.featureItem}>
              <span className={styles.featureIcon}>→</span>
              <div>
                <h3>Optimisation</h3>
                <p>Planification et suivi des interventions</p>
              </div>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.featureIcon}>→</span>
              <div>
                <h3>Communication</h3>
                <p>Liaison techniciens/superviseurs</p>
              </div>
            </li>
            
            <li className={styles.featureItem}>
              <span className={styles.featureIcon}>→</span>
              <div>
                <h3>Qualité</h3>
                <p>Amélioration du service et réactivité</p>
              </div>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>✨</div>
            <h2 className={styles.sectionTitle}>Fonctionnalités</h2>
          </div>
          <div className={styles.cardContainer}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🔒</div>
              <h3 className={styles.cardTitle}>Sécurité renforcée</h3>
              <p className={styles.cardText}>Protocoles sécurisés pour toutes les opérations</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>⚙️</div>
              <h3 className={styles.cardTitle}>Processus optimisés</h3>
              <p className={styles.cardText}>Workflows rationalisés pour gain de temps</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>📊</div>
              <h3 className={styles.cardTitle}>Reporting complet</h3>
              <p className={styles.cardText}>Données structurées pour analyse</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;