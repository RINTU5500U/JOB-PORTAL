const express = require("express")
const router = express.Router()

const {createUser, login, fetchUser, fetchUserBySearch, fetchUserById, updateUser} = require('../controllers/userController')
const {postJob, findJobPost, findJobPostById, findJobBySearch, findJobByFilter, updateJobPost, deleteJobPost} = require('../controllers/jobPostController')
const {applyJob, findMyJob, updateApplyJob, deleteApplyJob, findAllAppliedJobByMe, specificAppliedJobByMyPost, allAppliedJobByMyPost} = require('../controllers/jobApplyController')
const {authentication, authorization} = require('../middlewares/auth')
const {userValidation, loginValidation, updateUserValidation, jobPostValidation, updateJobPostValidation} = require('../middlewares/validation')

router.post('/createUser', userValidation, createUser)
router.post('/login', loginValidation, login)
router.get('/fetchUser/:page', authentication, fetchUser)
router.get('/fetchUserById/:userId', authentication, fetchUserById)
router.get('/fetchUserBySearch/:search', authentication, fetchUserBySearch)
router.put('/updateUser/:userId', updateUserValidation, authentication, authorization, updateUser)

router.post('/postJob/:userId', jobPostValidation, authentication, postJob)
router.get('/findJobPost/:page', authentication, findJobPost)
router.get('/findJobPostById/:userId', authentication, findJobPostById)
router.get('/findJobBySearch/:page', authentication, findJobBySearch)
router.get('/findJobByFilter/:page', authentication, findJobByFilter)
router.put('/user/:userId/updateJobPost/:jobId', updateJobPostValidation, authentication, authorization, updateJobPost)
router.delete('/user/:userId/deleteJobPost/:jobId', authentication, authorization, deleteJobPost)

router.post('/user/:userId/applyJob/:jobId', authentication, applyJob)
router.get('/user/:userId/findMyJob/:jobId', authentication, authorization, findMyJob)
router.put('/user/:userId/updateAppliedJob/:jobApplyId', authentication, authorization, updateApplyJob)
router.delete('/user/:userId/updateAppliedJob/:jobApplyId', authentication, authorization, deleteApplyJob)
router.get('/user/:userId/allAppliedJob/:page', authentication, authorization, findAllAppliedJobByMe)
router.get('/user/:userId/specificAppliedJob/:jobId', authentication, specificAppliedJobByMyPost)
router.get('/allAppliedJobByMyPost/:jobId/page/:page', authentication, allAppliedJobByMyPost)

router.all("/*", function (req, res) { 
    return res.status(400).send({ status: false, message: "invalid http request" });
});

module.exports = router