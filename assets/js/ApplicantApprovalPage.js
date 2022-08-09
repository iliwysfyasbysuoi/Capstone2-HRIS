/* 
    THIS  WILL ACCESS ARRAYS IN PERSONAL INFORMATION FORM
*/ 
$(window).load(function () {

    var applicationID = $(".applicationID").val();

    // initializes the modal UI
    $('.modal').modal();


    // changes badge color based on status
    badge_color();

    // in prog
    updateProgressBars();

    /**
     * cards that can be empty
     *  1. interview feedbacks
     *  2. approval progress information
     */
    showCardsThatAreNotEmpty();

    showNotice();
    // getApproversAndShowOnApprovals(); 

    // shows schedule interview form
    showScheduleInterviewForm();

    // shows evaluation button
    showEvaluateButton(); 

    // shows final approval button
    showSubmitFinalApproval();

    // show Employee Action Form Button
    showEmployeeActionFormButton();

    // show showConfirmApplicationButton()
    showConfirmApplicationButton();

    // showUpdatePreEmpReqs();



})

// M.toast({html: 'I am a toast!'})


// $('.pre-emp-input').change(function () {
//     alert();
// });

$(document).on("click", ".pre-emp-input", function () {
    
    // Materialize.toast(value, 1000);
    let param = $(this).attr("name");
    var value;
    var applicationID = $(".applicationID").val();

    if ($(this).is(":checked")) {
        value = true;
    } else {
        value = false
    }
    
    $.post('/updatePreEmploymentReqs', {param: param, value: value, applicationID: applicationID}, function(res, err){
        Materialize.toast(`Checklist saved! `, 1000);
        
        if(res.isAllTrue == true){
            $(".application_status").text("Pre-Employment Requirements Received");
            $(".application_status").removeClass("orange  darken-2");
            $(".application_status").addClass("teal");
            setTimeout(function(){Materialize.toast(`All pre-employment requirements are complete! Confirm application now.`, 3500)}, 500);
        }else{
            $(".application_status").text("Pre-Employment Requirements Pending");
            $(".application_status").addClass("orange  darken-2");
            $(".application_status").removeClass("teal");
        }


        updateProgressBars();
        showConfirmApplicationButton(); //conditions inside the function na
    })
})





$(document).on("click", ".toggle-approval-details", function () {
    if($('.approval-details').hasClass('d-none') == true){
        $('.approval-details').removeClass('d-none');
        $('.toggle-approval-details').text('see less details');
    }else{
        $('.approval-details').addClass('d-none');
        $('.toggle-approval-details').text('see more details');
    }

});

$(document).on("change", ".interviewer_input", function () {

    var _id = $('.interviewer_input').val();

    $('.ioi-buffer').addClass('d-none');
    $('.ioi-content').removeClass('d-none');
    $.get('/getUserPublicInfo/'+_id, function (user, err) {
        $(".ioi-name").text(`${user.firstName} ${user.lastName}`);
        $(".ioi-businessunit").text(`${user.businessUnit}`);
        $(".ioi-department").text(`${user.department}`);
        $(".ioi-position").text(`${user.position}`);
    });

});


/**
 * shows card divs if there is smth to show
 *      (1) interview feedbacks
 *      (2) approval progress information
 */
function showCardsThatAreNotEmpty(){
    var applicationID = $('.applicationID').val();
    $.get('/getApplicationData/'+applicationID, function (ApplicationData, err) {

        // shows interview feedbacks if there is at least 1
        if(ApplicationData.initialInterviewFeedback != null 
            || ApplicationData.functionalInterviewFeedback != null 
            || ApplicationData.finalInterviewFeedback != null ){
                $('#interview-feedback-info-div').removeClass('d-none');
        };

        
        //shows approvals progress information if there is smthing to show
        if(ApplicationData.approval1stInterview != null 
            || ApplicationData.approval2ndInterview != null 
            || ApplicationData.approval3rdInterview != null 
            || ApplicationData.approvalFinal != null ){

                $('#approvals-progress-div').removeClass("d-none");
                
        };



    });


}

