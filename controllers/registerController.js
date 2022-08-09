const bcrypt = require('bcryptjs');
const { ObjectId } = require('bson');
const salt = 10;
const userModel = require('../models/userModel.js');

const registerController = {

    getRegister: function (req, res) {
        res.render("pages/register", {});
    },

    postRegister: function (req, res) {

        var firstName = req.body.first_name;
        var middleName = req.body.middle_name;
        var lastName = req.body.last_name;
        var nickName = req.body.nick_name;
        var email = req.body.email;
        var password = req.body.password;

        // checks if email is already registered.
        userModel.findOne({ $or: [{ email: email }, { personalEmail: email }] }, function (err, existingUser) {
            // if email is already registered, send error.
            if (existingUser != null) {

                res.render("pages/register", { err: "Email is already registered!" });
            }
            // else, encypt password and save User object.
            else {

                bcrypt.hash(password, salt, function (err, hash) {

                    user = new userModel({
                        _id: new ObjectId(),
                        personalEmail: email,
                        password: hash,

                        firstName: firstName,
                        middleName: middleName,
                        lastName: lastName,
                        nickName: nickName,

                        userType: "Applicant",
                        position: "None",
                        department: "None",
                        businessUnit: "None"

                    });

                    console.log(user);
                    user.save();

                    res.redirect('/login');

                })
            }
        })




    }






}

module.exports = registerController;