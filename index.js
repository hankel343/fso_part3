require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint '}) 
}

const errorHandler = (err, req, res, next) => {
    console.log(err.message);

    if (err.message === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    }

    next(err);
}

const app = express();
app.use(express.static('build'));
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'));
app.use(cors());

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
    Person.findById(req.params.id)
        .then(result => {
            return res.send(result);
        })
        .catch(err => next(err))
})

app.get('/info', (req, res) => {
    Person.count()
        .then(result => {
            const html =
            `
                <p>The phone book currently contains ${result} entries.</p>
                <p> Updated as of: <br> ${new Date()}</p>
            `
            res.send(html);
        })
        .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            return res.status(204).end();
        })
        .catch(err => next(err))
})

app.post('/api/persons', (req, res) => {
    const payload = req.body;

    if (payload.name === '') {
        return res.status(400)
            .json({'error': 'Missing name'});
    } else if (payload.number === '') {
        return res.status(400)
            .json({'error': 'Missing number'});
    }

    const person = new Person({
        name: payload.name,
        number: payload.number
    })

    person.save()
        .then(res => {
            console.log("Person saved");
        })
        .catch(err => {
            console.log("Unable to save person to database"); 
        })

    return res.json(person);
})

app.put('/api/persons/:id', (req, res) => {
    const body = req.body;

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            return res.json(updatedPerson);
        })
        .catch(err => next(err))
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});