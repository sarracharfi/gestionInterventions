import React, { useState } from "react";
import styles from "./sideBarComptable.module.css";
import { NavLink, useLocation } from "react-router-dom";

const SideBarComptable = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className={`${styles.sideBar} ${collapsed ? styles.collapsed : ""}`}>
            <div className={styles.logoContainer}>
                <img src="/src/assets/sigle.jpg" alt="icon" className={styles.logo} />
                <h2 className={styles.title}>Comptable</h2>
            </div>

            <div className={styles.burgerContainer} onClick={toggleSidebar}>
                <div className={styles.burgerMenu}></div>
            </div>

            <div className={styles.profileContainer}>
                <img src="/src/assets/profile-comptable.png" alt="profile" className={styles.profileImage} />
                <div className={styles.profileContents}>
                    <p className={styles.name}>Bonjour, sarra</p>
                    <p className={styles.email}>comptable@entreprise.com</p>
                </div>
            </div>

            <div className={styles.contentsContainer}>
                <ul>

                    <ul>
                        <li className={location.pathname.includes("/factures") ? styles.active : ""}>
                            <NavLink to="factures">Gestion des Factures</NavLink>
                        </li>
                        <li className={location.pathname.includes("/suivi-paiements") ? styles.active : ""}>
                            <NavLink to="suivi-paiements">Suivi des Paiements</NavLink>
                        </li>
                        <li className={location.pathname.includes("/rapports-financiers") ? styles.active : ""}>
                            <NavLink to="rapports-financiers">Rapports Financiers</NavLink>
                        </li>
                        <li className={location.pathname.includes("/parametres-facturation") ? styles.active : ""}>
                            <NavLink to="parametres-facturation">Prise de rendez-vous</NavLink>
                        </li>
                        
                        <li>
                            <NavLink to="/">Déconnexion</NavLink>
                        </li>
                    </ul>

                </ul>
            </div>
        </div>
    );
};

export default SideBarComptable;
