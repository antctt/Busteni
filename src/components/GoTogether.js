import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { auth, db } from '../firebase';
import './WeekendEvents.css';
import { getFirestore, addDoc } from 'firebase/firestore';

const WeekendEvents = () => {
  const [weekends, setWeekends] = useState([]);
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  const maxSpots = 12;

  useEffect(() => {
    const getRemainingWeekends = () => {
      const now = new Date();
      const weekends = [];
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
      let current = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
      // If it's already Friday, Saturday or Sunday, start from the next Friday
      if (current.getDay() >= 5) {
        current.setDate(current.getDate() + (7 - current.getDay() + 5));
      }
    
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
    

    const fetchBookingsFromFirestore = async () => {
      const snapshot = await db.collection('Bookings').get();
      const bookings = snapshot.docs.map((doc) => {
        const booking = { id: doc.id, ...doc.data() };
        booking.startDate = new Date(booking.startDate);
        booking.endDate = new Date(booking.endDate);
        return booking;
      });
      setBookings(bookings);
    };

    fetchBookingsFromFirestore();
  
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
      let weekends = await Promise.all(snapshot.docs.map(async (doc) => {
        const weekend = { id: doc.id, ...doc.data() };
        const now = new Date();
        const weekendStartDate = new Date(weekend.id.split('-'));
    
        // If the weekend has passed, delete it from the database
        if (weekendStartDate < now) {
          await db.collection('weekends').doc(weekend.id).delete();
          return null;
        }
    
        if (weekend.joinedUsers) {
          weekend.joinedUsers = await Promise.all(weekend.joinedUsers.map(async (userId) => {
            const userDoc = await db.collection('users').doc(userId).get();
            return { id: userId, ...userDoc.data() };
          }));
        }
        return weekend;
      }));
    
      // Filter out null values (deleted weekends) and sort by date
      weekends = weekends.filter(Boolean).sort((a, b) => {
        const aDate = new Date(a.id.split('-'));
        const bDate = new Date(b.id.split('-'));
        return aDate - bDate; // Ascending order
      });
    
      setWeekends(weekends);
    };
              
    const remainingWeekends = getRemainingWeekends();
    addWeekendsToFirestore(remainingWeekends);
    fetchWeekendsFromFirestore();
  
    // setWeekends(getRemainingWeekends());

    const unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userDoc = await db.collection('users').doc(userAuth.uid).get();
        setUser({ id: userAuth.uid, ...userDoc.data() });
      } else {
        setUser(null);
      }
    });
    const unsubscribeFromWeekends = db.collection('weekends').onSnapshot((snapshot) => {
      let newWeekends = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      
      // Sort newWeekends before setting them to state
      newWeekends = newWeekends.sort((a, b) => {
        const aDate = new Date(a.id.split('-'));
        const bDate = new Date(b.id.split('-'));
        return aDate - bDate; // Ascending order
      });
      
      setWeekends(newWeekends);
    });

    return () => {
      unsubscribeFromAuth();
      unsubscribeFromWeekends();
    };

  }, []);

  const isWeekendBooked = (weekend) => {
    // Parse the weekend's start and end dates
    const weekendStartDate = new Date(weekend.id);
    const weekendEndDate = new Date(weekendStartDate);
    weekendEndDate.setDate(weekendEndDate.getDate() + 2);
  
    // Check each booking
    for (let booking of bookings) {
        // Parse the booking's start and end dates
        const bookingStartDate = new Date(booking.startDate);
        const bookingEndDate = new Date(booking.endDate);
      
        // Count the number of users associated with the booking
        const userCount = booking.userName.split(',').length;

        // If the booking's start date is within the weekend, or if the booking's end date is within the weekend, and there is only 1 user or 12 or more users, return true
        if (
            ((bookingStartDate >= weekendStartDate && bookingStartDate <= weekendEndDate) ||
            (bookingEndDate >= weekendStartDate && bookingEndDate <= weekendEndDate)) &&
            (userCount === 1 || userCount >= 12)
        ) {
            return true;
        }
    }
  
    // If no bookings were within the weekend, return false
    return false;
};
  

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
      
      // If 2 or more people have joined, add a booking
      if (joinedUsers.length >= 2) {
        const startDate = new Date(weekendId.split('-'));
        const endDate = new Date(weekendId.split('-'));
        endDate.setDate(endDate.getDate() + 2);
        await db.collection('Bookings').add({
          userName: joinedUsers.map(joinedUser => joinedUser.email).join(', '),
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });
      }
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
      {weekends.map((weekend) => {
        const availableSpots = maxSpots - (weekend.joinedUsers ? weekend.joinedUsers.length : 0);
        return (
          <div key={weekend.id} className="weekend-container" style={{ height: isWeekendBooked(weekend) ? "70px" : "normalHeight" }}>
            <div className="header">
              <h3>{weekend.dateRange}
              {isWeekendBooked(weekend) && <span style={{ color: 'green' }}> (Booked)</span>}</h3>
              {/* <p><span style={{ marginLeft: '20px', color: availableSpots > 0 ? 'blue' : 'red' }}>
                {!isWeekendBooked(weekend) && availableSpots > 0 ? `${availableSpots-6} more to confirm booking` : ``}</span></p> */}
              <div className="buttons">
                <Button 
                  variant="success" 
                  className="join-btn" 
                  onClick={() => handleJoin(weekend.id)}
                  disabled={isWeekendBooked(weekend) || availableSpots === 0} // Check if weekend is booked or no spots are available
                >
                  Join
                </Button>
                <Button 
                  variant="danger" 
                  className="leave-btn" 
                  onClick={() => handleLeave(weekend.id)}
                  disabled={isWeekendBooked(weekend)} // Add this line
                >
                  Leave
                </Button>
              </div>
            </div>
            {!isWeekendBooked(weekend) && (
              <>
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
                      <Circle weekendId={weekend.id} index={index + 6}/> {/* We added 6 to the index to correctly map to the second row of circles */}
                    </Col>
                  ))}
                </Row>
              </>
            )}
          </div>
        )
      })}
    </Container>
  );
};

export default WeekendEvents;
