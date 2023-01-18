const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const moment = require('moment')


module.exports = {
    createUser : async (req, res) => {
        try {
            let {phone, email} = req.body
            let uniqueData = await userModel.find({$or: [{ phone: phone }, { email: email }] })
            let arr = []
            uniqueData.map((i) => { arr.push(i.phone, i.email) })

            if (arr.includes(phone)) {
                return res.status(409).send({ status: false, msg: "phone is already exsit" })
            }
            if (arr.includes(email)) {
                return res.status(409).send({ status: false, msg: "email is already exsit" })
            }
            let saveData = await userModel.create(req.body)
            return res.status(201).send({ status: true, msg: "Data created successfully", Data: saveData })
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    },

    login : async (req, res) => {
        try {
            let { email, password } = req.body
            let findUser = await userModel.findOne({ email: email, password: password });
            if (!findUser) {
                return res.status(404).send({ status: false, message: "emailId or password is incorrect" })
            }
            let token = jwt.sign({ userId: findUser._id }, "Secret-key")        
            res.setHeader("token", token)
            return res.status(200).send({ Message: "LoggedIn successfully", Token: token })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    fetchUser : async (req, res) => {
        try {
            let {page} = req.params
            let findUser = await userModel.find().select({title: 1, name: 1, phone: 1, _id: 0}).skip(2*(page-1)).limit(2)
            return res.status(200).send({status: true, Data: findUser})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    fetchUserBySearch : async (req, res) => {
        try {
            let search = ''
            if (req.params.search) {
                search = req.params.search
            }
            let findUser = await userModel.find({name: {$regex: '.*'+search+'.*', $options: 'i' }}).select({title: 1, name: 1, phone: 1, _id: 0})
            if (!findUser[0]) {
                return res.status(404).send({ status: false, msg: "User not found" })
            }
            return res.status(200).send({status: true, Data: findUser})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    fetchUserById : async (req, res) => {
        try {
            let {userId} = req.params
            let findUser = await userModel.findById(userId).select({title: 1, name: 1, phone: 1, _id: 0})
            if (!findUser) {
                return res.status(404).send({ status: false, msg: "User not found" })
            }
            return res.status(200).send({status: true, Data: findUser})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    updateUser : async (req, res) => {
        try {
            let userId = req.params.userId
            let data = req.body
            let {phone, email} = data
            if (Object.keys(data).length < 1) {
                return res.status(400).send({ status: false, message: "Please enter data whatever you want to update" })
            }
            let uniqueData = await userModel.find({$or: [{ phone: phone }, { email: email }] })
            let arr = []
            uniqueData.map((i) => { arr.push(i.phone, i.email) })
    
            if (arr.includes(phone)) {
                return res.status(409).send({ status: false, msg: "phone is already exsit" })
            }
            if (arr.includes(email)) {
                return res.status(409).send({ status: false, msg: "email is already exsit" })
            }
     
            data['updatedAt'] = moment().format("DD-MM-YYYY  h:mm:ss a")
            let updateData = await userModel.findByIdAndUpdate(userId,data,{new: true})
            if (!updateData) {
                return res.status(404).send({ status: false, msg: "User not found" })
            }
            return res.status(400).send({ status: false, Data: updateData })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    }
}
