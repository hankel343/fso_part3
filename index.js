require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'));
app.use(cors());
app.use(express.static('build'));

morgan
    .token('post', (req, res) => {
        return JSON.stringify(req.body);
    })

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Welcome</h1>');
})

app.get('/api/persons', (req, res) => {
    Person.find({})
        .then(people => {
            res.json(people);
        })
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);

    person
        ? res.send(person)
        : res.send(404).end();
})

app.get('/info', (req, res) => {
    const numPeople = persons.length;
    const timeStamp = new Date();

    const html = 
    `
        <p>Phonebook has info for ${numPeople} people</p>
        <p>${timeStamp}</p>
    `

    res.send(html);
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(p => p.id !== id);

    console.log("Deleting: ", id);

    res.send(204);
})

app.post('/api/persons', (req, res) => {
    const generateId = () => {
        return Math.floor(Math.random() * 10000);
    }

    const isDuplicateName = (name) => {
        return (persons.find(p => p.name === name) != undefined);
    }

    const newPerson = req.body;

    if (newPerson.name === '') {
        return res.status(400)
            .json({'error': 'Missing name'});
    } else if (newPerson.number === '') {
        return res.status(400)
            .json({'error': 'Missing number'});
    } else if (isDuplicateName(newPerson.name)) {
        return res.status(400)
            .json({'error': `${newPerson.name} is already in the phone book`});
    }

    newPerson.id = generateId();
    persons = persons.concat(newPerson);

    return res.json(newPerson);
})

app.put('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    console.log(id);
    console.log(typeof(persons[0].id));
    console.log(typeof(id));
    const oldPersonIdx = persons.findIndex(p => Number(p.id) === id);
    const newPerson = req.body;

    console.log(oldPersonIdx);

    if (newPerson.number === '') {
        return res.status(400)
            .json({'error': "Missing number"});
    } else if (oldPersonIdx === -1) { // Check for null or undefined
        return res.status(404)
            .json({'error': `Person not found`});
    }

    persons[oldPersonIdx].number = newPerson.number;
    
    return res.sendStatus(200);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});