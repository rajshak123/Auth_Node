/**
 * Created by raj on 7/14/2017.
 */
const mongoose = require('mongoose')


var Dishes = mongoose.model('Dishes', {
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    description: {
        type: String,
        required: false,
        default: null
    },
    menus_appeared: {
        type: Number,
        required: false,
        default: null
    },
    times_appeared: {
        type: Number,
        required: false,
        default: null
    },
    first_appeared: {
        type: Number,
        required: false,
        default: null
    },
    last_appeared: {
        type: Number,
        required: false,
        default: null
    },
    lowest_price: {
        type: Number,
        required: false,
        default: null
    },
    highest_price: {
        type: Number,
        required: false,
        default: null
    },

})
module.exports = {
    Dishes
}
