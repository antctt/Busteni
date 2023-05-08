import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './WeekendEvents.css';

const WeekendEvents = () => {
  const [weekends, setWeekends] = useState([]);

  useEffect(() => {
    const getRemainingWeekends = () => {
      const now = new Date();
      const weekends = [];
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      let current = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      while (current < endOfMonth) {
        if (current.getDay() === 5) {
          const sunday = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 2);
          weekends.push({
            id: weekends.length + 1,
            dateRange: `${monthNames[current.getMonth()]} ${current.getDate()}-${sunday.getDate()}`
          });
          current.setDate(current.getDate() + 7);
        } else {
          current.setDate(current.getDate() + 1);
        }
      }
      return weekends;
    };

    setWeekends(getRemainingWeekends());
  }, []);

  const Circle = () => (
    <div className="circle">
      {/* Add any content inside the circle if needed */}
    </div>
  );

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
              <Button variant="success" className="join-btn">Join</Button>
              <Button variant="secondary" className="confirm-btn">Confirm</Button>
            </div>
          </div>
          <Row className="circle-row">
            {[...Array(6).keys()].map((index) => (
              <Col key={index} xs={2}>
                <Circle />
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
