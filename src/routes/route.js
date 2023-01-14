const express = require("express")
const router = express.Router()

const {createUser, login, fetchUser, fetchUserById, updateUser} = require('../controllers/userController')
const {postJob, findJobPost, findJobPostById, findJobByFilter, updateJobPost, deleteJobPost} = require('../controllers/jobController/jobPostController')
const {applyJob, findMyJob, updateApplyJob, deleteApplyJob, findAllAppliedJobByMe, specificAppliedJobByMyPost, allAppliedJobByMyPost} = require('../controllers/jobController/jobApplyController')
const {authentication, authorization} = require('../middlewares/auth')

router.post('/createUser',createUser)
router.post('/login',login)
router.get('/fetchUser', authentication, fetchUser)
router.get('/fetchUserById/:userId', authentication, fetchUserById)
router.put('/updateUser/:userId',authentication, authorization, updateUser)

router.post('/postJob/:userId',authentication, postJob)
router.get('/findJobPost', authentication, findJobPost)
router.get('/findJobPostById/:userId', authentication, findJobPostById)
router.get('/findJobByFilter', authentication, findJobByFilter)
router.put('/user/:userId/updateJobPost/:jobId', authentication, authorization, updateJobPost)
router.delete('/user/:userId/deleteJobPost/:jobId', authentication, authorization, deleteJobPost)

router.post('/user/:userId/applyJob/:jobId', authentication, applyJob)
router.get('/user/:userId/findMyJob/:jobId', authentication, authorization, findMyJob)
router.put('/user/:userId/updateAppliedJob/:jobApplyId', authentication, authorization, updateApplyJob)
router.delete('/user/:userId/updateAppliedJob/:jobApplyId', authentication, authorization, deleteApplyJob)
router.get('/user/:userId/allAppliedJob/:page', authentication, authorization, findAllAppliedJobByMe)
router.get('/user/:userId/specificAppliedJob/:jobId', authentication, specificAppliedJobByMyPost)
router.get('/allAppliedJobByMyPost/:jobId/page/:page', authentication, allAppliedJobByMyPost)

router.all("/*", function (req, res) {
    res.status(400).send({ status: false, message: "invalid http request" });
});


module.exports = router