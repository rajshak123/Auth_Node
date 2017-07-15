/**
 * Created by raj on 7/14/2017.
 */
const mongoose = require('mongoose')

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false


    },
    completedAt: {
        type: Number,
        default: null
    }
})
module.exports={Todo}