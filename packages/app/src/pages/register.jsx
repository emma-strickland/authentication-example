import React, { useState } from "react";
import ReactLoading from 'react-loading';

import Button from "../components/button";
import Form from '../components/form';
import { post } from '../tools/api';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const register = () => {
    setError('')
    setIsLoading(true);
    post('register', {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    }, (error) => {
      setError(error);
      setIsLoading(false);
    }, (result) => {
      setIsLoading(false);
    })
  }

  return (
    <div>
      <h1>
        Register
      </h1>
      <Form label="First Name" value={firstName} setValue={setFirstName} onSubmit={register} />
      <Form label="Last Name" value={lastName} setValue={setLastName} onSubmit={register} />
      <Form label="Email" value={email} setValue={setEmail} onSubmit={register} />
      <Form label="Password" value={password} setValue={setPassword} type="password" onSubmit={register} />
      <Button label="Register" onClick={register} loading={setIsLoading} />
      {error &&
        <div className="error-message">{error}</div>
      }

    </div>
  )
}

export default Register;