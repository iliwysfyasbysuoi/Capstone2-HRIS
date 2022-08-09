const { ObjectId } = require('bson');
const PRFModel = require('../models/PRFModel.js');
const applicationsModel = require('../models/applicationsModel.js');
const personalInformationsModel = require('../models/personalInformationsModel.js');
const { Result } = require('express-validator');

const MyJobApplicationsController ={
    getMyJobApplicationsPage: function(req,res){
        var user_id = req.session._id;
        var requisitions = [];

        applicationsModel.find({ "user._id": ObjectId(req.session._id)}, function (err, applicationResult) {
            console.log ("original applicationResult: " + applicationResult );
        

            applicationResult.map(result => {
                PRFModel.findOne({requisitionID: result.requisition_id}, function(err, requisitionData){

                    result.requisition = requisitionData;

                    return result;
                })
            });

            // res.send({MyApplications:applicationResult});


            res.render("pages/MyJobApplicationsPage",
                {
                    MyApplications: applicationResult
                }
            );


        })
        
    }

    
    

}

module.exports = MyJobApplicationsController;