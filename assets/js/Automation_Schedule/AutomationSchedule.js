$(window).load(function () {


    $(document).on("click", ".toggle-information", function () {

        var isHidden = $(this).parent().parent().parent().find(".job-description").hasClass("d-none");

        if (isHidden == true) {
            $(this).parent().parent().parent().find(".job-description").removeClass("d-none");
        } else {
            $(this).parent().parent().parent().find(".job-description").addClass("d-none");
        }
    })

    $(document).on("click", ".edit-btn", function () {

        //removes readonly attr for the input
        $(this).parent().parent().parent().find(".job-schedule-input").attr("readonly", false);

        $(this).addClass("d-none");
        $(this).parent().find(".save-btn").removeClass("d-none");
        $(this).parent().find(".cancel-btn").removeClass("d-none");
    })

    $(document).on("click", ".save-btn", async function () {

        
        const afterUpdate = ()=>{
            // on success, do this
            //adds readonly attr for the input
            $(this).parent().parent().parent().find(".job-schedule-input").attr("readonly", true);
            $(this).parent().parent().parent().find(".original-schedule").val(schedule);

            $(this).addClass("d-none");
            $(this).parent().find(".edit-btn").removeClass("d-none");
            $(this).parent().find(".cancel-btn").addClass("d-none");
        }

        var scheduleID = $(this).parent().parent().parent().find(".job-schedule-id").val();
        var schedule = $(this).parent().parent().parent().find(".job-schedule-input").val();
        $.post("/AutomationSchedule/UpdateSchedule", {scheduleID: scheduleID, schedule: schedule}, function(data){
            afterUpdate();
        })

        






    })

    $(document).on("click", ".cancel-btn", function () {

        /**
         * input code to cancel here
         * 
         */

        var originalSchedule = $(this).parent().parent().parent().find(".original-schedule").val();
        $(this).parent().parent().parent().find(".job-schedule-input").val(originalSchedule);

        // on success, do this

        //adds readonly attr for the input
        $(this).parent().parent().parent().find(".job-schedule-input").attr("readonly", true);
        $(this).addClass("d-none");
        $(this).parent().find(".edit-btn").removeClass("d-none");
        $(this).parent().find(".save-btn").addClass("d-none");


    })







})