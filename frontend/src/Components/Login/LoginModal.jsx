import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './login.module.css';
import { Button, TextField } from "@mui/material";
import { FaTimes } from "react-icons/fa"; 
import { signIn } from "../Services/userservice";

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { token, role } = await signIn({ email, password });
      localStorage.setItem("token", token);
      redirectToDashboard(role);
      handleClose();
    } catch (err) {
      let msg = "Erreur, Réessayez.";
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    }
  };

  const redirectToDashboard = (role) => {
    const routes = {
      admin: "/dashboard/admin",
      technicien: "/dashboard/technicien",
      client: "/dashboard/client",
      comptable: "/dashboard/comptable",
    };
    navigate(routes[role] || "/");
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button 
          className={styles.closeButton} 
          onClick={handleClose}
          aria-label="close"
        >
          <FaTimes />
        </button>
        <div className={styles.modalHeader}>
          <h2>Connexion</h2>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <TextField
              className={styles.textfield}
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
              fullWidth
            />
          </div>
          <div className={styles.formGroup}>
            <TextField
              className={styles.textfield}
              type="password"
              label="Mot de passe"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
          </div>
          <div className={styles.btns}>
            <Button 
              className={styles.btnStyle}
              variant="contained"
              type="submit" 
              color="primary"
            >
              Connecté
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
