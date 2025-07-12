import React, { useState } from "react";
import styles from "./sidebarclient.module.css"
import { NavLink, useLocation } from "react-router-dom";

const SideBarClient = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className={`${styles.sideBar} ${collapsed ? styles.collapsed : ""}`}>
            <div className={styles.logoContainer}>
                <img src="/src/assets/sigle-client.png" alt="icon" className={styles.logo} />
                <h2 className={styles.title}>Client</h2>
            </div>

            <div className={styles.burgerContainer} onClick={toggleSidebar}>
                <div className={styles.burgerMenu}></div>
            </div>

            <div className={styles.profileContainer}>
                <img src="/src/assets/client.png" alt="profile" className={styles.profileImage} />
                <div className={styles.profileContents}>
                    <p className={styles.name}>Bonjour, Sarra</p>
                    <p className={styles.email}>client@entreprise.com</p>
                </div>
            </div>

            <div className={styles.contentsContainer}>
                <ul>
                    <li className={location.pathname.includes("/creer-intervention") ? styles.active : ""}>
                        <NavLink to="creer-intervention">Demande Intervention</NavLink>
                    </li>
                    <li className={location.pathname.includes("/mes-interventions") ? styles.active : ""}>
                        <NavLink to="mes-interventions">Prise de Rendez-vous</NavLink>
                    </li>
                    <li className={location.pathname.includes("/suivi-technicien") ? styles.active : ""}>
                        <NavLink to="suivi-technicien">Suivi du Technicien</NavLink>
                    </li>
                    <li className={location.pathname.includes("/factures-client") ? styles.active : ""}>
                        <NavLink to="factures-client">Mes Factures</NavLink>
                    </li>
                    <li className={location.pathname.includes("/avis-technicien") ? styles.active : ""}>
                        <NavLink to="avis-technicien">Avis & Notation</NavLink>
                    </li>
                    <li>
                        <NavLink to="/">Déconnexion</NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SideBarClient;
