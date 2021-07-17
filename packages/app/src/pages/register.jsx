import React, { useState } from "react";

import Button from "../components/button";
import Form from '../components/form';
import config from '../config';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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

    return (
        <div>
            <h1>
                Register
            </h1>
            <Form label="First Name" value={firstName} setValue={setFirstName} />
            <Form label="Last Name" value={lastName} setValue={setLastName} />
            <Form label="Username" value={username} setValue={setUsername} />
            <Form label="Password" value={password} setValue={setPassword} />
            <Button label="Register" onClick={register} />
        </div>
    )
}

export default Register;