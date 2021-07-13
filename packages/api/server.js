const User = require('./model');

const bcrypt = require('bcryptjs')
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Function takes a string and spits out a json object of the format:
const convertToJson = (str) => {
    let jsonMessage =
    {
        message: str
    }
    return jsonMessage
}

app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    if (!username) {
        res.status(400).send.convertToJson('Please enter a username')
        return
    }
    if (!password) {
        res.status(400).send.convertToJson('Please enter a password')
        return
    }
    if (!firstName) {
        res.status(400).send.convertToJson('Please enter your first name')
        return
    }
    if (!lastName) {
        res.status(400).send.convertToJson('Please enter your last name')
        return
    }
    User.findOne({ username: username, }, (err, user) => {
        if (err) {
            res.status(500).send.convertToJson('Internal error: ', err);
            return;
        }
        if (user) {
            res.status(400).send.convertToJson('Already registered')
            return
        }
        const userDocument = new User({
            username: username,
            password: bcrypt.hashSync(password, 10),
            firstName: firstName,
            lastName: lastName
        });
        userDocument.save((err, result) => {
            if (err) {
                res.status(500).send.convertToJson('Internal error: ', err);
                return;
            }
            res.status(200).json(result);
        });
    });
})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username) {
        res.status(400).send.convertToJson('Please enter a username')
        return
    }
    if (!password) {
        res.status(400).send.convertToJson('Please enter a password')
        return
    }
    User.findOne({ username: username, }, (err, user) => {
        if (err) {
            res.status(500).send.convertToJson('Internal error: ', err);
            return;
        }
        if (!user) {
            res.status(400).send.convertToJson('Username not found')
            return
        }
        if (!bcrypt.compareSync(password, user.password)) {
            res.status(404).send.convertToJson('Invalid password')
            return
        }
        res.status(200).json(user);
    });
})

const initAsync = async () => {
    try {
        let mongooseConnectionURL;
        mongooseConnectionURL += `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}`;
        mongooseConnectionURL += `@cluster0.yv9cw.mongodb.net/${process.env.DB_NAME}?`;
        mongooseConnectionURL += `retryWrites=true&w=majority`;
        await mongoose.connect(mongooseConnectionURL, {
            // Uses the new URL Parser. Required for the connection string format we are using.
            useNewUrlParser: true,
            // Uses new topology engine.
            useUnifiedTopology: true,
            // Use new index creation mechanism.
            useCreateIndex: true
        });
        console.log('Successfully connected to db...')

        app.listen(PORT, () => {
            console.log(`Server listening on ${PORT}...`);
        });
    } catch (err) {

    }
}

initAsync();