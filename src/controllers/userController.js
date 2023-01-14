const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const nameRegex = /^([a-zA-Z ]){1,100}$/
const phoneRegex = /^[0-9]{10}$/
const emailRegex = /.+\@.+\..+/
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9!@#$%^&*]{8,100})$/

const createUser = async (req, res) => {
    try {
        let data = req.body
        let {title, name, phone, email, password} = data
        if (!title) {
            return res.status(400).send({ status: false, msg: "title is required" })
        }
        if (["Mr", "Mrs", "Miss"].includes(title) == false) {
            return res.status(400).send({ status: false, msg: `title should be either "Mr" or "Mrs" or "Miss"` })
        }
        if (!name) {
            return res.status(400).send({ status: false, msg: "name is required" })
        }
        if (!nameRegex.test(name)) {
            return res.status(400).send({ status: false, msg: `name is not valid` })
        }
        if (!phone) {
            return res.status(400).send({ status: false, msg: "phone number is required" })
        }
        if (!phoneRegex.test(phone)) {
            return res.status(400).send({ status: false, msg: `please enter valid phone number` })
        }
        if (!email) {
            return res.status(400).send({ status: false, msg: "email number is required" })
        }
        if (!emailRegex.test(email)) {
            return res.status(400).send({ status: false, msg: `please enter valid emailId` })
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
        if (!password) {
            return res.status(400).send({ status: false, msg: "password is required" })
        }
        if (!passwordRegex.test(password)) {
            return res.status(400).send({ status: false, msg: "password isn't validate, please make sure length is minimum 8, should have one uppercase and lowercase character and Number also and don't use space and have a special character" })
        }
        let saveData = await userModel.create(data)
        return res.status(201).send({ status: true, msg: "Data created successfully", Data: saveData })
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

const login = async (req, res) => {
    try {
        let data = req.body
        let { email, password } = data
        if (!email) {
            return res.status(400).send({ status: false, msg: "email number is required for login" })
        }
        if (!emailRegex.test(email)) {
            return res.status(400).send({ status: false, msg: `please enter valid emailId` })
        }
        if (!password) {
            return res.status(400).send({ status: false, msg: "password is required to login" })
        }
        if (!passwordRegex.test(password)) {
            return res.status(400).send({ status: false, msg: "password isn't validate, please make sure length is minimum 8, should have one uppercase and lowercase character and Number also and don't use space and have a special character" })
        }
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
}

const fetchUser = async (req, res) => {
    try {
        let findUser = await userModel.find().select({title: 1, name: 1, phone: 1, _id: 0}).skip(2).limit(3)
        return res.status(200).send({status: true, Data: findUser})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const fetchUserById = async (req, res) => {
    try {
        let userId = req.params.userId
        let findUser = await userModel.findById(userId).select({title: 1, name: 1, phone: 1, _id: 0})
        return res.status(200).send({status: true, Data: findUser})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const updateUser = async (req, res) => {
    try {
        let userId = req.params.userId
        let data = req.body
        let {title, name, phone, email, password} = data
        if (title) {
            if (["Mr", "Mrs", "Miss"].includes(title) == false) {
                return res.status(400).send({ status: false, msg: `title should be either "Mr" or "Mrs" or "Miss"` })
            }
        }
        if (name) {
            if (!nameRegex.test(name)) {
                return res.status(400).send({ status: false, msg: `name is not valid` })
            }
        }
        if (phone) {
            if (!phoneRegex.test(phone)) {
                return res.status(400).send({ status: false, msg: `please enter valid phone number` })
            }
            let uniquephone = await userModel.findOne({phone: phone})
            if (uniquephone) {
                return res.status(409).send({ status: false, msg: "phone is already exsit" })
            }
        }
        if (email) {
            if (!emailRegex.test(email)) {
                return res.status(400).send({ status: false, msg: `please enter valid emailId` })
            }
            let uniqueEmail = await userModel.findOne({email: email})
            if (uniqueEmail) {
                return res.status(409).send({ status: false, msg: "email is already exsit" })
            }
        }
        if (password) {
            if (!passwordRegex.test(password)) {
                return res.status(400).send({ status: false, msg: "password isn't validate, please make sure length is minimum 8, should have one uppercase and lowercase character and Number also and don't use space and have a special character" })
            }        
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

module.exports = {createUser, login, fetchUser, fetchUserById, updateUser}