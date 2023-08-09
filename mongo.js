const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password as argument');
    process.exit(2);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

console.log("argv 1:", process.argv[0]);
console.log("argv 2:", process.argv[1]);
console.log("argv 3:", process.argv[2]);
console.log("argv 4:", process.argv[3]);
console.log("argv 5:", process.argv[4]);


const url =
    `mongodb+srv://phonebook:${password}@cluster0.epieilm.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema);


if (process.argv.length < 4) {
    Person.find({})
        .then(res => {
            res.forEach(person => {
                console.log(person);
            })
            mongoose.connection.close();
        })
} else {
    const person = new Person({
        name: name,
        number: number
    })
    
    person.save()
        .then(res => {
            console.log(`added ${name} number ${number} to phonebook`)
            mongoose.connection.close();
        })
}