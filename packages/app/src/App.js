import './App.scss';
import React, { useEffect, useState } from "react";
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
    const [isLoggedIn, setIsLoggedIn] = useState();

    useEffect(() => {
        setIsLoggedIn(token.length > 0);
    }, [token]);

    const logOut = () => {
        setToken('');
        localStorage.removeItem(TOKEN);
    }

    return (
        <Router>
            <Header isLoggedIn={isLoggedIn} onLogOut={logOut} />
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
