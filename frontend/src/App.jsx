// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Accueil from "./Components/Accueil/Accueil";
import Contact from './Components/Contact/Contact';
import SearchBar from './Components/Searchbar/Searchbar';
import About from './Components/About/About';

import Facture from './Components/Profiles/Comptable/SideBarComptable/Pages/Facture';
import SuiviPaiement from './Components/Profiles/Comptable/SideBarComptable/Pages/SuiviPaiement';
import Rapport from './Components/Profiles/Comptable/SideBarComptable/Pages/Rapport';
import RendezVous from './Components/Profiles/Comptable/SideBarComptable/Pages/Rendez-vous';
import ComptableProfile from './Components/Profiles/Comptable/ComptableProfile';
import DashboardComptable from './Components/Profiles/Comptable/SideBarComptable/Pages/DashboardComptable'; // <-- AJOUT ICI
import FormulaireComptable from './Components/Formulaires/FormulaireComptable/FormulaireComptable';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Accueil />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/searchBar" element={<SearchBar />} />
        <Route path="/about" element={<About />} />
        {/* sign up forms routes */}
        <Route path="/signup">
          <Route path="comptable" element={<FormulaireComptable />} />
          /</Route>

        {/* Routes du profil comptable */}
        <Route path="/profiles/comptable" element={<ComptableProfile />}>
          <Route index element={<DashboardComptable />} /> {/* Page par défaut */}
          <Route path="factures" element={<Facture />} />
          <Route path="suivi-paiements" element={<SuiviPaiement />} />
          <Route path="rapports-financiers" element={<Rapport />} />
          <Route path="parametres-facturation" element={<RendezVous />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
