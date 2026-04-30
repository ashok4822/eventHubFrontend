import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '80px' }}>
          <AppRoutes />
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
