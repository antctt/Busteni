import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { auth, db } from '../firebase';
import './WeekendEvents.css';

const WeekendEvents = () => {
  const [weekends, setWeekends] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getRemainingWeekends = () => {
      const now = new Date();
      const weekends = [];
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
      let current = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
      while (current < endOfMonth && weekends.length < 4) {
        if (current.getDay() === 5) {
          const sunday = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 2);
          weekends.push({
            id: `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`,
            dateRange: `${monthNames[current.getMonth()]} ${current.getDate()}-${sunday.getDate()}`,
            joinedUsers: [],
          });
          current.setDate(current.getDate() + 7);
        } else {
          current.setDate(current.getDate() + 1);
        }
      }
      return weekends;
    };
  
    const addWeekendsToFirestore = async (weekends) => {
      for (const weekend of weekends) {
        const weekendDoc = await db.collection('weekends').doc(weekend.id).get();
        if (!weekendDoc.exists) {
          await db.collection('weekends').doc(weekend.id).set(weekend);
        }
      }
    };
  
    const fetchWeekendsFromFirestore = async () => {
      const snapshot = await db.collection('weekends').get();
      const weekends = await Promise.all(snapshot.docs.map(async (doc) => {
        const weekend = { id: doc.id, ...doc.data() };
        if (weekend.joinedUsers) {
          weekend.joinedUsers = await Promise.all(weekend.joinedUsers.map(async (userId) => {
            const userDoc = await db.collection('users').doc(userId).get();
            return { id: userId, ...userDoc.data() };
          }));
        }
        return weekend;
      }));
      setWeekends(weekends);
    };
      
    const remainingWeekends = getRemainingWeekends();
    addWeekendsToFirestore(remainingWeekends);
    fetchWeekendsFromFirestore();
  
    setWeekends(getRemainingWeekends());

    const unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userDoc = await db.collection('users').doc(userAuth.uid).get();
        setUser({ id: userAuth.uid, ...userDoc.data() });
      } else {
        setUser(null);
      }
    });
    const unsubscribeFromWeekends = db.collection('weekends').onSnapshot((snapshot) => {
      const newWeekends = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setWeekends(newWeekends);
    });

    return () => {
      unsubscribeFromAuth();
      unsubscribeFromWeekends();
    };

  }, []);

  const handleJoin = async (weekendId) => {
    if (!user) {
      // Redirect to login page if user is not logged in
      window.location.href = '/login';
      return;
    }
  
    const weekendDoc = await db.collection('weekends').doc(weekendId).get();
    const joinedUsers = weekendDoc.data().joinedUsers || [];
  
    if (!joinedUsers.find((joinedUser) => joinedUser.id === user.id)) {
      joinedUsers.push(user);
      await db.collection('weekends').doc(weekendId).update({ joinedUsers });
  
      const newWeekends = weekends.map((weekend) => {
        if (weekend.id === weekendId) {
          return { ...weekend, joinedUsers };
        } else {
          return weekend;
        }
      });
      setWeekends(newWeekends);
    }
  };
  
  const handleLeave = async (weekendId) => {
    if (!user) {
      // Redirect to login page if user is not logged in
      window.location.href = '/login';
      return;
    }
  
    const weekendDoc = await db.collection('weekends').doc(weekendId).get();
    const joinedUsers = weekendDoc.data().joinedUsers || [];
  
    const index = joinedUsers.findIndex((joinedUser) => joinedUser.id === user.id);
    if (index > -1) {
      joinedUsers.splice(index, 1);
      await db.collection('weekends').doc(weekendId).update({ joinedUsers });
  
      const newWeekends = weekends.map((weekend) => {
        if (weekend.id === weekendId) {
          return { ...weekend, joinedUsers };
        } else {
          return weekend;
        }
      });
      setWeekends(newWeekends);
    }
  };
  
  const Circle = ({ weekendId, index }) => {
    const weekend = weekends.find((weekend) => weekend.id === weekendId);
    const user = weekend && weekend.joinedUsers && weekend.joinedUsers[index];
    const profilePicture = user && user.profilePicture;
  
    return (
      <div className="circle">
        {profilePicture && (
          <img src={profilePicture} alt="Profile" style={{ borderRadius: '50%' }} />
        )}
      </div>
    );
  };
          
  return (
    <Container>
      <h1 className="title">GoTogether</h1>
      <p className="description">
        GoTogether is a brand new feature that allows you to meet new people and go on adventures together. Join a group of people and go on a weekend trip to a new city. <br />
        You can also confirm your attendance to a trip that you have already joined. You can only join one trip at a time, so make sure you confirm your attendance before joining another trip.
      </p>
      {weekends.map((weekend) => (
        <div key={weekend.id} className="weekend-container">
          <div className="header">
            <h3>{weekend.dateRange}</h3>
            <div className="buttons">
              <Button variant="success" className="join-btn" onClick={() => handleJoin(weekend.id)}>Join</Button>
              <Button variant="danger" className="leave-btn" onClick={() => handleLeave(weekend.id)}>Leave</Button>
              {/* <Button variant="secondary" className="confirm-btn">Confirm</Button> */}
            </div>
          </div>
          <Row className="circle-row">
            {[...Array(6).keys()].map((index) => (
              <Col key={index} xs={2}>
                <Circle weekendId={weekend.id} index={index}/>
              </Col>
            ))}
          </Row>
          <Row className="circle-row">
            {[...Array(6).keys()].map((index) => (
              <Col key={index} xs={2}>
                <Circle />
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </Container>
  );
};

export default WeekendEvents;
