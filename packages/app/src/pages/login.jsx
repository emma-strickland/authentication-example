import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import Button from "../components/button";
import Field from '../components/field';
import { post } from "../tools/api";
import config from '../config';

import { Formik, Form } from 'formik';
import * as Yup from "yup";


const Login = ({ onLogin }) => {
  let history = useHistory();

  //const [email, setEmail] = useState('');
  //const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  return (
    <div>
      <h1>
        Login
      </h1>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Invalid email address")
            .required("Required"),
          password: Yup.string()
            .min(8, "Must be greater than 8 characters")
            .required("Required"),
        })}
        onSubmit={(values, { resetForm }) => {
          setError('');
          post("login", {
            email: values.email,
            password: values.password
          }, (error) => {
            setError(error)
          }, (response) => {
            onLogin(response.token)
            resetForm();
            history.push("/");
          })
        }
        }
      >

        {({ isLoading }) => (
          <Form>
            <Field type="email" name="email" label="Email" />
            <Field type="password" name="password" label="Password" />
            <Button label="Register" isLoading={isLoading} />
            <div className="error-message">{error}</div>
          </Form>
        )}
      </Formik>
    </div >
  )
}

export default Login;