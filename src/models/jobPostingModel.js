const mongoose = require('mongoose');
const moment = require('moment')

const jobPostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase : true,
        trim: true
    },
    skill: {
        type: [String],
        default: []
    },
    experience: Number,
    isDeleted: {
        type: Boolean,
        default: false
    },
    postedAt: {
        type: String, 
        default: moment().format("DD-MM-YYYY  h:mm:ss a") 
    },
    updatedAt: {
        type: String,
        default: null
    },
    deletedAt: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('Jobpost', jobPostSchema)