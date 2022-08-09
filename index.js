const express = require("express");
const app = express();
const path = require("path");

const dotenv = require("dotenv"); // for the .env
dotenv.config();

const port = process.env.PORT || 3000; //initialize port number

const routes = require("./routes/routes.js"); // sets routes file directory

const session = require("express-session"); // uses express session
const bodyParser = require("body-parser"); // uses body parser not used ?
const hbs = require("hbs"); // uses hbs (handlebars)
const helper = require("handlebars"); // uses hbs (handlebars) not used ?


// START:: Agenda.js Stuff
const agenda = require('./jobs/index.js'); // requires agenda.js used for scheduling tasks
const { allDefinitions } = require("./jobs/definitions"); //sets the job definitions


// listen for the ready or error event.
agenda
    .on('ready', () => {
		// define all agenda jobs
		allDefinitions(agenda); })
    .on('error', () => console.log("Agenda connection error!"));



// logs all registered jobs 
console.log({ jobs: agenda._definitions });

// END:: Agenda.js stuff



//helper used if a variable is equal to a value
hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
	return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

let options = {
	weekday: "long",
	year: "numeric",
	month: "long",
	day: "numeric",
};

hbs.registerHelper("formatDate", function (string) {
	if (string === "") {
		return "-";
	} else {
		let date = new Date(string);
		var month = date.toLocaleString("default", { month: "short" });
		return month + ". " + date.getDate() + ", " + date.getFullYear();
	}
});
hbs.registerHelper("inc", function (number, options) {
	if (typeof number === "undefined" || number === null) return null;
	return number + (options.hash.inc || 1);
});

hbs.registerHelper("formatDateAndTime", function (string) {
	const date = new Date(string);
	if (string === "") {
		return "-";
	} else {
		return date.toLocaleString(options);
	}
});

hbs.registerHelper("lastDate", function (arrOfDates) {
	const dateString = arrOfDates[arrOfDates.length - 1];
	const date = new Date(dateString);
	if (dateString === "") {
		return "-";
	} else {
		return date.toLocaleString(options);
	}
});

hbs.registerHelper("formatDateToIso", function (string) {
	if (string === "") {
		return "-";
	} else {
		return string.toISOString().substr(0, 10);
	}
});

hbs.registerHelper("getClass_TaskPriorityBadge", function (string) {
	var badgeClass;

	switch (string) {
		case "Overdue":
			badgeClass = "red darken-2";
			break;
		case "High":
			badgeClass = "orange white-text darken-2";
			break;
		case "Medium":
			badgeClass = "yellow white-text darken-2";
			break;
		case "Normal":
			badgeClass = "green white-text darken-2";
			break;
		case "Low":
			badgeClass = "blue white-text darken-2";
			break;
	}

	return badgeClass;
});

const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads

// connects to the database using mongoose
const DBurl =
	process.env.DBurl || "mongodb://localhost:27017/HRIS_Leonio_Group";
mongoose.connect(
	DBurl,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	() => {
		console.log("Connected to Database: " + DBurl);
	}
);

app.set("view engine", "hbs"); // sets handlebars as viewengine
// hbs.registerPartials(__dirname + '/views/partials'); // sets directory for partials
hbs.registerPartials(path.join(__dirname, "views")); // sets directory for partials
app.set("views", path.join(__dirname, "views")); //sets directory for views to everything inside ./views
app.use(express.static(__dirname + "/assets")); //sets directory for assets

// connects to port
app.listen(port, () => {
	console.log("Listening to port: " + port);
});

// use `express-session`` middleware and set its options
// use `MongoStore` as server-side session storage
app.use(
	session({
		secret: "HRIS-secret",
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({ mongoUrl: DBurl }),
	})
);

app.use("/", routes);
