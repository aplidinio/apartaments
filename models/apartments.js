const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const photoSchema = new Schema({
    
    title : String,
    url : String,
    mainPhoto : Boolean
});

const numberOfBeds = new Schema({

    type: String,
    beds: Number,
    additionalBeds: Number
});

const reservation = new Schema({

    start: Date,
    end: Date,
    adults: Number,
    kids: Number
});

const apartmentSchema = new Schema({
    
    title : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    rulesDescription : String,
    rulesIcons : Array,
    beds : {
        type: [numberOfBeds],
        required: true
    },
    rooms : {
        type: Number,
        required: true
    },
    bathRooms : {
        type: Number,
        required: true
    },       
    photos : {
        type: [photoSchema],
        required: true
    },
    price : {
        type: Number,
        required: true
    },
    occupancy : {
        type: Number,
        required: true
    },
    apartmentSize : {
        type: Number,
        required: true
    },
    services : Array,
    location : {
        type: {
            province: String,
            city: String,
            GPS: Array,
        },
    },
    reservations : {
        type: [reservation],
        required: true
    }
});

module.exports = mongoose.model('Apartment', apartmentSchema);
