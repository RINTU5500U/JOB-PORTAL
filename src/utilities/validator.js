const joi = require('joi')
joi.objectId = require('joi-objectid')(joi)

const passwordResponse = {'string.pattern.base': ` "Password should be minimum 8 and maximum 15 character.It contains atleast--> 1 Uppercase letter, 1 Lowercase letter, 1 Number, 1 Special character"`}
const errors = (check) => {
    let messages = {"string.base": `${check} should be a type of 'String'.`,"string.empty": `${check} cannot be an empty field.`,"any.required": `${check} is a required field.`}
    return messages
}        

module.exports = {
    //SCHEMA VALIDATION FOR USERMODEL
    userModel: joi.object({
        title: joi.string().trim().regex(/^(Mr|Mrs|Miss)+$\b/).messages({'string.pattern.base': `Title should be among [Mr,Mrs,Miss]`}).required().messages(errors("Title")),
         name: joi.string().trim().regex(/^[A-Za-z ]+$/).messages({'string.pattern.base': `Plz enter a valid name.`}).required().messages(errors("Username")),
        phone: joi.string().trim().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits only.`}).required().messages(errors("Mobile number")),
        email: joi.string().trim().regex(/.+\@.+\..+/).messages({'string.pattern.base': `Plz enter a valid emailId`}).required().messages(errors("emailId")),
     password: joi.string().trim().min(8).messages({'string.min': 'password should be minimum 8 characters'}).max(15).messages({'string.max': 'password should be maximum 15 characters'})
     .regex(/^\S{8,24}$/).messages(passwordResponse).required().messages(errors("Password"))
    }),
    updateUserModel: joi.object({
        title: joi.string().trim().regex(/^(Mr|Mrs|Miss)+$\b/).messages({'string.pattern.base': `Title should be among [Mr,Mrs,Miss]`}).messages(errors("Title")),
         name: joi.string().trim().regex(/^[A-Za-z ]+$/).messages({'string.pattern.base': `Plz enter a valid name.`}).messages(errors("Username")),
        phone: joi.string().trim().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits only.`}).messages(errors("Mobile number")),
        email: joi.string().trim().regex(/.+\@.+\..+/).messages({'string.pattern.base': `Plz enter a valid emailId`}).messages(errors("emailId")),
     password: joi.string().trim().min(8).messages({'string.min': 'password should be minimum 8 characters'}).max(15).messages({'string.max': 'password should be maximum 15 characters'})
     .regex(/^\S{8,24}$/).messages(passwordResponse).messages(errors("Password"))
    }),
     //LOGIN VALIDATION
     loginValidation: joi.object({
        email: joi.string().trim().regex(/.+\@.+\..+/).messages({'string.pattern.base': `emailId is in inValid format`}).required().messages(errors("emailId")),
     password: joi.string().trim().min(8).messages({'string.min': 'password should be minimum 8 characters'}).max(15).messages({'string.max': 'password should be maximum 15 characters'})
                  .regex(/^\S{8,24}$/).messages(passwordResponse).required().messages(errors("Password"))
              }),
    //SCHEMA VALIDATION FOR JOBPOST
  jobPostModel: joi.object({
        // userId: joi.objectId().required().messages(errors("UserId")),
         title: joi.string().trim().required().messages(errors("Title")),
   description: joi.string().trim().required().messages(errors("Description")),
         email: joi.string().trim().regex(/.+\@.+\..+/).messages({'string.pattern.base': `Plz enter a valid emailId`}).required().messages(errors("Email Id")),
         skill: joi.array().items(joi.string().trim()).messages(errors("Skill")),
    experience: joi.number().min(1).messages(errors({"number.base": `Experience should be a type of number.`,'number.min': 'Experience should be minimum 1 year'})),
  }),
  updateJobPostModel: joi.object({
      title: joi.string().trim().messages(errors("Title")),
description: joi.string().trim().messages(errors("Description")),
      email: joi.string().trim().regex(/.+\@.+\..+/).messages({'string.pattern.base': `Plz enter a valid emailId`}).messages(errors("Email Id")),
      skill: joi.array().items(joi.string().trim()).messages(errors("Skill")),
      experience: joi.number().min(1).messages(errors({"number.base": `Experience should be a type of number.`,'number.min': 'Experience should be minimum 1 year'}))
    })
}