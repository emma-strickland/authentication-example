import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import Button from "../components/button";
import Form from '../components/form';
import config from '../config';

import { post } from "../tools/api";

const Login = ({ onLogin }) => {
  let history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const clearForm = () => {
    setEmail('');
    setPassword('');
  }

  const login = () => {
    post("login", {
      email: email,
      password: password
    }, (error) => {
      // TODO
    }, (response) => {
      onLogin(response.token)
      clearForm();
      history.push("/");
    })
  }

  return (
    <div>
      <h1>
        Login
      </h1>
      <Form label="Email" value={email} setValue={setEmail} onSubmit={login} />
      <Form label="Password" value={password} setValue={setPassword} type="password" onSubmit={login} />
      <Button label="Login" onClick={login} />
    </div>

  )
}

export default Login;