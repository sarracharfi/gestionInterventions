import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./DashboardTechnicien.css";

const rapportsData = [
  { month: "Jan", count: 12 },
  { month: "Fév", count: 19 },
  { month: "Mar", count: 8 },
  { month: "Avr", count: 23 },
  { month: "Mai", count: 15 },
  { month: "Juin", count: 9 },
];

const materielData = [
  { name: "Ordinateurs", value: 40 },
  { name: "Imprimantes", value: 20 },
  { name: "Projecteurs", value: 10 },
  { name: "Réseau", value: 30 },
];

const interventionStatusData = [
  { status: "Nouvelle", count: 10 },
  { status: "En cours", count: 20 },
  { status: "Reporté", count: 5 },
  { status: "Terminé", count: 15 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <h2>Dashboard Technicien</h2>

      <div className="charts-wrapper">
        {/* BarChart Rapports */}
        <div className="chart-card">
          <h3>Rapports créés par mois</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={rapportsData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#0088FE" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PieChart Matériels */}
        <div className="chart-card">
          <h3>Répartition des matériels</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={materielData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {materielData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BarChart Statut interventions */}
        <div className="chart-card">
          <h3>Statut des interventions</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={interventionStatusData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#FF8042" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
