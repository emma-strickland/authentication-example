import React, { useState } from "react";

import Button from "../components/button";
import Field from '../components/field';
import { post } from '../tools/api';

import { Formik, Form } from 'formik';
import * as Yup from "yup";

const Register = ({ onSubmit }) => {
  const [error, setError] = useState('');
  // const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <h1>
        Register
      </h1>
      <Formik
        initialValues={{ firstName: '', lastName: '', email: '', password: '' }}
        validationSchema={Yup.object({
          firstName: Yup.string()
            .required("Required"),
          lastName: Yup.string()
            .required("Required"),
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
          post('register', {
            firstName: values.firstName,
            lastName: values.lastName,
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
            <Field name="firstName" label="First Name" />
            <Field name="lastName" label="Last Name" />
            <Field type="email" name="email" label="Email" />
            <Field type="password" name="password" label="Password" />
            <Button label="Register" isLoading={isLoading} onClick={onSubmit} />
            <div className="error-message">{error}</div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default Register;