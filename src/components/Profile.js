import React, { useEffect, useState } from 'react';
import { Card, Image } from 'react-bootstrap';
import { auth, db } from '../firebase';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './HomePage.css';


const Profile = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const getUserData = async () => {
        try {
          const doc = await db.collection('users').doc(auth.currentUser.uid).get();
          setUser(doc.data());
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      };
  
      if (auth.currentUser) {
        getUserData();
      } else {
        setIsLoading(false);
      }
    }, []);
  
    if (isLoading) {
      return <p>Loading...</p>;
    }
  
    if (!user) {
      return <p>User not found.</p>;
    }
  
    return (
        <Container className="mt-5" style={{ width: "70%" }}>
          <Row className="gallery justify-content-center mt-4">
            <Col xs={12} md={4} className="text-center">
              <Image
                src={user?.profilePicture || 'https://via.placeholder.com/150'}
                roundedCircle
                style={{ width: "150px", height: "150px" }}
              />
              <h4>{user?.username}</h4>
            </Col>
            <Col xs={12} md={8}>
              <Form>
                <Form.Group controlId="formBasicEmail" style={{ marginTop: 10}}>
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" defaultValue={user?.email} readOnly />
                </Form.Group>
                <Form.Group controlId="formBasicUsername" style={{ marginTop: 10}}>
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" defaultValue={user?.username} readOnly />
                </Form.Group>
                <Form.Group controlId="formBasicDescription" style={{ marginTop: 10}}>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    defaultValue={user?.description}
                    readOnly
                  />
                </Form.Group>
                <Button variant="primary" type="submit" style={{ marginTop: 10}}>
                  Edit Profile
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      );
    }
    
    export default Profile;