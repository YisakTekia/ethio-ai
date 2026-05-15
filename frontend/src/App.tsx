// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout';
import ProtectedRoute from './components/protectedRoute';  
import Profile from './pages/profile';
// Import Pages
import Home from './pages/home';
import Sports from './pages/sports';
import Health from './pages/health';
import Education from './pages/education';
import Login from './pages/login';
import Subscribe from './pages/subscribe';
//import Quiz from './pages/quiz';
import Admin from './pages/admin/admin';

function App() {
  return (
    <Router>
      <Routes>
        
        {/* Public Route - Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Main PWA layout with Bottom Navigation */}
        <Route path="/" element={<Layout />}>
          
          {/*  PUBLIC ROUTES: Anyone can view these without logging in */}
          <Route index element={<Home />} />
          <Route path="sports" element={<Sports />} />
          <Route path="health" element={<Health />} />
          <Route path="education" element={<Education />} />

          {/* PROTECTED ROUTES (Inside Layout): Requires the Mock Login */}
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<Profile />} />
            {/* <Route path="quiz" element={<Quiz />} /> */}
            <Route path="admin" element={<Admin />} />
          </Route>

        </Route>
        
        {/* Standalone full-screen protected page */}
        <Route element={<ProtectedRoute />}>
          <Route path="/subscribe" element={<Subscribe />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;