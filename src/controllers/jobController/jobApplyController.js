const jobApplyModel = require('../../models/jobModel/jobApplyModel')
const userModel = require('../../models/userModel')
const jobPostingModel = require('../../models/jobModel/jobPostingModel')
const moment = require('moment')
const aws = require('../../aws/aws')
const resumeRegex = /^[a-zA-Z0-9]+[\\.](jpg|png|jpeg|pdf|markdown|md)$/

const applyJob = async (req, res) => {
    try {
        let files = req.files
        let {userId, jobId} = req.params
        let data = req.body
        if (!userId) {
            return res.status(400).send({ status: false, message: 'userId is required' })
        }
        let findUser = await userModel.findById(userId)
        if (!findUser) {
            return res.status(404).send({status: false, msg: 'User not found'})
        }
        data['userId'] = userId
        if (!jobId) {
            return res.status(400).send({ status: false, message: 'jobId is required' })
        }
        let findJob = await jobPostingModel.findOne({_id: jobId, isDeleted: false})
        if (!findJob) {
            return res.status(404).send({status: false, msg: 'No longer acceptance for this Job role'})
        }
        data['jobId'] = jobId
        if (!files[0]) {
            return res.status(400).send({ status: false, message: 'Upload ur resume' })
        }
        if (files[0].fieldname != 'resume') {
            return res.status(400).send({ status: false, message: 'resume is required' })
        }
        // if (!resumeRegex.test(files[0].originalname)) {
        //     return res.status(400).send({ status: false, message: 'plz provide your resume in (jpg|png|jpeg|pdf|markdown) format' })
        // }
        let uploadResume = await aws.uploadResume(files[0])
        data['resume'] = uploadResume
        if (!files[1]) {
            return res.status(400).send({ status: false, message: 'upload ur cv' })
        }
        // if (files[1].fieldname != 'coverLetter') {
        //     return res.status(400).send({ status: false, message: 'coverletter is required' })
        // }
        // if (!resumeRegex.test(files[1].originalname)) {
        //     return res.status(400).send({ status: false, message: 'plz provide your resume in (jpg|png|jpeg|pdf|markdown) format' })
        // }
        let uploadCV = await aws.uploadResume(files[1])
        data['coverLetter'] = uploadCV

        let saveData = await jobApplyModel.create(data)
        return res.status(201).send({status: true, msg: 'Job applied successfully', Applyjob: saveData})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const findMyJob = async (req, res) => {
    try {
        let {userId, jobId} = req.params
        let findJob = await jobApplyModel.findOne({userId: userId, jobId: jobId, isDeleted: false}).populate('userId').populate('jobId')
        if (!findJob) {
            return res.status(404).send({status: false, msg: 'Job Not Found'})
        }
        let obj = {
            Name: findJob.userId.name,
            Phone: findJob.userId.phone,
            Email: findJob.userId.email,
            Post: findJob.jobId.title,
            Experience: findJob.jobId.experience + ' Year'
        }
        return res.status(200).send({status: true, Applyjob: obj})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const updateApplyJob = async (req, res) => {
    try {
        let data = req.body
        let files = req.files
        let {userId, jobApplyId} = req.params
        let findJob = await jobApplyModel.findOne({userId: userId, _id: jobApplyId, isDeleted: false})
        if (!findJob) {
            return res.status(404).send({status: false, msg: 'Job Not Found'})
        }
        if (files[0]) {
            let uploadResume = await aws.uploadResume(files[0])
            data['resume'] = uploadResume
        }
        if (files[1]) {
            let uploadCV = await aws.uploadResume(files[1])
            data['coverLetter'] = uploadCV
        }
        data['updatedAt'] = moment().format("DD-MM-YYYY  h:mm:ss a")
        let updateJob = await jobApplyModel.findOneAndUpdate({userId: userId, _id: jobApplyId, isDeleted: false},data,{new:true})
        return res.status(200).send({status: true, msg: 'Job updated successfully', Job: updateJob})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const deleteApplyJob = async (req, res) => {
    try {
        let {userId, jobApplyId} = req.params
        let deleteJob = await jobApplyModel.findOneAndUpdate({userId: userId, _id: jobApplyId, isDeleted: false},{isDeleted: true, deletedAt: moment().format("DD-MM-YYYY  h:mm:ss a")})
        if (!deleteJob) {
            return res.status(404).send({status: false, msg: 'Job Not Found'})
        }
        return res.status(200).send({status: true, msg: 'Job deleted successfully'})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const findAllAppliedJobByMe = async (req, res) => {
    try {
        let {userId, page} = req.params
        let findJob = await jobApplyModel.find({userId: userId, isDeleted: false}).populate('userId').populate('jobId').skip(2*(page-1)).limit(2)
        if (findJob.length == 0) {
            return res.status(404).send({status: false, msg: 'Job Not Found'})
        }

        let allJob = {
            Name: findJob[0].userId.name,
            Phone: findJob[0].userId.phone,
            Email: findJob[0].userId.email,
            AppliedJob: []
        }
        for (let i = 0; i < findJob.length; i++) {
            let obj = {
                Post: findJob[i].jobId.title,
                Experience: findJob[i].jobId.experience + ' Year'
            }
            allJob.AppliedJob.push(obj)
        }
        return res.status(200).send({status: true, Appliedjob: allJob})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const specificAppliedJobByMyPost = async (req, res) => {
    try {
        let {userId,jobId} = req.params
        let findJob = await jobApplyModel.findOne({userId: userId, jobId: jobId, isDeleted: false}).populate('userId').populate('jobId')
        if (!findJob) {
            return res.status(404).send({status: false, msg: 'No applied in this post'})
        }
        if (findJob.userId._id != req.decodedToken.userId) {
            return res.status(403).send({ status: false, message: 'Unauthorized person' })
        }
        let obj = {
            Name: findJob.userId.name,
            Phone: findJob.userId.phone,
            Email: findJob.userId.email,
            Resume: findJob.resume,
            CV: findJob.coverLetter,
            Post: findJob.jobId.title,
            Experience: findJob.jobId.experience + ' Year'
        }
        return res.status(200).send({status: true, Appliedjob: obj})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const allAppliedJobByMyPost = async (req, res) => {
    try {
        let {jobId, page} = req.params
        if (!page) {
            page = 1
        }
        let findJob = await jobApplyModel.find({jobId: jobId, isDeleted: false}).populate('userId').populate('jobId').skip(2*(page-1)).limit(2)
        if (findJob.length == 0) {
            return res.status(404).send({status: false, msg: 'No one applied in this post'})
        }
        if (findJob[0].jobId.userId != req.decodedToken.userId) {
            return res.status(403).send({ status: false, message: 'Unauthorized person' })
        }
        let arr = []
        for (let i = 0; i < findJob.length; i++) {
            let obj = {
                Name: findJob[i].userId.name,
                Phone: findJob[i].userId.phone,
                Email: findJob[i].userId.email,
                Resume: findJob[i].resume,
                CV: findJob[i].coverLetter,
                Post: 'Applied for ' + findJob[i].jobId.title,
                Experience: 'Minimum experience ' + findJob[i].jobId.experience + ' Year'
            }
            arr.push(obj)
        }
        return res.status(200).send({status: true, Appliedjob: arr})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// const getResume = async (req, res) => {
//     try {
//         const s3 = new AWS.S3({
//             accessKeyId: 'AKIAY3L35MCRZNIRGT6N',
//             secretAccessKey: '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'
//         })
//         const params = {
//             Bucket: 'classroom-training-bucket',
//             Key: req.params.file
//         }
//         let a = s3.getObject(params).createReadStream().pipe(res);
//         res.send(a)
//     } catch (error) {
//         return res.status(500).send({ status: false, message: error.message })
//     }
// }

module.exports = { applyJob, findMyJob, updateApplyJob, deleteApplyJob, findAllAppliedJobByMe, specificAppliedJobByMyPost, allAppliedJobByMyPost}