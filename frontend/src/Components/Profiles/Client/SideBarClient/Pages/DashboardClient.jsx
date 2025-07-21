// DashboardClient.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { getDemandesIntervention, getEvaluations } from "../../../../Services/userservice";
import "./dashboardClient.css";

const DashboardClient = () => {
  const [statutsData, setStatutsData] = useState([]);
  const [noteData, setNoteData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const COLORS = [
  "#D6336C",  
  "#F08CA1", 
  "#00779eff",  
  "#cc7098ff",  
  "#DADADA",  
  "#F9F9F9"   
];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const demandes = await getDemandesIntervention();
      const evaluations = await getEvaluations();

      // Demandes par statut
      const statusCounts = demandes.reduce((acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      }, {});

      const statutsFormatted = Object.entries(statusCounts).map(([name, value]) => ({
        name,
        value,
      }));

      // Groupes de notes
      const notesGrouped = {
        "0-20": 0,
        "21-40": 0,
        "41-60": 0,
        "61-80": 0,
        "81-100": 0,
      };

      evaluations.forEach(({ note }) => {
        if (note <= 20) notesGrouped["0-20"]++;
        else if (note <= 40) notesGrouped["21-40"]++;
        else if (note <= 60) notesGrouped["41-60"]++;
        else if (note <= 80) notesGrouped["61-80"]++;
        else notesGrouped["81-100"]++;
      });

      const notesFormatted = Object.entries(notesGrouped).map(([name, value]) => ({ name, value }));

      setStatutsData(statutsFormatted);
      setNoteData(notesFormatted);
    } catch (err) {
      console.error("Erreur lors du chargement des statistiques :", err);
      setError("Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-client-container">
      <h2>Dashboard Client</h2>

      {loading ? (
        <p>Chargement en cours...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="chart-section">
          <div className="chart-box">
            <h3>Demandes par statut</h3>
            {statutsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statutsData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#daadddff" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>Aucune donnée disponible.</p>
            )}
          </div>

          <div className="chart-box">
            <h3>Répartition des notes d'évaluation</h3>
            {noteData.some(item => item.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={noteData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {noteData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p>Aucune note à afficher.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardClient;
