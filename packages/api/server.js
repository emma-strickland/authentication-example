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
    // TODO: get the username and password
    // TODO: store in an object
    const username = req.body.username;
    const password = req.body.password;
    if (!username in users) {
        users[username] = password
    }
    else {
        console.log('Already registered')
    }
    res.sendStatus(200);
})

app.post('/login', (req, res) => {
    // TODO: get the username and password
    // TODO: store in an object
    const username = req.body.username;
    const password = req.body.password;
    if (!username in users) {
        res.sendStatus(404)
        console.log('Username not found')
    }
    else if (username in users && users[username] === password) {
        res.sendStatus(200)
        console.log('Successfully logged in')
    }
    else if (username in users && users[username] !== password) {
        res.sendStatus(404)
        console.log('Invalid password')
    }
    res.sendStatus(200);
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});