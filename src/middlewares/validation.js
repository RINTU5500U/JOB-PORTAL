const {userModel, updateUserModel, loginValidation, jobPostModel, updateJobPostModel} = require('../utilities/validator')

module.exports = {
    userValidation: (req, res, next) => {
        const { error } = userModel.validate(req.body)
        if (error) {
            return res.status(400).send({ status: false, message: error.message })
        } else next()
    },
    updateUserValidation: (req, res, next) => {
        const { error } = updateUserModel.validate(req.body)
        if (error) {
            return res.status(400).send({ status: false, message: error.message })
        } else next()
    },
    loginValidation: (req, res, next) => {
        const { error } = loginValidation.validate(req.body)
        if (error) {
            return res.status(400).send({ status: false, message: error.message })
        } else next()
    },
    jobPostValidation: (req, res, next) => {
        const { error } = jobPostModel.validate(req.body)
        if (error) {
            return res.status(400).send({ status: false, message: error.message })
        } else next()
    },
    updateJobPostValidation: (req, res, next) => {
        const { error } = updateJobPostModel.validate(req.body)
        if (error) {
            return res.status(400).send({ status: false, message: error.message })
        } else next()
    },
}