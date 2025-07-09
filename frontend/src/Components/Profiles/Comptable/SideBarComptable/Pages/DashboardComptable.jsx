// DashboardComptable.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import './dashboardComptable.css';

const DashboardComptable = () => {
  const [factures, setFactures] = useState([]);

  useEffect(() => {
    const fetchFactures = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/factures');
        setFactures(res.data || []);
      } catch (err) {
        console.error('Erreur de chargement des factures :', err);
      }
    };
    fetchFactures();
  }, []);

  const total = factures.length;
  const payees = factures.filter(f => f.estPayee).length;
  const impayees = total - payees;

  const pieData = [
    { name: 'Payées', value: payees },
    { name: 'Impayées', value: impayees },
  ];

  const barData = [
    { name: 'Total Factures', value: total },
    { name: 'Payées', value: payees },
    { name: 'Impayées', value: impayees },
  ];

  const COLORS = ['#3498db', '#ff69b4']; // bleu et rose

  return (
    <div className="dashboard-comptable">
      <h2>Tableau de bord Comptable</h2>

      <div className="charts-section">
        <div className="chart-container">
          <h4>Répartition des paiements</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => `${val} factures`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h4>Nombre de factures</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(val) => `${val} factures`} />
              <Bar dataKey="value" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardComptable;