/*
    shows Schedule Interview form if dapat.
*/
function showScheduleInterviewForm(){
    

    var applicationID = $(".applicationID").val();
    var approverHRPartnerPosition = $(".HRPartnerPosition").text();
    var applicationStatus = $(".application_status").text();

    $.get('/getSessionDetails', function (session, err) {

        var sessionPosition = session.position;
        var session_id = session._id;

        $.get('/getApplicationData/'+applicationID, function (ApplicationData, err) {

            // var approverHRPartnerPosition


            //removes the "see more details" toggle if no content
            if(ApplicationData.approval1stInterview != null 
                || ApplicationData.approval2ndInterview != null 
                || ApplicationData.approval3rdInterview != null 
                || ApplicationData.approvalFinal== null ){
                    $(".toggle-approval-details").removeClass('d-none');
                }
            
               
            // ** This is for scheduling of interview and showing the submit for final approval ** 
            //      if session user is the HR Partner assigned & the application status is "Pending"
            if(sessionPosition == approverHRPartnerPosition && applicationStatus == "Pending"){
               
                var interviewCount = 0;
                var interviewStageOptions = {};
                
                // counts number of interviews done/scheduled
                // used in the schedule form to know the stage of interview
                if(ApplicationData.approval1stInterview != null)
                    interviewCount++;
                if(ApplicationData.approval2ndInterview != null)
                    interviewCount++;
                if(ApplicationData.approval3rdInterview != null)
                    interviewCount++;

                // if not all 3 interviews are shows the button toggle for schedule interview form
                // schedule interview toggle will NOT SHOW is there is an "Interview Scheduled" 
               
                
                if(interviewCount < 3 
                    && ApplicationData.approval1stInterview != "Interview Scheduled"
                    && ApplicationData.approval2ndInterview != "Interview Scheduled"
                    && ApplicationData.approval3rdInterview != "Interview Scheduled"
                    && ApplicationData.approvalFinal == null
                    ){
                    $("#schedule_interview_toggle").removeClass('d-none');
                    
                    
                }

                if(ApplicationData.approvalFinal == null 
                    && ApplicationData.approval1stInterview != "Interview Scheduled"
                    && ApplicationData.approval2ndInterview != "Interview Scheduled" 
                    && ApplicationData.approval3rdInterview != "Interview Scheduled")
                    {
                        $("#for_final_approval_toggle").removeClass('d-none');
                    }

                
                

                // adds interview stage option of there isnt one yet
                if(ApplicationData.approval1stInterview == null)
                    interviewStageOptions["Initial Interview"] = "Initial Interview";
                if(ApplicationData.approval2ndInterview == null)
                    interviewStageOptions["Functional Interview"] = "Functional Interview";
                if(ApplicationData.approval3rdInterview == null)
                    interviewStageOptions["Final Interview"] = "Final Interview";

                
                var $el = $("#interview_stage");
                // $el.empty(); // remove old options
            
                // $el.append($("<option  disabled selected></option>").attr("value", "").text("Select Interview Stage"));
                $.each(interviewStageOptions, function(key,value) {
                    $el.append($("<option></option>")
                    .attr("value", value).text(key));
                });

                var requisitionID = ApplicationData.requisition_id;
                var interviewerOptions = {};
                $.get('/getPossibleInterviewerOptions/'+requisitionID, function (possibleInterviewers, err) {

                    possibleInterviewers.forEach(data => {
                        if(data._id == session_id){
                            interviewerOptions[`${data.firstName} ${data.lastName} (You) | ${data.position}`] = `${data._id}`;
                        }else{
                            interviewerOptions[`${data.firstName} ${data.lastName} | ${data.position}`] = `${data._id}`;
                        }
                    })

                    var $el = $("#interviewer_input");
                    // $el.empty(); // remove old options
                    // add default disabled option
                    // $el.append($("<option class='interviewer_input_options' disabled selected></option>").attr("value", null).text("Select Interviewer"));
                    $.each(interviewerOptions, function(key,value) {
                        $el.append($("<option class='interviewer_input_options'></option>")
                        .attr("value", value).text(key));
                    });

                })
            }
        });
        
        
    })
}

function showSubmitFinalApproval(){
    var applicationID = $(".applicationID").val();
    var approverHRPartnerPosition = $(".HRPartnerPosition").text();
    var applicationStatus = $(".application_status").text();

    $.get('/getSessionDetails', function (session, err) {

        var sessionPosition = session.position;
        var session_id = session._id;

        $.get('/getApplicationData/'+applicationID, function (ApplicationData, err) {
            if(session_id == ApplicationData.DHead_id && ApplicationData.approvalFinal == "Pending"){
                $('#final-approval-btn').removeClass('d-none');
            }
        });
    });
}


