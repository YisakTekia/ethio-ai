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
        
        {/* Public Route  */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes - Login  */}
        <Route element={<ProtectedRoute />}>
          
          {/* Main PWA layout with Bottom Navigation */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="sports" element={<Sports />} />
            <Route path="health" element={<Health />} />
            <Route path="education" element={<Education />} />
            <Route path="profile" element={<Profile />} />
            {/* <Route path="quiz" element={<Quiz />} /> */}
            <Route path="/admin" element={<Admin />} />
          </Route>
          
          {/* Standalone full-screen protected page */}
          <Route path="/subscribe" element={<Subscribe />} />
          
        </Route>

      </Routes>
    </Router>
  );
}

export default App;