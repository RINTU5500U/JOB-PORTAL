const jobPostingModel = require('../../models/jobModel/jobPostingModel')
const moment = require('moment')
const mongoose = require('mongoose')
const titleRegex = /^([a-zA-Z ]){1,100}$/
const emailRegex = /.+\@.+\..+/


const postJob = async (req, res) => {
    try {
        let data = req.body
        let { title, description, email, experience} = data
        data['userId'] = req.params.userId
        if (!title) {
            return res.status(400).send({ status: false, msg: "title is required" })
        }
        if (!titleRegex.test(title)) {
            return res.status(400).send({ status: false, msg: `title is not valid"` })
        }
        if (!description) {
            return res.status(400).send({ status: false, msg: "description is required" })
        }
        if (description.length > 200) {
            return res.status(400).send({ status: false, msg: `description should be under 200 character"` })
        }
        if (!email) {
            return res.status(400).send({ status: false, msg: "email number is required" })
        }
        if (!emailRegex.test(email)) {
            return res.status(400).send({ status: false, msg: `please enter valid emailId` })
        }
        // if (skill) {
        //     if (skill.length == 1) {
        //         $pus
        //     }
        // }
        if (experience) {
            if (experience < 1) {
                return res.status(400).send({ status: false, msg: `experience should be minimum 1 year` })
            }
        }
        let postData = await jobPostingModel.create(data)
        return res.status(201).send({ status: true, msg: 'Job posted successfully', Data : postData})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const findJobPost = async (req, res) => {
    try {
        let findJob = await jobPostingModel.find({isDeleted: false}).select({title:1, description : 1, email: 1, skill: 1, experience: 1, _id: 0})
        return res.status(200).send({status: true, Data: findJob})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const findJobPostById = async (req, res) => {
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
} 

const findJobByFilter = async (req, res) => {
    try {
        let data = req.query
        if (!data) {
            return res.status(400).send({ status: false, msg: `enter skill and experience to filter data`})
        }
        let findJob = await jobPostingModel.find({$and:[data,{isDeleted: false}]}).select({title:1, description : 1, email: 1, skill: 1, experience: 1, _id: 0})
        if (findJob[0] == undefined) {
            return res.status(404).send({status: false, msg: 'Job not found'})
        }
        return res.status(400).send({status: true, Job: findJob})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const updateJobPost = async (req, res) => {
    try {
        let userId = req.params.userId
        let data = req.body
        let {title, description, email, skill, experience} = data
        if (!data) {
            return res.status(400).send({ status: false, msg: `please enter data whatever you want to update`})
        }
        if (title) {
            if (!titleRegex.test(title)) {
                return res.status(400).send({ status: false, msg: `title is not valid"` })
            }
        }
        if (description) {
            if (description.length > 200) {
                return res.status(400).send({ status: false, msg: `description should be under 200 character"` })
            }        
        }
        if (email) {
            if (!emailRegex.test(email)) {
                return res.status(400).send({ status: false, msg: `please enter valid emailId` })
            }
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
}

const deleteJobPost = async (req, res) => {
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
module.exports = {postJob, findJobPost, findJobPostById, findJobByFilter, updateJobPost, deleteJobPost}