/* Update progress bar */
function updateProgressBars() {

    var approvedCount = 0, disapprovedCount = 0, pendingCount = 0, interviewCount = 0;
    var application_status = $('.application_status').text();

    let first = $('.initialInterview-status');
    let second = $('.functionalInterview-status');
    let third = $('.finalInterview-status');
    let final = $('.finalApproval-status');
    // let appStatus = $('.application_status.badge');

    // pushes all involved statuses in an array
    let handle = [];
    let appApprovalTotal =0;
    handle.push(first, second, third, final);

    handle.forEach(v =>{
        let status = v.text();
        switch(status){
            case "Pending":
                appApprovalTotal++;
                // pendingCount++;
                break;
            case "Approved": 
                appApprovalTotal++;
                approvedCount++;
                break;
            case "Disapproved":
                appApprovalTotal++;
                disapprovedCount++;
                break;
            case "Interview Scheduled":
                appApprovalTotal++;
                interviewCount++;
                break;
        }
    })


    if(application_status == "Approved"){
        $(".approved-bar").css({ 'width': "100%" });
        $('.approved-bar-label').text(approvedCount);
    }else if(application_status == "Disapproved" || application_status == "Employed" || application_status == "Transferred"){
        $(".approved-bar").css({ 'width': approvedCount * (100/appApprovalTotal) + "%" });
        $('.approved-bar-label').text(approvedCount);
        $(".disapproved-bar").css({ 'width': disapprovedCount * (100/appApprovalTotal) + "%" });
        $('.disapproved-bar-label').text(disapprovedCount);
        $(".pending-bar").css({ 'width': pendingCount * (100/appApprovalTotal) + "%" });
        $('.pending-bar-label').text(pendingCount);
        $(".interview-bar").css({ 'width': interviewCount * (100/appApprovalTotal) + "%" });
        $('.interview-bar-label').text(interviewCount);
    }else 
    if(disapprovedCount == 0){
        $(".approved-bar").css({ 'width': approvedCount * 25 + "%" });
        $('.approved-bar-label').text(approvedCount);
        $(".disapproved-bar").css({ 'width': disapprovedCount *25 + "%" });
        $('.disapproved-bar-label').text(disapprovedCount);
        $(".pending-bar").css({ 'width': pendingCount *25 + "%" });
        $('.pending-bar-label').text(pendingCount);
        $(".interview-bar").css({ 'width': interviewCount * 25 + "%" });
        $('.interview-bar-label').text(interviewCount);
    }else{
        $(".disapproved-bar").css({ 'width': 100 + "%" });
        $('.disapproved-bar-label').text(disapprovedCount);
    }

    /**
     * For Pre-employment requirements progress bar
     */


    var per_IDs = ["#background_investigation", "#job_offer_accepted" , "#pre_employment_forms" , "#pre_employment_medical"]
    var subCount = 0; notSubCount=0;


    for(i=0; i<per_IDs.length; i++){
        if($(per_IDs[i]).prop('checked') == true)
            subCount++;
        else
            notSubCount++;
    }

    // shows the Pre-Employment Requirements progress bar if
    var show_per_if = ["Pre-Employment Requirements Pending", "Employed", "Transferred"]
    

    if(show_per_if.includes(application_status) == true){
        // $("#pre-emp-reqs-progress-line").removeClass("d-none"); //add pre-emp progressbar
        // $("#approvals-progress-line").addClass("d-none"); //removes the approvals progress bar
    }

    $(".submitted-bar").css({ 'width': subCount * 25 + "%" });
    $('.submitted-bar-label').text(subCount);
    $(".not-submitted-bar").css({ 'width': notSubCount * 25 + "%" });
    $('.not-submitted-bar-label').text(notSubCount);




}

/**
 *  Shows approprate notice
 *      TODO
 *      [] if application status disapproved, note that the application is disapproved already
 *      [] if scheduled for initial, note that we wait for HR Partner
 *      [] if scheduled for function, note that we wait for Asst HR Manager
 *      [] if scheduled for final, note that we wait for DepHead
 *      [] if final interview was approved, note that BU head will approve the summary
 */
function showNotice() {

    var applicationID = $(".application_id").text()
    var application_status = $(".application_status").text()

    if (application_status == "Disapproved") {
        $(".buttons-card").prepend(
            `
            <div class=" center center-align" >
                <p class="center">This application has already been disapproved. </p>
            </div>
            `
        )
    }
    else if($(".approvalDepHead-status").text() == "Approved" && $(".approvalBUHead-status").text() == "Pending")
    {
        $(".buttons-card").prepend(
            `
            <div class=" center center-align" >
                <p class="center">Waiting for the final approval of the Business Unit Head. </p>
            </div>
            `
        )

    }else{

    }

   

}


/**
 * NEW TODO
 * 
 * this shows the Evaluate Button for the right person and statuses. (removes d-none class)
 * 
 * NEW TODO
 * [] get session
 * [] get application
 * [] evaluatiion will be shown IF
 *      there's a "Interview Scheduled"
 * 
 */
