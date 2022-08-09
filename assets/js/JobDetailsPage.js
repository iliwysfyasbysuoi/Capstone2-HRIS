

$(window).load(function () {
    // functions on load if meron

    // initializes the modal UI
    $('.modal').modal();

    $.get('/getSessionDetails', function (session, err) {

        if(session.position == undefined){
            $('.card_footer_for_buttons').html(`
            
            <b>Please <a href="/login">login</a> or <a href="/register">register</a> first to be able to submit an application.</b>
            
            `)
        }
    });
});


$(document).on("click", ".applyBtn", function () {

    var requisitionID = $(".requisitionID").text();
   
    $.post("/ApplyForJob", {requisitionID: requisitionID} , function(data, result){
       
        console.log(data);

        if(data == "No Personal Information"){
            $(".modal-header").text("No personal information.");
            $(".modal-text").text("Personal Information is required for the application process. Please submit your Personal Information first.");
            
            $(".additional_btns").html(
                `
                    <a href="/form/PersonalInformationForm" class="modal-close waves-effect waves-green btn-flat">Go to Personal Information Form</a>
                `
            )
        }else if(data == "Successfully Applied"){
            $(".modal-header").text("Successfully applied.");
            $(".modal-text").text("Thank you for applying! Make sure to keep notified on you schedule interviews.");
            
            $(".additional_btns").html(
                `
                    
                `
            )
        }else if(data.resData == "Already Applied"){
            $(".modal-header").text("Already applied.");
            $(".modal-text").text("It seems like you already applied for this job.");
            
            $(".additional_btns").html(
                `
                <a href="/ApplicantApproval/${data.applicationID}" class=" waves-effect waves-green btn-flat">View Your Application</a>

                `
            )
        }else if(data == "Show Final Step"){
            $(".modal-header").text("Almost there!");
            $(".modal-text").html(
                `
                Please indicate where you heard this opening.
                <input type="string" class="opening_apply" name="opening_apply">
                <span class="opening_apply_err"> </span>
                `
                );
            
            $(".additional_btns").html(
                `
                <a href="#" class="submitApplicationBtn waves-effect waves-green btn-flat">Submit</a>
                `
            )
        }

    })


})

$(document).on("click", ".submitApplicationBtn", function () {
    var requisitionID = $(".requisitionID").text();
    var opening_apply = $(".opening_apply").val();


    if (opening_apply == ""){
        // alert("empty");
        $(".opening_apply").css("border-color",  "red");
        $(".opening_apply_err").text("This is required.");
    }else{
        $.post("/SubmitApplication", {opening_apply: opening_apply, requisitionID: requisitionID}, function (data, result){

            if(data = "Successfully Applied"){
                $(".modal-header").text("Successfully Applied!");
                $(".modal-text").html(
                    `
                    Thank you for applying! Make sure to keep notified on you schedule interviews.
                    `
                    );
                $(".submitApplicationBtn").remove();

                location.reload();
                
            }

        })

    }

})

