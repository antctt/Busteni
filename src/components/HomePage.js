/* eslint-disable jsx-a11y/iframe-has-title */
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import housePreview from '../images/house-preview.jpg';
import './HomePage.css';
import carouselImage1 from '../images/carousel_img1.jpg';
import carouselImage2 from '../images/carousel_img2.jpg';
import carouselImage3 from '../images/carousel_img3.jpg';

const HomePage = () => {
  return (
    <Container className="home-container min-vh-100">
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
          <h1>About Us</h1>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2801.6257903815444!2d25.53535821540386!3d45.39671897910031!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b315c6874fc8dd%3A0x6a928f86df829973!2sStrada%20Gloriei%2037%2C%20Bu%C8%99teni%20105500!5e0!3m2!1sen!2sro!4v1680781288386!5m2!1sen!2sro" width="400" height="300" style={{border:0}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </Col>
        <Col md={6}>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis auctor ipsum id dapibus malesuada. Donec ornare, dolor quis tincidunt ullamcorper, massa enim fringilla ante, non tincidunt dolor nisi non tortor. Fusce eget nulla vitae neque feugiat scelerisque. Nulla facilisi. Mauris blandit sem sit amet dui malesuada bibendum. Praesent vel elit vel quam consectetur luctus ac id nulla. Sed nec malesuada mauris.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis auctor ipsum id dapibus malesuada. Donec ornare, dolor quis tincidunt ullamcorper, massa enim fringilla ante, non tincidunt dolor nisi non tortor. Fusce eget nulla vitae neque feugiat scelerisque. Nulla facilisi. Mauris blandit sem sit amet dui malesuada bibendum. Praesent vel elit vel quam consectetur luctus ac id nulla. Sed nec malesuada mauris. Mauris blandit sem sit amet dui malesuada bibendum. Praesent vel elit vel quam consectetur luctus ac id nulla. Sed nec malesuada mauris.</p>

        </Col>
      </Row>

      <Col>
          <h1 style={{ textAlign: 'center', marginTop: '50px' }}>Gallery</h1>
        </Col>
      <Row className='gallery gy-4 row-cols-1 row-cols-sm-2 row-cols-md-3'>
        <Col>
          <img src={carouselImage1} alt=""/>
        </Col>
        <Col>
          <img src={carouselImage2} alt=""/>
        </Col>
        <Col>
          <img src={carouselImage3} alt=""/>
        </Col>
        <Col>
          <img src={carouselImage3} alt=""/>
        </Col>
        <Col>
          <img src={carouselImage2} alt=""/>
        </Col>
        <Col>
          <img src={carouselImage1} alt=""/>
        </Col>
      </Row>

    </Container>
  );
};

export default HomePage;
