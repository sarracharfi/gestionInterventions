import React, { useState } from 'react';
import SideBarComptable from './SideBarComptable/SideBarComptable';
import { Outlet } from 'react-router-dom';
import styles from './comptableProfile.module.css';

const ComptableProfile = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <div className={`${styles.sideBar} ${collapsed ? styles.collapsed : ''}`}>
          <div className={styles.sideMenu}>
            <SideBarComptable
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

export default ComptableProfile;
