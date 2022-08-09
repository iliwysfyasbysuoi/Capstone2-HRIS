

const ProfileController ={
    getProfile: function(req,res){

        var User = "user data object here";
        var PersonalInformation = "personal information object here";

        res.render("pages/ProfilePage", {
            User: User,
            PersonalInformation: PersonalInformation
        });
    }


}

module.exports = ProfileController;