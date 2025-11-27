import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Dashboard from './pages/Dashboard';
import NewDemand from './pages/NewDemand';
import DemandDetails from './pages/DemandDetails';
import Admin from './pages/Admin';

// Placeholder components
const Approvals = () => <div className="p-6"><h1 className="text-2xl font-bold">Aprovações</h1></div>;
const Executions = () => <div className="p-6"><h1 className="text-2xl font-bold">Execução</h1></div>;

const PrivateRoute = ({ children }) => {
  const { signed, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!signed) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen bg-surface-muted font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/demands/new" element={<PrivateRoute><NewDemand /></PrivateRoute>} />
          <Route path="/demands/:id" element={<PrivateRoute><DemandDetails /></PrivateRoute>} />
          <Route path="/approvals" element={<PrivateRoute><Approvals /></PrivateRoute>} />
          <Route path="/executions" element={<PrivateRoute><Executions /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
