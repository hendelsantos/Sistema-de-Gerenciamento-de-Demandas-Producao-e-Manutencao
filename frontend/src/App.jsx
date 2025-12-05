import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Dashboard from './pages/Dashboard';
import NewDemand from './pages/NewDemand';
import DemandDetails from './pages/DemandDetails';
import KanbanBoard from './pages/KanbanBoard';
import Admin from './pages/Admin';
import About from './pages/About';

import Approvals from './pages/Approvals';
import Executions from './pages/Executions';

const PrivateRoute = ({ children }) => {
  const { signed, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!signed) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay for mobile/tablet when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Warning Banner for Guest */}
        {useAuth().user?.role === 'VISUALIZADOR' && (
          <div className="bg-amber-100 border-b border-amber-200 text-amber-800 px-4 py-2 text-sm font-medium text-center shadow-sm z-20">
            ⚠️ Modo Visualizador: Você não pode editar ou aprovar demandas.
          </div>
        )}
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto p-4 md:p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
};

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/demands/new" element={<PrivateRoute><NewDemand /></PrivateRoute>} />
            <Route path="/demands/:id" element={<PrivateRoute><DemandDetails /></PrivateRoute>} />
            <Route path="/kanban" element={<PrivateRoute><KanbanBoard /></PrivateRoute>} />
            <Route path="/approvals" element={<PrivateRoute><Approvals /></PrivateRoute>} />
            <Route path="/executions" element={<PrivateRoute><Executions /></PrivateRoute>} />
            <Route path="/about" element={<PrivateRoute><About /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
