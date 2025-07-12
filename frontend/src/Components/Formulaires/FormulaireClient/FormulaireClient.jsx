import React, { useState, useEffect } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn, MdHome } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../Navbar/Navbar";
import SignUpModal from "../../SignUp/SignUpModal";
import LoginModal from "../../Login/LoginModal";
import { getUsers, createClient, signIn } from "../../Services/userservice";
import "./formulaireclient.css";

const FormulaireClient = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.pathname.split("/").pop();

  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    role,
    telephone: "",
    ville: "",
    adresse: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    getUsers().catch(() =>
      setFormError("Échec du chargement des utilisateurs.")
    );
  }, []);

  if (role !== "client") {
    return <div>Accès invalide au formulaire client</div>;
  }

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        if (!value) error = "Email est obligatoire";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Email invalide";
        break;
      case "password":
        if (!value) error = "Mot de passe requis";
        else if (value.length < 8) error = "Min. 8 caractères";
        break;
      case "nom":
      case "prenom":
      case "telephone":
        if (!value) error = "Champ requis";
        break;
      default:
        break;
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

    if (isSignUpMode) {
      ["nom", "prenom", "email", "password", "telephone"].forEach((key) => {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      });
    } else {
      ["email", "password"].forEach((key) => {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      });
    }

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
      await createClient(formData); // Enregistrement client
      const res = await signIn({
        email: formData.email.trim(),
        password: formData.password.trim(),
      }); // Connexion automatique après inscription

      alert(`Bienvenue ${res.user?.nom || "Client"} !`);
      setFormError("");

      // Réinitialiser le formulaire
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        role,
        telephone: "",
        ville: "",
        adresse: "",
      });
      setIsSignUpMode(false);
      navigate("/profiles/client"); // Rediriger vers espace client
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
      alert(`Bienvenue ${res.user?.nom || "Client"} !`);
      setFormError("");
      navigate("/profiles/client");
    } catch (error) {
      setFormError("Connexion échouée. Vérifiez vos identifiants.");
    }
  };

  return (
    <>
      <Navbar
        onLoginClick={() => setIsLoginModalOpen(true)}
        onSignUpClick={() => setIsSignUpModalOpen(true)}
      />
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
        <div className="forms-container">
          <div className="signin-signup">

            {/* Connexion */}
            <form onSubmit={handleSignIn} className="sign-in-form">
              <h2 className="title">Connexion Client</h2>
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
              <h2 className="title">Inscription Client</h2>
              {formError && <div className="form-error">{formError}</div>}

              <div className="input-field">
                <FaUser className="icon" />
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                />
                {errors.nom && <small className="error-text">{errors.nom}</small>}
              </div>

              <div className="input-field">
                <FaUser className="icon" />
                <input
                  type="text"
                  name="prenom"
                  placeholder="Prénom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  required
                />
                {errors.prenom && <small className="error-text">{errors.prenom}</small>}
              </div>

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

              <div className="input-field">
                <MdPhone className="icon" />
                <input
                  type="text"
                  name="telephone"
                  placeholder="Téléphone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  required
                />
                {errors.telephone && <small className="error-text">{errors.telephone}</small>}
              </div>

              <div className="input-field">
                <MdLocationOn className="icon" />
                <input
                  type="text"
                  name="ville"
                  placeholder="Ville (optionnel)"
                  value={formData.ville}
                  onChange={handleInputChange}
                />
              </div>

              <div className="input-field">
                <MdHome className="icon" />
                <input
                  type="text"
                  name="adresse"
                  placeholder="Adresse (optionnel)"
                  value={formData.adresse}
                  onChange={handleInputChange}
                />
              </div>

              <input type="submit" value="S'inscrire" className="btn solid" />
            </form>

          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>Nouvel utilisateur ?</h3>
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
    </>
  );
};

export default FormulaireClient;
