// AdminDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./dashboardadmin.css";
import { FaUserTie, FaLaptopMedical, FaUserCog } from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const profiles = [
    {
      name: "Client",
      description: "Suivi des demandes et évaluations",
      icon: <FaUserTie size={30} />,
      route: "/dashboard-client",
    },
    {
      name: "Comptable",
      description: "Factures et paiements",
      icon: <FaLaptopMedical size={30} />,
      route: "/dashboard-comptable",
    },
    {
      name: "Technicien",
      description: "Rapports, matériel, interventions",
      icon: <FaUserCog size={30} />,
      route: "/dashboard-technicien",
    },
  ];

  return (
    <div className="admin-dashboard">
      <h2>Tableau de bord Admin</h2>
      <div className="dashboard-grid">
        {profiles.map((profile, index) => (
          <div
            className="dashboard-card"
            key={index}
            onClick={() => navigate(profile.route)}
          >
            <div className="icon">{profile.icon}</div>
            <h3>{profile.name}</h3>
            <p>{profile.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
