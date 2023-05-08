import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './Navigation';
import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import BookPage from './components/BookPage';
import ContactPage from './components/ContactPage';
import Profile from './components/Profile';
import GoTogether from './components/GoTogether';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <Container>
          <Routes>
            <Route path="/" element={<HomePage />} index />
            <Route path="/signup" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/book" element={<BookPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/gotogether" element={<GoTogether />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
}


export default App;
