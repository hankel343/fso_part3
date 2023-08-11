const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI

console.log('connecting to:', url);

mongoose.connect(url)
    .then(res => {
        console.log('connected to MongoDB');
    })
    .catch(err => {
        console.log('error connecting to MongoDB:', err.message);
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function(num) {
                return /\d{3}-\d{5}/.test(num);
            },
            message: props => `${props.value} is not a valid phone number.`
        },
        required: [true, "A phone number is required"]
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString();
        delete returnedObj._id;
    }
})

module.exports = mongoose.model('Person', personSchema);