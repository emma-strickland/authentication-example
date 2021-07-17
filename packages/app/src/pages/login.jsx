import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import Button from "../components/button";
import Form from '../components/form';
import config from '../config';

const Login = ({ onLogin }) => {
    let history = useHistory();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const clearForm = () => {
        setUsername('');
        setPassword('');
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
                onLogin(result.token)
                clearForm();
                history.push("/");
            })
            .catch(error => {
                console.log('error: ', error);
            })
    }

    return (
        <div>
            <h1>
                Login
            </h1>
            <Form label="Username" value={username} setValue={setUsername} />
            <Form label="Password" value={password} setValue={setPassword} />
            <Button label="Login" onClick={login} />
        </div>

    )
}

export default Login;