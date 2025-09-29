
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AgentPortal from './components/AgentPortal';
import CustomerForm from './components/CustomerForm';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <Header />
        <main className="p-4 sm:p-6 md:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/agent" replace />} />
            <Route path="/agent" element={<AgentPortal />} />
            <Route path="/form" element={<CustomerForm />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
