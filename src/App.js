import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth'; // Vérifie bien le chemin vers ton fichier Auth
import Dashboard from './pages/adminDashboard'; // Tu devras créer ce fichier
import Feed from './pages/Feed';           // Tu devras créer ce fichier
import Profile from './components/Profile';

function App() {
  return (
    <Routes>
      {/* La route par défaut est la page de connexion */}
      <Route path="/" element={<Auth />} />
      
      {/* Les routes de destination */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;