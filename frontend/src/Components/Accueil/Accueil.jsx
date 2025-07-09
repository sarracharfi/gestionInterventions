import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import SignUpModal from "../SignUp/SignUpModal";
import LoginModal from "../Login/LoginModal";
import styles from "./accueil.module.css";


const Accueil = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [readMore, setReadMore] = useState(false);

  const images = [
    "/src/assets/dd.jpg",
    "/src/assets/s3.jpg",
    "/src/assets/emb.jpg",


  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleReadMore = () => {
    setReadMore(!readMore);
  };

  return (
    <div className={styles.mainContainer}>
      <Navbar
        onLoginClick={() => setIsLoginModalOpen(true)}
        onSignUpClick={() => setIsSignUpModalOpen(true)}
      />
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <header className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.carouselContainer}>
            <img
              src={images[currentImageIndex]}
              alt="Illustration"
              className={styles.carouselImage}
            />
          </div>

          <button onClick={toggleReadMore} className={styles.readMoreBtn}>
            {readMore ? "Réduire" : "Lire plus"}
          </button>

          {readMore && (
            <div className={styles.readMoreContent}>
              <p>
                La gestion des interventions techniques pour les systèmes embarqués permet un suivi intelligent,
                précis et réactif des opérations de maintenance, de diagnostic ou d’optimisation logicielle.
                Elle est cruciale dans des domaines comme l'automobile, l'aéronautique, ou encore l'industrie 4.0.
                Notre plateforme propose une solution intégrée pour planifier, superviser et optimiser
                l'ensemble du cycle de vie des interventions avec une traçabilité complète et une réduction des temps d'arrêt.
              </p>
            </div>
          )}
        </div>
      </header>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.logoSection}>
            <h2 className={styles.logo}>Capgemini</h2>
            <p className={styles.slogan}>Solutions intelligentes pour systèmes embarqués</p>
          </div>

          <div className={styles.linkColumn}>
            <h4>Navigation</h4>
            <a href="/about">À Propos</a>
            <a href="/contact">Contact</a>
           
          </div>

          <div className={styles.linkColumn}>
            <h4>Support</h4>
            <a href="#">Centre d'aide</a>
            <a href="#">FAQ</a>
          </div>

          <div className={styles.linkColumn}>
            <h4>Réseaux</h4>
            <a href="#">Facebook</a>
            <a href="#">LinkedIn</a>
            <a href="#">Twitter</a>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.socialIcons}>
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
            <a href="#"><i className="fab fa-github"></i></a>
          </div>
          <p>© {new Date().getFullYear()} Votre Entreprise. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Accueil;
