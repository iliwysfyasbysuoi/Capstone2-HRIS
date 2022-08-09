
$(window).load(function () {

    var applicationID = $(".EAF_id").val();
    var name = document.getElementById("employeeName").value

    $.get('/getSessionDetails', function (session, err) {
        console.log(session.name === name)
        if (session.name === name) {
            $('.approvalCard').remove()
        }
    })

    if ($(".EAF_status").text() === "Pending") {
        updateRelevantInformationShown();
        showApprovalButton();
    }
})


function updateRelevantInformationShown() {
    var action = $(".recommendedAction").text();
    var applicationID = $(".applicationID").val();

    if (action == "Confirm Regular Employment") {
        $("#programRequirements").remove();
        $(".terminationReason-label").remove();
        $(".terminationReason").remove();
        $(".hireDate-label").remove();
        $(".hireDate").remove();
        $(".positionMonths-label").remove();
        $(".positionMonths").remove();

        if ($(".EAF_status").text() == "Approved") {
            $("#other_buttons_div").html(
                `
                <a href = "/ApplicantApproval/${applicationID}" class = "btn">Go To the Application Page</a>
                `

            )

        }



    }

}

function showApprovalButton() {

    $.get('/getSessionDetails', function (session, err) {

        var sessionPosition = session.position;
        var session_id = session._id;
        var action = $(".recommendedAction").text();
        var EAF_id = $(".EAF_id").val();


        var approvalButtonsHTML =
            `
                
                    <center>
                    <form method = "post" action="/approve_EAF" class ="col s6">
                        <input type="text" value="${EAF_id}" name="EAF_id" hidden>
                        <input type="text" value="${sessionPosition}" name="sessionPosition" hidden>
                        <input type="text" value="${action}" name="action" hidden>
                        <button type="submit" class="approve_btn btn">Approve</button>
                    </form>
                    <br>
                    <form method = "post" action="/disapprove_EAF" class ="col s6">
                        <input type="text" value="${EAF_id}" name="EAF_id" hidden>
                        <input type="text" value="${sessionPosition}" name="sessionPosition" hidden>
                        <input type="text" value="${action}" name="action" hidden>
                        <button type="submit" class="disapprove_btn btn">Disapprove</button>
                    </form>
                    </center>
                        
                
                `

        if (sessionPosition == "HR Supervisor" && $(".approvalhrSupervisor-status").text() == "Pending") {
            $("#approval_buttons_div").html(approvalButtonsHTML);
        }
        else if (sessionPosition == "Department Head" && $(".approvalDHead-status").text() == "Pending") {
            $("#approval_buttons_div").html(approvalButtonsHTML);
        }
        else if (sessionPosition == "Business Unit Head" && $(".approvalBUHead-status").text() == "Pending") {
            $("#approval_buttons_div").html(approvalButtonsHTML);
        }
        else if (sessionPosition == "Department Director" && $(".approvalCHROD-status").text() == "Pending") {
            $("#approval_buttons_div").html(approvalButtonsHTML);
        }
    })


}