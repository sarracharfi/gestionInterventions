import React, { useState } from "react";
import styles from "./sideBarAdmin.module.css"; // tu peux dupliquer et adapter le CSS
import { NavLink, useLocation } from "react-router-dom";

const SideBarAdmin = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className={`${styles.sideBar} ${collapsed ? styles.collapsed : ""}`}>
            <div className={styles.logoContainer}>
                <img src="/src/assets/sigle-admin.jpg" alt="icon" className={styles.logo} />
                <h2 className={styles.title}>Admin</h2>
            </div>

            <div className={styles.burgerContainer} onClick={toggleSidebar}>
                <div className={styles.burgerMenu}></div>
            </div>

            <div className={styles.profileContainer}>
                <img src="/src/assets/admin.png" alt="profile" className={styles.profileImage} />
                <div className={styles.profileContents}>
                    <p className={styles.name}>Bonjour, Sarra</p>
                    <p className={styles.email}>admin@entreprise.com</p>
                </div>
            </div>

            <div className={styles.contentsContainer}>
                <ul>
                    <li className={location.pathname.includes("/clients") ? styles.active : ""}>
                        <NavLink to="clients">Gestion des Clients</NavLink>
                    </li>
                    <li className={location.pathname.includes("/techniciens") ? styles.active : ""}>
                        <NavLink to="techniciens">Gestion des Techniciens</NavLink>
                    </li>
                    <li className={location.pathname.includes("/comptables") ? styles.active : ""}>
                        <NavLink to="comptables">Gestion des Comptables</NavLink>
                    </li>
                    <li>
                        <NavLink to="/">Déconnexion</NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SideBarAdmin;
