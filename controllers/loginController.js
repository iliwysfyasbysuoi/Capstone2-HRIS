const { ObjectId } = require('bson');
const bcrypt = require('bcryptjs');
const salt = 10;
const userModel = require('../models/userModel.js');
const skillSetupModel = require('../models/skillSetupModel.js');
const notificationModel = require('../models/notificationModel.js');

const startOfDay = () => {
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
}

const loginController = {
    getLogin: function (req, res) {
        res.render("pages/login", {});
    },

    postLogin: function (req, res) {
        var email = req.body.email;
        var password = req.body.password;

        console.log("EMAIL:" + email);
        console.log("password: " + password);


        userModel.findOne({ $or: [{ email: email }, { personalEmail: email }] }, function (err, result) {
            console.log(result);
            // if email exists
            if (result != null) {
                bcrypt.compare(password, result.password, function (err, equal) {

                    // if correct password
                    if (equal) {
                        // set the session details
                        req.session.email = result.email;
                        req.session._id = result._id;
                        req.session.businessUnit = result.businessUnit;
                        req.session.department = result.department;
                        req.session.position = result.position;
                        req.session.name = result.firstName + " " + result.lastName;
                        req.session.userType = result.userType;
                        
                        if(req.session.userType == "Applicant"){
                            res.redirect("/JobListing"); //success, then redirects to home
                        }else{
                            res.redirect("/"); //success, then redirects to home
                        }
                    }
                    else { // wrong password
                        res.render("pages/login", { err: "Email and password does not match." });
                    }
                })

            } else {
                res.render("pages/login", { err: "Email is not registered." });
            }
        });

    },

    getLogout: function (req, res) {

        //destroys current session
        req.session.destroy(function (err) {
            if (err) throw err;
            /*
                redirects the client to `/profile` using HTTP GET,
                defined in `../routes/routes.js`
            */
            res.redirect('/login');
        });

    }
}

module.exports = loginController;