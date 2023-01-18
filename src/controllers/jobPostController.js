const jobPostingModel = require('../models/jobPostingModel')
const moment = require('moment')

module.exports = {
    postJob : async (req, res) => {
        try {
            let data = req.body
            data['userId'] = req.params.userId
            let postData = await jobPostingModel.create(data)
            return res.status(201).send({ status: true, msg: 'Job posted successfully', Data : postData})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    findJobPost : async (req, res) => {
        try {
            let {page} = req.params
            if (!page) {
                page = 1
            }
            let findJob = await jobPostingModel.find({isDeleted: false}).select({title:1, description : 1, email: 1, skill: 1, experience: 1, _id: 0}).skip(2*(page-1)).limit(2)
            return res.status(200).send({status: true, Data: findJob})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    findJobPostById : async (req, res) => {
        try {
            let userId = req.params.userId
            let findJob = await jobPostingModel.findOne({isDeleted: false,_id: userId}).select({title:1, description : 1, email: 1, skill: 1, experience: 1, _id: 0})
            if (!findJob) {
                return res.status(404).send({ status: false, msg: `Job not found` })
            }
            return res.status(200).send({status: true, Data: findJob})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    findJobBySearch : async (req, res) => {
        try {
            let {page} = req.params
            if (!page) {
                page = 1
            }
            let search = ''
            if (req.query.search) {
                search = req.query.search
            }
            let findJobPosts = await jobPostingModel.find({
                isDeleted: false,
                $or: [
                    {title: {$regex: '.*'+search+'.*', $options: 'i' }},
                    {skill: {$regex: '.*'+search+'.*', $options: 'i' }},
                    // {experience: {$regex: '.*'+search+'.*'}}
                ]
            }).select({title: 1, description: 1, skill: 1, experience: 1, email: 1, _id: 0}).skip(2*(page-1)).limit(2)

            if (findJobPosts[0] == undefined) {
                return res.status(404).send({status: false, msg: 'Job not found'})
            }
            return res.status(400).send({status: true, Job: findJobPosts})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    findJobByFilter: async (req, res) => {
        try {
            let {page} = req.params
            if (!page) {
                page = 1
            }
            let data = req.query
            if (!data) {
                return res.status(400).send({ status: false, msg: `enter skill and experience to filter data`})
            }
            let findJob = await jobPostingModel.find(data).select({title: 1, description: 1, skill: 1, experience: 1, email: 1, _id: 0}).skip(2*(page-1)).limit(2)
            if (findJob[0] == undefined) {
                return res.status(404).send({status: false, msg: 'Job not found'})
            }
            return res.status(400).send({status: true, Job: findJob})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    updateJobPost : async (req, res) => {
        try {
            let userId = req.params.userId
            let data = req.body
            let {title, description, email, skill, experience} = data
            if (Object.keys(data).length < 1) {
                return res.status(400).send({ status: false, message: "Please enter data whatever you want to update" })
            }
    
            let updatedData = {
                title: title,
                description: description,
                email: email, 
                $push: {skill: skill},
                updatedAt: moment().format("DD-MM-YYYY  h:mm:ss a"),
                experience: experience
            }
            let updateJobPost = await jobPostingModel.findOneAndUpdate({isDeleted: false,_id: userId}, updatedData, {new: true})
            if (!updateJobPost) {
                return res.status(404).send({ status: false, msg: `Job post not found`})
            }
            return res.status(200).send({status: true, msg: "Job Post updated successfully", Job: updateJobPost})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    deleteJobPost : async (req, res) => {
        try {
            let userId = req.params.userId
            if (!userId) {
                return res.status(400).send({ status: false, msg: `please enter user id to delete your Job post`})
            }
    
            let deleteJob = await jobPostingModel.findOneAndUpdate({isDeleted: false, _id: userId},{isDeleted:true,deletedAt: moment().format("DD-MM-YYYY  h:mm:ss a")})
            if (!deleteJob) {
                return res.status(404).send({ status: false, msg: `Job post not found` })
            }
            return res.status(200).send({status: true, msg: "Job Post deleted successfully"})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    }
}

