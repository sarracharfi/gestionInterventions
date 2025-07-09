import React, { useState } from "react";
import styles from "./navbar.module.css";
import { IoMenu, IoSearch } from "react-icons/io5";
import { NavLink, useLocation } from "react-router-dom";

const Navbar = ({ onLoginClick, onSignUpClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Ajoute ta logique de recherche ici
  };

  return (
    <nav className={styles.container}>
      <a className={styles.title} href="/">
        <img className={styles.logo} src="/src/assets/logo.png" alt="Logo" />
      </a>

      <form className={styles.searchContainer} onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className={styles.searchButton} aria-label="Search">
          <IoSearch />
        </button>
      </form>

      <div className={styles.menu}>
        <button
          className={styles.menuBtn}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <IoMenu />
        </button>

        <ul
          className={`${styles.menuItems} ${menuOpen ? styles.menuOpen : ""}`}
          onClick={() => setMenuOpen(false)} // ferme le menu quand on clique sur un item
        >
          <li className={location.pathname === "/" ? styles.active : ""}>
            <NavLink to="/">Accueil</NavLink>
          </li>
          <li>
            <div className={styles.buttons}>
              <button className={styles.btnSign} onClick={onSignUpClick}>
                S'inscrire
              </button>
              <button className={styles.btnLog} onClick={onLoginClick}>
                connecter
              </button>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
