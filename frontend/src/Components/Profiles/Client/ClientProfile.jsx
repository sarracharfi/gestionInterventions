import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styles from './clientProfile.module.css';
import SideBarClient from './SideBarClient/SideBarClient'; // Vérifie le bon chemin !

const ClientProfile = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <div className={`${styles.sideBar} ${collapsed ? styles.collapsed : ''}`}>
          <div className={styles.sideMenu}>
            <SideBarClient
              collapsed={collapsed}
              setCollapsed={setCollapsed}
            />
          </div>
        </div>
        <div className={`${styles.body} ${collapsed ? styles.collapsedBody : ''}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
