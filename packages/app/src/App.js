import React, { useState } from 'react';
import './App.css';
import config from './config';

import Form from './components/form';
import Button from './components/button';

const TOKEN = 'token';

const App = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem(TOKEN) || '');

  const clearForm = () => {
    setFirstName(null);
    setLastName(null);
    setUsername(null);
    setPassword(null);
  }

  const register = () => {
    const requestOptionsRegister = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password
      })
    };
    fetch(`${config.API_BASE_URL}/register`, requestOptionsRegister)
      .catch(error => {
        console.log('error: ', error);
      });
  }

  const login = () => {
    const requestOptionsLogin = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        password: password
      })
    }
    fetch(`${config.API_BASE_URL}/login`, requestOptionsLogin)
      .then(res => res.json())
      .then(result => {
        let token = result.token;
        setToken(token);
        localStorage.setItem(TOKEN, token);
        clearForm();
      })
      .catch(error => {
        console.log('error: ', error);
      })
  }

  const getUser = () => {
    const requestOptionsGetUser = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${token}`
      }
    }
    fetch(`${config.API_BASE_URL}/user`, requestOptionsGetUser)
      .catch(error => {
        console.log('error: ', error);
      })
  }

  const logOut = () => {
    setToken(null);
    localStorage.removeItem(TOKEN);
  }

  return (
    <div className="App">
      <div className="container">
        <div className="subtext">
          Authentication Example
          <hr />
          {!token &&
            (
              <div>
                <Form label="First Name" value={firstName} setValue={setFirstName} />
                <Form label="Last Name" value={lastName} setValue={setLastName} />
                <Form label="Username" value={username} setValue={setUsername} />
                <Form label="Password" value={password} setValue={setPassword} />
              </div>
            )
          }
          {!token ?
            (
              <div>
                <Button label="Register" onClick={register} />
                <Button label="Login" onClick={login} />
              </div>
            ) :
            (
              <div>
                <Button label="Get User" onClick={getUser} />
                <Button label="Log Out" onClick={logOut} />
              </div>
            )
          }
        </div>
      </div>
    </div >
  );
}

export default App;
