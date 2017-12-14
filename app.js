// Declarations
const express = require('express');
const app = express();
const myport = process.env.PORT || 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.listen(myport, () => console.log(`Now listening on port ${myport}`));

// Database Setup
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/flashcardapp', { useMongoClient: true });
mongoose.connection.on('error', console.error.bind(console), 'MDB Connect Err')
mongoose.Promise = global.Promise;

const User = require('./models/user');
const Question = require('./models/question');

// Model Population
const Populate = require('./models/populate');
// Populate.setupUsers();
// Populate.setupQuestions();
// mongoose.connection.dropDatabase();

//Routes
app.get('/cards', (req, res) => {
    User.findOne({ name: 'Robert' })
    .select('stats')
    .then(result => {
        result.stats.forEach(e => 
            e.timesCorrect/e.timesTested > 0.5 
            ? e.rate = 'tier1'
            : e.rate = 'tier2'
        )
        return result.stats;
    })
    .then(result => {
        let tier1 = result.filter(e => e.rate === 'tier1' )
        let tier2 = result.filter(e => e.rate === 'tier2' )
        return [
            ...Array.from({length: 4}, () => tier1[Math.floor(Math.random() * tier1.length)].identifier),
            ...Array.from({length: 6}, () => tier2[Math.floor(Math.random() * tier2.length)].identifier)
        ]
    })
    .then(result => 
        Question.find().where('identifier').in(result)
    )
    .then(result => {
        res.json(result)
    })
});

app.get('/stats', (req, res) => {
    User.findOne({ name: 'Robert' })
        .select('-password -email')
        .then(result => {
            res.json(result);
        })
});

app.post('/stats', (req, res) => {
    console.log(req.body);
    res.json('someshite')
});

