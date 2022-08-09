const PRFModel = require('../models/PRFModel.js');

const initController ={
    getHome: function(req,res){
        if(req.session.email === undefined ){
            res.redirect("/login");
        }else{
            res.redirect("/Home");
        }
        
    },
    getLinks: function(req,res){
        res.render("links", {});
    },
    getHomepage: function(req, res){
        // var name = req.session.name;
        // res.render("pages/homepage", {name:name});

        res.redirect("/TaskTracker");
    },

    // sends the Session Details, aka current logged user
    getSessionDetails: function(req, res){
        var sessionDetails = req.session;
        res.send(sessionDetails);
    }
    ,

    getAllPRFInJSON: function (req,res){
        PRFModel.find({}, function(err, PRF){

            console.log(   JSON.parse  (JSON.stringify(PRF[0], null, " ")  ) )
        })

    }

    
    

}

module.exports = initController;