function showEvaluateButton(){

    var applicationID = $(".applicationID").val();
    var approverHRPartnerPosition = $(".HRPartnerPosition").text();
    var applicationStatus = $(".application_status").text();

    $.get('/getSessionDetails', function (session, err) {

        var sessionPosition = session.position;
        var session_id = session._id;

        $.get('/getApplicationData/'+applicationID, function (ApplicationData, err) {


            // function that shows update pre-employment requirements
            showUpdatePreEmpReqs(sessionPosition, ApplicationData.status);
            

            // show initial interview feedback form if initial interview is scheduled for interview and the interviewer is same as the session user
            if(ApplicationData.approval1stInterview == "Interview Scheduled" && session_id == ApplicationData.initialInterviewSchedule.interviewer._id){
                $('#evaluate_interview_btn').removeClass('d-none');
                $('#evaluate_interview_btn').text('Evaluate Initial Interview');
                
                // loads the Initial Interview Form on the modal with applicationID as the data
                $(".eval-modal-content").load('/form/InitialInterviewForm', {applicationID: applicationID});
            }

            // show fucntional interview feedback form if functional interview is scheduled for interview and the interviewer is same as the session user
            if(ApplicationData.approval2ndInterview == "Interview Scheduled" && session_id == ApplicationData.functionalInterviewSchedule.interviewer._id){
                $('#evaluate_interview_btn').removeClass('d-none');
                $('#evaluate_interview_btn').text('Evaluate Functional Interview');
                
                // loads the Functional Interview Form on the modal with applicationID as the data
                $(".eval-modal-content").load('/form/FunctionalInterviewForm', {applicationID: applicationID});
            }

            // show final interview feedback form if final interview is scheduled for interview and the interviewer is same as the session user
            if(ApplicationData.approval3rdInterview == "Interview Scheduled" && session_id == ApplicationData.finalInterviewSchedule.interviewer._id){
                $('#evaluate_interview_btn').removeClass('d-none');
                $('#evaluate_interview_btn').text('Evaluate Final Interview');
                
                // loads the final Interview Form on the modal with applicationID as the data
                $(".eval-modal-content").load('/form/FinalInterviewForm', {applicationID: applicationID});
            }

        });

    });

}



function showEmployeeActionFormButton(){

    $.get('/getSessionDetails', function (session, err) {
        var sessionPosition = session.position;
        var sessionDepartment = session.department;
        var applicationID = $(".applicationID").val();

        switch (sessionPosition) {
            case "HR Officer":
            case "HR Supervisor":
            case "HR Specialist" : 
                //for """HR Partners"""
                if ($(".application_status").text() == "Approved"){
                    
                    //shows the eaf modal toggle button
                    $('#eaf-btn-group').removeClass("d-none");
                    
                    

                    var data = {
                        name : `${$(".firstName").text()} ${$(".lastName").text()}`,
                        department : `${$('.department').text()}`,
                        position : `${$('.position').text()}`,
                        businessUnit : `${$('.businessUnit').text()}`
                    }
                    
                    // loads the Initial Interview Form on the modal with applicationID as the data
                    $(".EAF-modal-content").load('/FormOnly/EmployeeActionForm', {applicationID: applicationID, data: data}, function(){
                        
                        $.get("/getEAFNumberOfRecords", function(EAFNumberOfRecords, result){
                            
                                
                            $.get("/getApplicantInfoOnly/"+applicationID,  function(applicantData, result){
                                $.get('/getApplicationData/'+applicationID, function (ApplicationData, err) {

                                    var applicantUserType = applicantData.userType;
                                    var requisitionID = ApplicationData.requisition_id;

                                    console.log(applicantData);

                                    $.get("/getPRFData/"+requisitionID,  function(PRFData, result){

                                        var formID = parseInt(EAFNumberOfRecords);
                                        var employeeName = `${applicantData.firstName} ${applicantData.lastName}`;
                                        var department = `${PRFData.department}`;
                                        var position = `${PRFData.positionTitle}`;
                                        var businessUnit = `${PRFData.businessUnit}`;

                                        var old_department = applicantData.department;
                                        var old_position = applicantData.position;
                                        var old_businessUnit = applicantData.businessUnit;

                                        $('.eaf-title-for-modal').html(`
                                            <div class="card-title center-align">
                                                Employee Action Form
                                            </div>
                                        `);

                                        

                                        $('.formID').text(formID);
                                        $('.employeeName').val(employeeName);
                                        $('.employeePosition').val(position);
                                        $('.employeeBusinessUnit').val(businessUnit);
                                        $('.employeeDepartment').val(department); 
                                        
                                        $("#employee_action_form").append(
                                            `
                                                <input type="text" name="applicationID" value="${$('.applicationID').val()}" hidden>
                                            `
                                        )

                                        if(applicantUserType == "Applicant"){
                                            /**
                                             * if applicant, choose confirm regular employment
                                             * disable other radios
                                             * bec external recruitment siya
                                             */
                                            $("#confirm_hiring").prop("checked", true);
                                            $("#Secondment").prop("disabled", true);
                                            $("#transfer").prop("disabled", true);
                                            $("#termination").prop("disabled", true);

                                        }else{
                                            /**
                                             * else if not applicant, choose transfer then automatically place inputs. 
                                             * disable other radios
                                             * bec internal recruitmen siya
                                             * 
                                             */
                                            $("#transfer").prop("checked", true);
                                            $("#confirm_hiring").prop("disabled", true);
                                            $("#termination").prop("disabled", true);
                                            $("#Secondment").prop("disabled", true);
                                            
                                            //  place input feilds for from and to
                                            $(".otherInput").html(`
                                                <div class="form-group col s2"></div>
                                                <div class="table-responsive table-bordered  col s12">
                                                    <table class="table highlight">
                                                    <thead>
                                                        <tr>
                                                            <th ></th>
                                                            <th c>From</th>
                                                            <th >To</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <th>Department</th>
                                                            <td><input id="transfer_old_department" class="validate" placeholder=""type="text" name="transfer_old_department" required></td>
                                                            <td><input id="transfer_new_department" class="validate" placeholder=""type="text" name="transfer_new_department" required></td>
                                                        </tr>
                                                        <tr>
                                                            <th>Position Title</th>
                                                            <td><input id="transfer_old_position" class="validate" placeholder=""type="text" name="transfer_old_position" required></td>
                                                            <td><input id="transfer_new_position" class="validate" placeholder=""type="text" name="transfer_new_position" required></td>
                                                        </tr>
                                                    </tbody>
                                                    </table>
                                            </div>
                                            `)

                                            $("#transfer_old_department").val(old_department);
                                            $("#transfer_new_department").val(department);

                                            $("#transfer_old_position").val(old_position);
                                            $("#transfer_new_position").val(position);

                                        }
                                    });

                                });
                            })
                        })
                    });
                    
                }
                break;

        }
    })

}

