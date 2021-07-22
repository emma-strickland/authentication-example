// TODO(emma): error objects are not showing up in error response.
const bcrypt = require('bcryptjs')
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('./model');

dotenv.config();

const PORT = process.env.PORT || 4000;
const BEARER = 'Bearer';

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

const validateEmail = (input) => {
	var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	if (input.match(validRegex)) {
		return true;
	}
	else {
		return false;
	}
}

const authorizeRequest = (req, callback) => {
	if (!req.headers.authorization) {
		callback('Token is null', null);
		return
	}
	if (!req.headers.authorization.startsWith(BEARER)) {
		callback('Token does not start with Bearer', null);
		return
	}
	let token = req.headers.authorization.slice(BEARER.length);
	let payload;
	try {
		payload = jwt.verify(token, `${process.env.JWT_SECRET}`);
	} catch (err) {
		callback(err, null);
		return
	}

	callback(null, payload.email);
}

app.post('/register', (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	if (!email) {
		res.status(400).json(makeError('Please enter an email'))
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
	if (!validateEmail(email)) {
		res.status(400).json(makeError('Invalid email'))
		return
	}
	User.findOne({ email: email, }, (err, user) => {
		if (err) {
			res.status(500).json(err);
			return;
		}
		if (user) {
			res.status(400).json(makeError('Already registered'))
			return
		}
		const userDocument = new User({
			email: email,
			password: bcrypt.hashSync(password, 10),
			firstName: firstName,
			lastName: lastName
		});
		userDocument.save((err, result) => {
			if (err) {
				res.status(500).json(err);
				return;
			}
			res.status(200).json(makeRegisterResponse(result));
		});
	});
})

app.post('/login', (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	if (!email) {
		res.status(400).json(makeError('Please enter an email'))
		return
	}
	if (!password) {
		res.status(400).json(makeError('Please enter a password'))
		return
	}
	User.findOne({ email: email, }, (err, user) => {
		if (err) {
			res.status(500).json(err);
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
		res.status(200).json(makeLoginResponse(user, jwt.sign({ email: email }, `${process.env.JWT_SECRET}`)));
	});
})

app.get('/user', (req, res) => {
	authorizeRequest(req, (err, email) => {
		if (err) {
			res.status(401).json(err);
			return
		}
		User.findOne({ email: email, }, (err, user) => {
			if (err) {
				res.status(500).json(err);
				return;
			}
			if (!user) {
				res.status(400).json(makeError('User not found'))
				return
			}
			res.status(200).json(makeUserResponse(user))
		});
	});
})

app.post('/sell', (req, res) => {
	authorizeRequest(req, (err, email) => {
		if (err) {
			res.status(401).json(err);
			return
		}
		User.findOne({ email: email, }, (err, user) => {
			if (err) {
				res.status(500).json(err);
				return;
			}
			if (!user) {
				res.status(400).json(makeError('User not found'))
				return
			}
			res.status(200).json(makeUserResponse(user))
		});
		User.insertMany([{ title: title }, { description: description }, { price: price }], (err, result) => {
			if (err) {
				res.status(500).json(err);
				return;
			}
			res.status(200).json(makeUserResponse(result))
		});
		const sellDocument = new Sell({
			title: title,
			description: description,
			price: price,
		});
		sellDocument.save((err, result) => {
			if (err) {
				res.status(500).json(err);
				return;
			}
			res.status(200).json(makeRegisterResponse(result));
		});
	});
})

const initAsync = async () => {
	try {
		let mongooseConnectionURL;
		mongooseConnectionURL += `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}`;
		mongooseConnectionURL += `@${process.env.DB_HOST}/${process.env.DB_NAME}?`;
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