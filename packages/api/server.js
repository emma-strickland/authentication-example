// TODO(emma): error objects are not showing up in error response.
// TODO: database transactions should be reverted on error

const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

dotenv.config();

const PORT = process.env.PORT || 4000;

const initAsync = async () => {
	try {
		const app = express();
		app.use(cors());
		app.use(express.json());
		app.use(express.urlencoded({ extended: true }));


		const authentication = require('./routes/authentication');
		const listing = require('./routes/listing');

		app.use('/authentication', authentication);
		app.use('/listing', listing);

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
		console.log('Error starting server: ', err);
	}
}

initAsync();