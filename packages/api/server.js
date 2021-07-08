const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let users = {};

app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username) {
        res.status(500).send('Please enter a username')
    }
    if (!password) {
        res.status(500).send('Please enter a password')
    }
    if (username in users) {
        res.status(500).send('Already registered')
    }
    else {
        users[username] = password
    }
    res.status(200).send('Succesfully registered');
})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username) {
        res.status(500).send('Please enter a username')
    }
    if (!password) {
        res.status(500).send('Please enter a password')
    }
    if (!username in users) {
        res.status(404).send('Username not found')
    }
    if (users[username] === password) {
        res.status(200).send('Successfully logged in')
    }
    else {
        res.status(404).send('Invalid password')
    }
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});