import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { createAdmin, signIn } from "../../Services/userservice";

const FormulaireAdmin = () => {
  const navigate = useNavigate();
  const role = "admin";

  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role, // bien garder 'role' car dans backend c'est 'role'
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const validateField = (name, value) => {
    let error = "";
    if (name === "email") {
      if (!value) error = "Email est obligatoire";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Email invalide";
    }
    if (name === "password") {
      if (!value) error = "Mot de passe requis";
      else if (value.length < 8) error = "Min. 8 caractères";
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
    setFormData({ ...formData, [name]: value });
    if (formError) setFormError("");
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    ["email", "password"].forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setFormError("Corrigez les erreurs du formulaire");
      return;
    }
    try {
      await createAdmin(formData);
      const res = await signIn({
        email: formData.email.trim(),
        password: formData.password.trim(),
      });

      alert(`Bienvenue ${res.user?.email || "Admin"} !`);
      setFormError("");
      setFormData({ email: "", password: "", role });
      setIsSignUpMode(false);
      navigate("/profiles/admin");
    } catch (error) {
      setFormError(error.message || "Erreur lors de l'inscription");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setFormError("Corrigez les erreurs du formulaire");
      return;
    }

    try {
      const res = await signIn({
        email: formData.email.trim(),
        password: formData.password.trim(),
      });
      alert(`Bienvenue ${res.user?.email || "Admin"} !`);
      setFormError("");
      navigate("/profiles/admin");
    } catch (error) {
      setFormError("Connexion échouée. Vérifiez vos identifiants.");
    }
  };

  return (
    <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">

          {/* Connexion */}
          <form onSubmit={handleSignIn} className="sign-in-form">
            <h2 className="title">Connexion Admin</h2>
            {formError && <div className="form-error">{formError}</div>}

            <div className="input-field">
              <MdEmail className="icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              {errors.email && <small className="error-text">{errors.email}</small>}
            </div>

            <div className="input-field">
              <FaLock className="icon" />
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              {errors.password && <small className="error-text">{errors.password}</small>}
            </div>

            <input type="submit" value="Se connecter" className="btn solid" />
          </form>

          {/* Inscription */}
          <form onSubmit={handleSignUp} className="sign-up-form">
            <h2 className="title">Inscription Admin</h2>
            {formError && <div className="form-error">{formError}</div>}

            <div className="input-field">
              <MdEmail className="icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              {errors.email && <small className="error-text">{errors.email}</small>}
            </div>

            <div className="input-field">
              <FaLock className="icon" />
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              {errors.password && <small className="error-text">{errors.password}</small>}
            </div>

            <input type="submit" value="S'inscrire" className="btn solid" />
          </form>

        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>Nouvel admin ?</h3>
            <p>C'est par ici</p>
            <button
              className="btn transparent"
              onClick={() => {
                setIsSignUpMode(true);
                setFormError("");
                setErrors({});
              }}
            >
              S'inscrire
            </button>
          </div>
        </div>

        <div className="panel right-panel">
          <div className="content">
            <h3>Vous avez déjà un compte ?</h3>
            <p>Connectez-vous ici</p>
            <button
              className="btn transparent"
              onClick={() => {
                setIsSignUpMode(false);
                setFormError("");
                setErrors({});
              }}
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormulaireAdmin;
