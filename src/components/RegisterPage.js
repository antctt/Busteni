import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { auth, db, storage } from '../firebase';

const RegisterPage = () => {

  const [profilePicture, setProfilePicture] = useState(null);
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const uploadProfilePicture = async (file) => {
    const storageRef = storage.ref();
    const profilePictureRef = storageRef.child(`profile_pictures/${file.name}`);
    await profilePictureRef.put(file);
    return await profilePictureRef.getDownloadURL();
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const newUser = await auth.createUserWithEmailAndPassword(email, password);
  
      let profilePictureUrl = '';
      if (profilePicture) {
        profilePictureUrl = await uploadProfilePicture(profilePicture);
      }
  
      const userDoc = {
        email: newUser.user.email,
        username: username,
        profilePicture: profilePictureUrl,
        description: description,
      };
      await db.collection('users').doc(newUser.user.uid).set(userDoc);
  
      setEmail('');
      setPassword('');
      setUsername('');
      setProfilePicture(null);
      setDescription('');
    } catch (error) {
      setError(error.message);
    }
  
  };

  return (
    <Container className="mt-5" style={{ width: "600px" }}>
      <h2 className="text-center my-3 mt-5">Sign Up</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>

        {/* <Form.Group className="mb-3" controlId="formBasicProfilePicture">
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter profile picture URL"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
          />
        </Form.Group> */}

        {/* make a profile picture form that works by using an upload button for the picture */}
        <Form.Group className="mb-3" controlId="formBasicProfilePicture">
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => {
              console.log('Selected file:', e.target.files[0]);
              setProfilePicture(e.target.files[0]);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Enter a short description about yourself"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterPage;
