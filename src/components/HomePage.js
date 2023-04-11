import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import housePreview from '../images/house-preview.jpg';
import './HomePage.css';

const HomePage = () => {
  return (
    <Container fluid className="home-container">
      <Row className="position-relative">
        <Col className="full-width-image" style={{backgroundImage: `url(${housePreview})`}}>
          <div className="welcome-message-container">
            <h1>Welcome to our home!</h1>
            <Link to="/book">
              <Button variant="secondary" className="book-now-button">
                Book Now
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
      <Row className="about-us-row">
        <Col md={6}>
          <div>
            <h1>About Us</h1>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2801.6257903815444!2d25.53535821540386!3d45.39671897910031!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b315c6874fc8dd%3A0x6a928f86df829973!2sStrada%20Gloriei%2037%2C%20Bu%C8%99teni%20105500!5e0!3m2!1sen!2sro!4v1680781288386!5m2!1sen!2sro" width="400" height="300" style={{border:0}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
          </iframe>
          </div>
        </Col>
        <Col md={6}>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis auctor ipsum id dapibus malesuada. Donec ornare, dolor quis tincidunt ullamcorper, massa enim fringilla ante, non tincidunt dolor nisi non tortor. Fusce eget nulla vitae neque feugiat scelerisque. Nulla facilisi. Mauris blandit sem sit amet dui malesuada bibendum. Praesent vel elit vel quam consectetur luctus ac id nulla. Sed nec malesuada mauris.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
