import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  message: Yup.string().required('Required'),
});

const ContactForm = () => {
  const onSubmit = (values, actions) => {
    // Simulate an API call to submit the form data
    setTimeout(() => {
      toast.success('Form submitted successfully');
      actions.resetForm();
      actions.setSubmitting(false);
    }, 1000);
  };

  return (
    <>
      <ToastContainer />
      <Container style={{ width: "600px" }}>
        <Row>
          <Col>
            <h2 className="text-center my-3 mt-5">Contact Us</h2>
            <Formik
              initialValues={{ name: '', email: '', message: '' }}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <Field name="name" className="form-control" />
                    <ErrorMessage name="name" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <Field name="email" type="email" className="form-control" />
                    <ErrorMessage name="email" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">
                      Message
                    </label>
                    <Field name="message" as="textarea" className="form-control" />
                    <ErrorMessage name="message" component="div" className="text-danger" />
                  </div>
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ContactForm;