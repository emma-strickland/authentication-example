import './App.css';
import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import Header from './components/header'

import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';

const TOKEN = 'token';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem(TOKEN) || '');

    const logOut = () => {
        setToken(null);
        localStorage.removeItem(TOKEN);
    }

    return (
        <Router>
            <Header token={token} onLogOut={logOut} />
            <Switch>
                <Route path="/register">
                    <Register />
                </Route>
                <Route path="/login">
                    <Login onLogin={token => {
                        setToken(token);
                        localStorage.setItem(TOKEN, token);
                    }} />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </Router >
    );
}

export default App;
