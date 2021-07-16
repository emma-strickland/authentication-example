import React, { useState } from 'react';

import './App.css';

/*
1. login server request
2. get user button & request
3. pass token from login to getUser and add as header to getUser request
4. display getUser result 
*/

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const register = () => {
    //alert("You are now registered");
    // make request to server
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
    fetch('http://localhost:4000/register', requestOptionsRegister)
      .then(res => res.json())
      .then(result => {
        console.log(result);
      }).catch(error => {
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

    fetch('http://localhost:4000/login', requestOptionsLogin)
      .then(res => res.json())
      .then(result => {
        setToken(result.token);
        console.log(result);
      }).catch(error => {
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

    fetch('http://localhost:4000/user', requestOptionsGetUser)
      .then(res => res.json())
      .then(result => {
        console.log(result);
      }).catch(error => {
        console.log('error: ', error);
      })
  }

  return (
    <div className="App">
      <div className="container">
        <div className="subtext">
          Authentication Example
          <hr />
          <div>
            <form>
              <label>
                First Name:
                <input
                  type="text" name="First Name"
                  onChange={e => setFirstName(e.target.value)}
                  value={firstName}
                />
              </label>
            </form>
          </div>
          <div>
            <form>
              <label>
                Last Name:
                <input
                  type="text" name="Last Name"
                  onChange={e => setLastName(e.target.value)}
                  value={lastName}
                />
              </label>
            </form>
          </div>
          <div>
            <form>
              <label>
                Username:
                <input
                  type="text" name="Username"
                  onChange={e => setUsername(e.target.value)}
                  value={username}
                />
              </label>
            </form>
          </div>
          <div>
            <form>
              <label>
                Password:
                <input
                  type="text" name="Password"
                  onChange={e => setPassword(e.target.value)}
                  value={password}
                />
              </label>
            </form>
          </div>
          <div>
            <button onClick={register}>
              Register
            </button>
          </div>
          <div>
            <button onClick={login}>
              Login
            </button>
          </div>
          <div>
            <button onClick={getUser}>
              Get User
            </button>
          </div>
        </div>
      </div>
    </div >
  );
}

export default App;
