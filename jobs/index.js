const Agenda = require('agenda');
const { allDefinitions } = require("./definitions");

const dotenv = require("dotenv"); // for the .env
dotenv.config();

// establised a connection to our mongoDB database.
const agenda = new Agenda({
    db: {
        address: process.env.DBurl,
        collection: 'agendaJobs',
        options: { useUnifiedTopology: true },
    },
    processEvery: "10 seconds",
    maxConcurrency: 20,
});

agenda.start();

// listen for the ready or error event.
agenda
    .on('ready', () => console.log("Agenda started!"))
    .on('error', () => console.log("Agenda connection error!"));

// define all agenda jobs
allDefinitions(agenda);

// logs all registered jobs 
console.log({ jobs: agenda._definitions });

module.exports = agenda;