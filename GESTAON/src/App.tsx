import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';

const App = () => {
  return (
    <div className="app-container" style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <main style={{ padding: '20px' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
