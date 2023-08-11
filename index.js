require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint ' })
}

const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }

  next(err)
}

const app = express()
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))
app.use(cors())

// unknown endpoint and error handling middleware at end of file

morgan
  .token('post', (req) => {
    return JSON.stringify(req.body)
  })

app.get('/', (req, res) => {
  res.send('<h1>Welcome</h1>')
})

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(people => {
      res.json(people)
    })
    .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(result => {
      return res.send(result)
    })
    .catch(err => next(err))
})

app.get('/info', (req, res, next) => {
  Person.count()
    .then(result => {
      const html =
            `
                <p>The phone book currently contains ${result} entries.</p>
                <p> Updated as of: <br> ${new Date()}</p>
            `
      res.send(html)
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      return res.status(204).end()
    })
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const payload = req.body

  if (payload.name === undefined) {
    return res.status(400)
      .json({ 'error': 'Missing name' })
  } else if (payload.number === undefined) {
    return res.status(400)
      .json({ 'error': 'Missing number' })
  }

  const person = new Person({
    name: payload.name,
    number: payload.number
  })

  person.save()
    .then(res => {
      console.log('Person saved')
      return res.json(person)
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true })
    .then(updatedPerson => {
      return res.json(updatedPerson)
    })
    .catch(err => next(err))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})