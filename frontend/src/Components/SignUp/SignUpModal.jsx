import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./signup.module.css";
import FormControl from "@mui/joy/FormControl";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Button from "@mui/joy/Button";
import { FaTimes } from "react-icons/fa"; 

const roleOptions = [
  { label: "Administrateur", value: "admin" },
  { label: "Technicien", value: "technicien" },
  { label: "Client", value: "client" },
  { label: "Comptable", value: "comptable" },
];

const SignUpModal = ({ isOpen, onClose }) => {
  const [selectedRole, setSelectedRole] = useState("admin");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleSignUp = () => {
    onClose();
    navigate(`/signup/${selectedRole}`, {
      state: { role: selectedRole },
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.section}>
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label="close"
      >
        <FaTimes />
      </button>
      <h2>Choisissez votre rôle</h2>
      <div className={styles.roles}>
        <FormControl>
          <RadioGroup
            value={selectedRole}
            onChange={handleChange}
            name="role-radio-group"
          >
            {roleOptions.map((option) => (
              <div key={option.value} className={styles.roleOption}>
                <Radio
                  value={option.value}
                  variant="outlined"
                  checked={selectedRole === option.value}
                />
                <label>{option.label}</label>
              </div>
            ))}
          </RadioGroup>
        </FormControl>

        <div className={styles.btns}>
          <Button
            className={styles.btnStyle}
            onClick={handleSignUp}
            variant="outlined"
            color="primary"
          >
            S'inscrire
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;
