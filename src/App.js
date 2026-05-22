import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Auth from './pages/Auth';
import Dashboard from './pages/adminDashboard';
import Feed from './pages/Feed';
import Profile from './components/Profile';
import ApplyPage from './components/ApplyPage';
import ProtectedRoute from './routes/ProtectedRoute';
import CreateCompanyForm from './components/adminComponents/CreateCompanyForm';

function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTE */}
      <Route path="/" element={<Auth />} />

      {/* PROTECTED ROUTES */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-company"
        element={
          <ProtectedRoute>
            <CreateCompanyForm />
          </ProtectedRoute>
        }
      />


      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/apply/:jobId"
        element={
          <ProtectedRoute>
            <ApplyPage />
          </ProtectedRoute>
        }
      />


    </Routes>
  );
}

export default App;