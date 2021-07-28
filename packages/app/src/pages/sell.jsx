import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import Button from "../components/button";
import Field from '../components/field';
import { post } from "../tools/api";

import { Formik, Form } from 'formik';
import * as Yup from "yup";

// add category field, condition field, and borough field with dropdown menu
// modals on front end - try to get one form first 
// focus on server - fields for selling item 
// attach ids to objects in mongo - when create user an id should be created replace instances of email with user id
// shouldnt have to enter email when submitting 
// move authorization endpoints and listing endpoints to separate files from server.js and make sure they still work
// our functions 
// eventually need to make forms generic 

const PostItem = () => {
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
          post("post", {
            title: values.title,
            category: values.category,
            description: values.description,
            price: values.price
          }, (error) => {
            setError(error)
          }, (response) => {
            //onLogin(response.token)
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

export default PostItem;