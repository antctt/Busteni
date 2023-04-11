import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const BookPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [disabledDates, setDisabledDates] = useState([]);
  const [nextAvailableDate, setNextAvailableDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      const db = getFirestore();
      const bookingsRef = collection(db, "Bookings");
      const allBookingsSnapshot = await getDocs(bookingsRef);
      const allBookings = allBookingsSnapshot.docs.map((doc) => doc.data());

      const disabledDates = [];
      allBookings.forEach((booking) => {
        const bookingStartDate = new Date(booking.startDate);
        const bookingEndDate = new Date(booking.endDate);

        for (
          let d = bookingStartDate;
          d <= bookingEndDate;
          d.setDate(d.getDate() + 1)
        ) {
          disabledDates.push(new Date(d));
        }
      });

      setDisabledDates(disabledDates);
    };

    fetchBookings();
  }, []);

  const handleBookNow = async () => {
    if (!user) return;

    const db = getFirestore();
    const bookingsRef = collection(db, 'Bookings');
    await addDoc(bookingsRef, {
      userName: user.displayName || user.email,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  };


  return (
    <Container className="mt-5">
      {loading ? (
        <h2>Loading...</h2>
      ) : !user ? (
        <>
          <h2>Please Log In or Sign Up to book a house</h2>
          <Row className="justify-content-center my-5">
            <Col xs="auto">
              <Button variant="primary" onClick={() => navigate("/login")}>
                Log In
              </Button>
            </Col>
            <Col xs="auto">
              <Button variant="secondary" onClick={() => navigate("/signup")}>
                Sign Up
              </Button>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <h2>Hello, {user.displayName || user.email}</h2>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="form-control"
                excludeDates={disabledDates}
                minDate={new Date()}
                openToDate={nextAvailableDate}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="form-control"
                excludeDates={disabledDates}
                minDate={startDate}
                openToDate={nextAvailableDate}
              />
            </Form.Group>

            <Button variant="primary" onClick={handleBookNow}>
              Book Now
            </Button>
          </Form>
        </>
      )}
    </Container>
  );
};

export default BookPage;
