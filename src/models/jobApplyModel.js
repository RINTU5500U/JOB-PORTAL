const mongoose = require('mongoose');
const moment = require('moment')
const ObjectId = mongoose.Schema.Types.ObjectId

const jobApplySchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        // required: true,
        ref: 'User',
        trim: true
    },
    jobId: {
        type: ObjectId,
        ref: 'Jobpost',
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    coverLetter: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    appliedAt: {
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

module.exports = mongoose.model('Jobapply', jobApplySchema)


