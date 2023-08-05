const express = require('express');
const app = express();

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
    res.send(persons);
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);

    person
    ? res.send(person)
    : res.send(404)
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

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`)