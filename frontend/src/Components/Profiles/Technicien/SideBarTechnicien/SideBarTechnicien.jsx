import React, { useState } from "react";
import styles from "./sideBarTechnicien.module.css"; 
import { NavLink, useLocation } from "react-router-dom";

const SideBarTechnicien = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className={`${styles.sideBar} ${collapsed ? styles.collapsed : ""}`}>
            <div className={styles.logoContainer}>
                <img src="/src/assets/sigle-technicien.jpg" alt="icon" className={styles.logo} />
                <h2 className={styles.title}>Technicien</h2>
            </div>

            <div className={styles.burgerContainer} onClick={toggleSidebar}>
                <div className={styles.burgerMenu}></div>
            </div>

            <div className={styles.profileContainer}>
                <img src="/src/assets/technichen.png" alt="profile" className={styles.profileImage} />
                <div className={styles.profileContents}>
                    <p className={styles.name}>Bonjour, sarra</p>
                    <p className={styles.email}>technicien@entreprise.com</p>
                </div>
            </div>

            <div className={styles.contentsContainer}>
                <ul>
                    <li className={location.pathname.includes("/geolocalisation") ? styles.active : ""}>
                        <NavLink to="geolocalisation">Géolocalisation</NavLink>
                    </li>
                    <li className={location.pathname.includes("/interventions") ? styles.active : ""}>
                        <NavLink to="interventions">Gestion des interventions</NavLink>
                    </li>
                    <li className={location.pathname.includes("/prise-rendez-vous") ? styles.active : ""}>
                        <NavLink to="prise-rendez-vous">Prise de rendez-vous</NavLink>
                    </li>
                    <li className={location.pathname.includes("/rapports") ? styles.active : ""}>
                        <NavLink to="rapports">Rapports d’intervention</NavLink>
                    </li>
                    <li className={location.pathname.includes("/materiels") ? styles.active : ""}>
                        <NavLink to="materiels">Gestion du matériel</NavLink>
                    </li>
                    <li>
                        <NavLink to="/">Déconnexion</NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SideBarTechnicien;
