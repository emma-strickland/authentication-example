import React, { useState } from "react";

import Button from "../components/button";
import Field from '../components/field';
import Modal from "../components/modal";
import { post } from '../tools/api';

import { Formik, Form } from 'formik';
import * as Yup from "yup";

const Register = ({ onSubmit, isOpen, onRequestClose }) => {
  const [error, setError] = useState('');
  // const [isLoading, setIsLoading] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <div>
        <h1 className="modal-title">
          Register
        </h1>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email addresss")
              .required("Required"),
            password: Yup.string()
              .min(8, "Must be greater than 8 characters")
              .required("Required"),
          })}
          onSubmit={(values, { resetForm }) => {
            //setIsLoading(true);
            setError('');
            post('/authentication/register', {
              email: values.email,
              password: values.password
            }, (error) => {
              setError(error);
              // setIsLoading(false);
            }, (_) => {
              resetForm();
              // setIsLoading(false);
            })
          }}
        >
          {({ isLoading }) => (
            <Form>
              <Field type="email" name="email" label="Email" />
              <Field type="password" name="password" label="Password" />
              <Button label="Register" isLoading={isLoading} onClick={onSubmit} />
              <div className="error-message">{error || "bob"}</div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  )
}

export default Register;