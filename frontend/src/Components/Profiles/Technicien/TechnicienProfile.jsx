import React, { useState } from 'react';
import SideBarTechnicien from './SideBarTechnicien/SideBarTechnicien';
import { Outlet } from 'react-router-dom';
import styles from './technicienProfile.module.css'; 

const TechnicienProfile = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <div className={`${styles.sideBar} ${collapsed ? styles.collapsed : ''}`}>
          <div className={styles.sideMenu}>
            <SideBarTechnicien
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

export default TechnicienProfile;