function showUpdatePreEmpReqs(HRPosition, status){

    var applicationID = $(".applicationID").val();
    var approverHRPartnerPosition = $(".HRPartnerPosition").text();
    var applicationStatus = $(".application_status").text();

    if(HRPosition == approverHRPartnerPosition && applicationStatus == "Pre-Employment Requirements Pending"){
        $("#pre-emp-modal-toggle").removeClass("d-none");
    }



}

function showConfirmApplicationButton(){

    var per_IDs = ["#background_investigation", "#job_offer_accepted" , "#pre_employment_forms" , "#pre_employment_medical"]
    var subCount = 0; notSubCount=0;
    var status = $('.application_status').text();

    for(i=0; i<per_IDs.length; i++){
        if($(per_IDs[i]).prop('checked') == true)
            subCount++;
        else
            notSubCount++;
    }

    if(subCount == per_IDs.length && status == "Pre-Employment Requirements Received"){
        $("#complete_application").removeClass("d-none");
    }else{
        $("#complete_application").addClass("d-none");
    }
}

/**
 * changes the badge color based on the status
 * statuses involved: 1st interview, 2nd interview, 3rd interview, final approval, and status of application
 */
function badge_color(){

    let first = $('.initialInterview-status');
    let second = $('.functionalInterview-status');
    let third = $('.finalInterview-status');
    let final = $('.finalApproval-status');
    let appStatus = $('.application_status.badge');

    // pushes all involved statuses in an array
    let handle = [];
    handle.push(first, second, third, final, appStatus);

    // for each status handle in the array, get the text (status) then addClass to change the color
    handle.forEach(v =>{
        let status = v.text();
        switch(status){
            case "Pending":
                v.addClass("grey  white-text");
                break;
            case "Approved": 
                v.addClass("teal white-text");
                break;
            case "Disapproved":
                v.addClass("red white-text");
                break;
            case "Interview Scheduled":
                v.addClass("blue white-text");
                break;
            case "Employed":
                v.addClass("green white-text");
                break;
            case "Transferred": 
                v.addClass("green white-text");
                break;
            case "Seconded":
                v.addClass("green white-text");
                break;
            case "Pre-Employment Requirements Pending":
                v.addClass("orange white-text darken-2");
                break;
            case "Pre-Employment Requirements Received":
            v.addClass("teal white-text");
            break;

        }
    })



}

