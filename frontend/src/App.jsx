import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Accueil from "./Components/Accueil/Accueil";
import Contact from './Components/Contact/Contact';
import SearchBar from './Components/Searchbar/Searchbar';
import About from './Components/About/About';

import FormulaireComptable from './Components/Formulaires/FormulaireComptable/FormulaireComptable';
import FormulaireTechnicien from './Components/Formulaires/FormulaireTechnicien/FormulaireTechnicien';

import ComptableProfile from './Components/Profiles/Comptable/ComptableProfile';
import DashboardComptable from './Components/Profiles/Comptable/SideBarComptable/Pages/DashboardComptable';
import Facture from './Components/Profiles/Comptable/SideBarComptable/Pages/Facture';
 import Rapport from './Components/Profiles/Comptable/SideBarComptable/Pages/Rapport';
import RendezVous from './Components/Profiles/Comptable/SideBarComptable/Pages/Rendez-vous';

import TechnicienProfile from './Components/Profiles/Technicien/TechnicienProfile';
import Geolocalisation from './Components/Profiles/Technicien/SideBarTechnicien/Pages/Geolocalisation';
import RendezVousTechnicien from './Components/Profiles/Technicien/SideBarTechnicien/Pages/Rendez-vous';
import MaterielManager from './Components/Profiles/Technicien/SideBarTechnicien/Pages/MaterielManager';
import RapportInterventions from './Components/Profiles/Technicien/SideBarTechnicien/Pages/RapportInterventions';
import ClientProfile from './Components/Profiles/Client/ClientProfile';
import Demande from './Components/Profiles/Client/SideBarClient/Pages/demande';
import FormulaireClient from './Components/Formulaires/FormulaireClient/FormulaireClient';
import SuiviTechnicienClient from './Components/Profiles/Client/SideBarClient/Pages/suiviTechnicien';
import RendezVousClient from './Components/Profiles/Client/SideBarClient/Pages/Rendez-vous';
import SuiviInterventionTechnicien from './Components/Profiles/Technicien/SideBarTechnicien/Pages/SuiviInterventionTechnicien';
 
function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Accueil />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/searchBar" element={<SearchBar />} />
        <Route path="/about" element={<About />} />

        {/* Routes des formulaires d'inscription */}
        <Route path="/signup">
          <Route path="comptable" element={<FormulaireComptable />} />
          <Route path="technicien" element={<FormulaireTechnicien />} />
          <Route path="client" element={<FormulaireClient />} />
        </Route>

        {/* Routes du profil comptable */}
        <Route path="/profiles/comptable" element={<ComptableProfile />}>
          <Route index element={<DashboardComptable />} />
          <Route path="factures" element={<Facture />} />
          <Route path="rapports-financiers" element={<Rapport />} />
          <Route path="parametres-facturation" element={<RendezVous />} />
        </Route>

        {/* Routes du profil technicien */}
        <Route path="/profiles/technicien" element={<TechnicienProfile />}>
          <Route index element={<DashboardComptable />} />
          <Route path="geolocalisation" element={<Geolocalisation />} />
          <Route path="prise-rendez-vous" element={<RendezVousTechnicien />} />
          <Route path="materiels" element={<MaterielManager />} />
          <Route path="rapports" element={<RapportInterventions />} />
          <Route path='interventions' element={<SuiviInterventionTechnicien/>} />

        </Route>
        {/* Routes du profil client*/}
        <Route path="/profiles/client" element={<ClientProfile />}>
          <Route index element={<DashboardComptable />} />
          <Route path="creer-intervention" element={<Demande />} />
          <Route path="suivi-technicien" element={<SuiviTechnicienClient />} />
           <Route path="mes-interventions" element={<RendezVousClient />} />
 
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
