const User = require('./model');

const bcrypt = require('bcryptjs')
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

dotenv.config();

const PORT = process.env.PORT || 3000;

const JWT_SECRET = "shhhhhh";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const makeError = (str) => {
    return {
        message: str
    }
}

const makeRegisterResponse = (user) => {
    return {
        user: user
    }
}

const makeLoginResponse = (user, token) => {
    return {
        user: user,
        token: token
    }
}

const makeUserResponse = (user) => {
    return {
        user: user
    }
}

app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    if (!username) {
        res.status(400).json(makeError('Please enter a username'))
        return
    }
    if (!password) {
        res.status(400).json(makeError('Please enter a password'))
        return
    }
    if (!firstName) {
        res.status(400).json(makeError('Please enter your first name'))
        return
    }
    if (!lastName) {
        res.status(400).json(makeError('Please enter your last name'))
        return
    }
    User.findOne({ username: username, }, (err, user) => {
        if (err) {
            res.status(500).json(makeError('Internal error: ', err));
            return;
        }
        if (user) {
            res.status(400).json(makeError('Already registered'))
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
                res.status(500).json(makeError('Internal error: ', err));
                return;
            }
            res.status(200).json(makeRegisterResponse(result));
        });
    });
})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username) {
        res.status(400).json(makeError('Please enter a username'))
        return
    }
    if (!password) {
        res.status(400).json(makeError('Please enter a password'))
        return
    }
    User.findOne({ username: username, }, (err, user) => {
        if (err) {
            res.status(500).json(makeError('Internal error: ', err));
            return;
        }
        if (!user) {
            res.status(400).json(makeError('User not found'))
            return
        }
        if (!bcrypt.compareSync(password, user.password)) {
            res.status(401).json(makeError('Invalid password'))
            return
        }
        res.status(200).json(makeLoginResponse(user, jwt.sign({ username: username }, JWT_SECRET)));
    });
})

// const authorizeRequest = (req, callback) => {
//     /*
//     if you encounter an error:
//     callback("error message", null)

//     if you find the username:
//     callback(null, "username")
//     */
//     if (!req.headers.authorization) {
//         callback("No authorization header", null);
//         return;
//     }


//     let username = "aksdjfh";
//     callback(null, username);
// }

app.get('/user', (req, res) => {
    let token = req.headers.authorization;
    if (!req.headers.authorization) {
        res.status(401).json(makeError('Unauthorized'));
        return
    }
    if (!token.startsWith('Bearer')) {
        res.status(401).json(makeError('Unauthorized'));
        return
    }

    let payload;
    try {
        payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        console.log(err)
        res.status(401).json(makeError('Unauthorized'));
    }
    const user = payload.username;
    User.findOne({ username: user, }, (err, user) => {
        if (err) {
            res.status(500).json(makeError('Internal error: ', err));
            return;
        }
        if (!user) {
            res.status(400).json(makeError('User not found'))
            return
        }
        res.status(200).json(makeUserResponse(user))
    });

    // authorizeRequest(req, (err, username) => {
    //     if (err) {
    //         res.status(401).json(makeError('Unauthorized'));
    //         return;
    //     }

    //     User.findOne({ username: username }, (err, user) => {
    //         if (err) {
    //             res.status(500).json(makeError('Internal error: ', err));
    //             return;
    //         }
    //         if (!user) {
    //             res.status(400).json(makeError('Username not found'))
    //             return
    //         }
    //         res.status(200).json(makeUserResponse(user))
    //     });

    // });

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