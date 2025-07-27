import React, { useState } from 'react';
import SideBarAdmin from './SideBarAdmin/SideBarAdmin';  // ← remplacer par le sidebar admin
import { Outlet } from 'react-router-dom';
import styles from './adminProfile.module.css';          // ← tu peux créer ce fichier CSS ou réutiliser celui existant

const AdminProfile = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <div className={`${styles.sideBar} ${collapsed ? styles.collapsed : ''}`}>
          <div className={styles.sideMenu}>
            <SideBarAdmin
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

export default AdminProfile;
