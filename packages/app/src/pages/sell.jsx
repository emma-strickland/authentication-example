import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import Button from "../components/button";
import Field from '../components/field';
import { post } from "../tools/api";

import { Formik, Form } from 'formik';
import * as Yup from "yup";


const SellItem = ({ onLogin }) => {
  let history = useHistory();

  //const [email, setEmail] = useState('');
  //const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  return (
    <div>
      <h1>
        Sell an Item
      </h1>
      <Formik
        initialValues={{ title: '', description: '', price: '' }}
        validationSchema={Yup.object({
          title: Yup.string()
            .required("Required"),
          description: Yup.string()
            .min(20, "Must be greater than 20 characters")
            .required("Required"),
          price: Yup.number()
            .typeError('Please enter a price')
            .required("Required"),
        })}
        onSubmit={(values, { resetForm }) => {
          setError('');
          post("sell", {
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
            <Field name="title" label="Title" />
            <Field name="description" label="Description" />
            <Field name="price" label="Price ($)" />
            <Button label="Submit" isLoading={isLoading} />
            <div className="error-message">{error}</div>
          </Form>
        )}
      </Formik>
    </div >
  )
}

export default SellItem;