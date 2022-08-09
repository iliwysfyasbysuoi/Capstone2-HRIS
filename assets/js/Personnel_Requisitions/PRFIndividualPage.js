$(window).load(function () {

    var requisitionID = Number($(".requisitionID").text());
    // initializes modal
    $('.modal').modal();

    $.post('/DoINeedToApprove', { requisitionID: requisitionID }, function (DoI, err) {

        if (DoI == "show") {
            $(".buttons-card").html(
                `
                <div class="approvalButtons center"  >
                    <p class="approvalTitle center " >
                        Approval
                    </p>
                    <a href="/approvePRF/${requisitionID}"
                        class="waves-effect waves-light btn teal " id="approveBtn" .
                        style="width: 100%; ">
                        Approve
                    </a>
                    <br><br>
                    <a href="#disapproveModal"
                        class="waves-effect waves-light btn red " id="disapproveBtn"
                        style="width: 100%; ">
                        Disapprove
                    </a>
                </div>
                `
            )

            // <a href="/disapprovePRF/${requisitionID}"
            //     class="waves-effect waves-light btn btn-danger " id="disapproveBtn"
            //     style="width: 100%; ">
            //     Disapprove
            // </a>
        }
    })

    updateProgressBars();
    badge_color()

    showNoticeIfDisapproved();
    showListingButtonsIfFullyApproved();
    showLinkToListingForOpenPRFs();
});

function showListingButtonsIfFullyApproved() {
    var requisitionID = Number($(".requisitionID").text());

    if ($(".PRFStatus").text() == "Approved"  ) {
        $.get('/getSessionDetails', function (session, err) {

            if (session.position == "HR Officer" || session.position == "HR Specialist" ||
            session.position == "HR Supervisor"  ) {
    
                $(".buttons-card").html(
                    `
                    <div class="listingButtonArea center center-align" >
                        <p class="center">This PRF is fully approved and is ready for
                            listing. </p>
                        <a href="/listJobVacancy/${requisitionID}"
                            class="waves-effect waves-light btn btn-info " id="listJobVacancyBtn"
                            style="width: 100%; margin-left: auto;">
                            List Job Vacancy
                        </a>
                    </div>
                    `
                )
            }else{
                $(".buttons-card").html(
                    `
                    <div class="listingButtonArea center center-align" >
                        <p class="center">This PRF is fully approved and is ready for
                            listing by the HR Partner. </p>
                    </div>
                    `
                )
            }
        })
    } 
}

function updateProgressBars() {
    var approvedCount = 0, disapprovedCount = 0, pendingCount = 0;

    if ($(".approvalHRPartner-status").text() == "Approved") {
        approvedCount++;
    } else if ($(".approvalHRPartner-status").text() == "Disapproved") {
        disapprovedCount++;
    } else {
        pendingCount++;
    }
    
    if ($(".approvalDHead-status").text() == "Approved") {
        approvedCount++;
    } else if ($(".approvalDHead-status").text() == "Disapproved") {
        disapprovedCount++;
    } else {
        pendingCount++;
    }

    if ($(".approvalBUHead-status").text() == "Approved") {
        approvedCount++;
    } else if ($(".approvalBUHead-status").text() == "Disapproved") {
        disapprovedCount++;
    } else {
        pendingCount++;
    }

    if ($(".approvalCHRODDirector-status").text() == "Approved") {
        approvedCount++;
    } else if ($(".approvalCHRODDirector-status").text() == "Disapproved") {
        disapprovedCount++;
    } else {
        pendingCount++;
    }

    if ($(".approvalCHRODHead-status").text() == "Approved") {
        approvedCount++;
    } else if ($(".approvalCHRODHead-status").text() == "Disapproved") {
        disapprovedCount++;
    } else {
        pendingCount++;
    }

    $(".approved-bar").css({ 'width': approvedCount * 20 + "%" });
    $('.approved-bar-label').text(approvedCount);
    $(".disapproved-bar").css({ 'width': disapprovedCount * 20 + "%" });
    $('.disapproved-bar-label').text(disapprovedCount);
    $(".pending-bar").css({ 'width': pendingCount * 20 + "%" });
    $('.pending-bar-label').text(pendingCount);
}

function showLinkToListingForOpenPRFs() {
    var requisitionID = $(".requisitionID").text();
    var status = $(".PRFStatus").text();

    if (status == "Open") {
        $(".buttons-card").html(
            `
            <div class="goToJobListingButtonArea center center-align" >
                <p class="center">The Job Position is now open. </p>
                <a href="/JobDetails/${requisitionID}"
                    class="waves-effect waves-light btn btn-info " id="jobListingPageBtn"
                    style="width: 90%; margin-left: auto; font-size: smaller">
                    Job Listing Page
                </a>
            </div>
            `
        )
    }
}

function showNoticeIfDisapproved() {
    var requisitionID = $(".requisitionID").text();
    var status = $(".PRFStatus").text();

    if (status == "Disapproved") {
        $(".buttons-card").html(
            `
            <div class="goToJobListingButtonArea center center-align" >
                <p class="center">This request has already been disapproved. </p>
            </div>
            `
        )

    }
}

$(document).on("click", ".toggle-approval-details", function () {
    if($('.approval-details').hasClass('d-none') == true){
        $('.approval-details').removeClass('d-none');
        $('.toggle-approval-details').text('see less details');
    }else{
        $('.approval-details').addClass('d-none');
        $('.toggle-approval-details').text('see more details');
    }

});

/**
 * changes the badge color based on the status
 * statuses involved: 1st interview, 2nd interview, 3rd interview, final approval, and status of application
 */
 function badge_color(){

    let approvalDHead = $('.approvalDHead-status.badge');
    let approvalHRPartner = $('.approvalHRPartner-status.badge');
    let approvalBUHead = $('.approvalBUHead-status.badge');
    let approvalCHRODDirector = $('.approvalCHRODDirector-status.badge');
    let approvalCHRODHead = $('.approvalCHRODHead-status.badge');
    let PRFStatus = $('.PRFStatus.badge');


    // pushes all involved statuses in an array
    let handle = [];
    handle.push(approvalDHead, approvalHRPartner, approvalBUHead, approvalCHRODDirector, approvalCHRODHead,PRFStatus);

    // for each status handle in the array, get the text (status) then addClass to change the color
    handle.forEach(v =>{
        let status = v.text();
        switch(status){
            case "Pending":
                v.addClass("grey white-text");
                break;
            case "Approved": 
                v.addClass("teal white-text");
                break;
            case "Disapproved":
                v.addClass("red white-text");
                break;
            case "For Approval":
                v.addClass("grey white-text");
                break;
            case "Closed":
                v.addClass("grey white-text");
                break;
            case "Open":
                v.addClass("green white-text");
                break;
        }
    })



}