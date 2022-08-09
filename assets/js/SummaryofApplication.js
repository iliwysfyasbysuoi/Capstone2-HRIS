/*
    COPY FROM PRFINDIVIDUAL PAGE
$(window).load(function () {

    var requisitionID = Number($(".requisitionID").text());

    $.post('/DoINeedToApprove', { requisitionID: requisitionID }, function (DoI, err) {

        if (DoI == "show") {
            $(".buttons-card").html(
                `
                <div class="approvalButtons center"  >
                    <p class="approvalTitle center " >
                        Approval
                    </p>
                    <a href="/approvePRF/${requisitionID}"
                        class="waves-effect waves-light btn btn-success " id="approveBtn" .
                        style="width: 40%; margin-left: 10%">
                        Approve
                    </a>
                    <a href="/disapprovePRF/${requisitionID}"
                        class="waves-effect waves-light btn btn-danger " id="disapproveBtn"
                        style="width: 40%; ">
                        Disapprove
                    </a>
                </div>
         
                `
            )
        }
    })

    updateProgressBars();

    showNoticeIfDisapproved();


});
*/


function updateProgressBars() {

    var approvedCount = 0, disapprovedCount = 0, pendingCount = 0;

    if ($(".approvalBUHead-status").text() == "Approved") {
        approvedCount++;
    } else if ($(".approvalBUHead-status").text() == "Disapproved") {
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

function showNoticeIfDisapproved() {

    /*
    var requisitionID = $(".requisitionID").text();
    var status = $(".PRFStatus").text();
    

    if (status == "Disapproved") {
        $(".buttons-card").html(
            `
            <div class="goToJobListingButtonArea center center-align" >
                <p class="center">This application has already been disapproved. </p>
            </div>
            `
        )

    }
    */
   

}


