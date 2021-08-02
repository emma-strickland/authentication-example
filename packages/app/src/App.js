import './App.scss';
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Header from './components/header'
import Footer from './components/footer'

import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import PostItem from './pages/sell';
import Browse from './pages/browse';

import { TOKEN } from './tools/constants';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem(TOKEN) || '');
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(token.length > 0);
  }, [token]);

  const logIn = () => {

  }

  const logOut = () => {
    setToken('');
    localStorage.removeItem(TOKEN);
  }

  const register = () => {
    console.log('register!')
    setRegisterModalOpen(true);
  }

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} onLogOut={logOut} onLogin={logIn} onRegister={register} />
      <Register isOpen={registerModalOpen} onRequestClose={() => setRegisterModalOpen(false)} />
      <div className="content">
        <Switch>
          <Route path="/login">
            <Login onLogin={token => {
              setToken(token);
              localStorage.setItem(TOKEN, token);
            }} />
          </Route>
          <Route path="/browse">
            <Browse />
          </Route>
          <Route path="/post">
            <PostItem />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
      <Footer />
    </Router >
  );
}

export default App;
