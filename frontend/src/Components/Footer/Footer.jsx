import React from 'react'
import styles from './footer.module.css'
import { FaFacebook, FaRegCopyright, FaGoogle, FaLinkedin, FaLock, FaTwitter, FaUser } from "react-icons/fa";

const Footer = () => {
  return (
    
    <div className={styles.container}>
      <hr/>
      <div className={styles.content}>
        <div className={styles.copyright}>
        <FaRegCopyright className={styles.copyicon} />
        <p className={styles.message}>Copy right</p> 
        </div>
        <div className={styles.media}>
              <a href="#" className={styles.mediaIcon}>
                <FaFacebook />
              </a>
              <a href="#" className={styles.mediaIcon}>
                <FaTwitter />
              </a>
              <a href="#" className={styles.mediaIcon}>
                <FaGoogle />
              </a>
              <a href="#" className={styles.mediaIcon}>
                <FaLinkedin />
              </a>
            </div> 
      </div>
    </div>
  )
}

export default Footer
