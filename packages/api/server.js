const bcrypt = require('bcryptjs')
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

dotenv.config();

const User = require('./model');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username) {
        res.status(400).send('Please enter a username')
        return
    }
    if (!password) {
        res.status(400).send('Please enter a password')
        return
    }
    User.findOne({ username: username, }, function (err, user) {
        if (err) {
            res.status(500).send('Internal error: ', err);
            return;
        }
        if (user) {
            res.status(400).send('Already registered')
            return
        }
        const userDocument = new User({
            username: username,
            password: bcrypt.hashSync(password, 10)
        });
        userDocument.save(function (err, result) {
            if (err) {
                res.status(500).send('Internal error: ', err);
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
        res.status(400).send('Please enter a username')
        return
    }
    if (!password) {
        res.status(400).send('Please enter a password')
        return
    }
    User.findOne({ username: username, }, function (err, user) {
        if (err) {
            res.status(500).send('Internal error: ', err);
            return;
        }
        if (!user) {
            res.status(400).send('Username not found')
            return
        }
        if (!bcrypt.compareSync(password, user.password)) {
            res.status(404).send('Invalid password')
            return
        }
        res.status(200).send('Successfully logged in')
    });
})

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.yv9cw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});