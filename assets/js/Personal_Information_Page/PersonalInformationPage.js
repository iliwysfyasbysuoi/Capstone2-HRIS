$(window).load(function(){
    // initializes the modal UI
    $('.modal').modal();
})


$(document).on("click", ".confirm-delete-btn", function () {

    $.get("/deletePersonalInformation", function(data, result){


        if(data == "Delete successful"){
            let secondsTilRefresh = 4; //sets the interval until refresh in seconds

            $(".confirm-delete-modal-content").html(`
                    <p>Personal Information record succesfully deleted!</p>
                    <p>You will be redirected to the Personal Information Form page in <span class="modal-countdown">${secondsTilRefresh}</span>.</p>
            `);
            $(".modal-footer").hide();

            setTimeout(function(){
                window.location = "/form/PersonalInformationForm"
            }, 1000 * secondsTilRefresh); 

            setInterval(function(){
                let num = parseInt($(".modal-countdown").text());
                num--;
                $(".modal-countdown").text(num);
            }, 1000); 

        }else if(data == "No record found"){

        }
    })


})