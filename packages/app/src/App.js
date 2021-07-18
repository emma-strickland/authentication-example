import './App.scss';
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

/*
1. hide password from password field by passing a type as prop in form component
2. hide password from mongo response by adjusting the schema 
*/

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
            <div className="content">
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
            </div>
        </Router >
    );
}

export default App;
