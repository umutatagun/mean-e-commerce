const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icon: String,
    color: String
})

exports.Category = mongoose.model('Category',categorySchema);