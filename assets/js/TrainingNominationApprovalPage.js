$(window).load(function () {
	// initializes the modal UI
	$(".modal").modal();

	var trainingID = Number($(".trainingID").text());

	$.post(
		"/DoINeedToApproveTNF",
		{ trainingID: trainingID },
		function (DoI, err) {
			if (DoI == "show") {
				$(".buttons-card").html(
					`
                <div class="approvalButtons center"  >
                    <p class="approvalTitle center " >
                        Approval
                    </p>
                    <a href="/ApproveTNF/${trainingID}"
                        class="waves-effect waves-light btn btn-success " id="approveBtn">
                        Approve
                    </a>
                    <a href="#disapproveModal"
                        class="modal-trigger waves-effect waves-light btn btn-danger " id="disapproveBtn">
                        Disapprove
                    </a>
                </div>
                `
				);

				$(".modal-text").html(
					`
                <input type="text" name="trainingID" id="trainingID" class="trainingID" value="${trainingID}">
                <textArea type="text" name="disapproveReason" id="disapproveReason" class="disapproveReason materialize-textarea" ></textarea>
                `
				);

				// <a href="/DisapproveTNF/${trainingID}"
				//             class="waves-effect waves-light btn btn-danger " id="disapproveBtn">
				//             Disapprove
				//         </a>
			}
		}
	);

	updateProgressBars();

	showNoticeIfDisapproved();
});

function updateProgressBars() {
	var approvedCount = 0,
		disapprovedCount = 0,
		pendingCount = 0;

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

	$(".approved-bar").css({ width: approvedCount * 34 + "%" });
	$(".approved-bar-label").text(approvedCount);
	$(".disapproved-bar").css({ width: disapprovedCount * 33 + "%" });
	$(".disapproved-bar-label").text(disapprovedCount);
	$(".pending-bar").css({ width: pendingCount * 33 + "%" });
	$(".pending-bar-label").text(pendingCount);
}

function showNoticeIfDisapproved() {
	var trainingID = $(".trainingID").text();
	var status = $(".TNFStatus").text();

	if (status == "Disapproved") {
		$(".approved-bar").css({ width: "0%" });
		$(".disapproved-bar").css({ width: "100%" });
		$(".pending-bar").css({ width: "0%" });

		$(".buttons-card").html(
			`
            <div class="center center-align" >
                <p class="center">This request has already been disapproved. </p>
            </div>
            `
		);
		$(".approvalsidebar").remove();
	}
}

// test
// $(document).on("click", "#update_button_performance_goal_cycle", function () {
// 	if ($(`#update_date_in_performance_goal_cycle`).val()) {
// 		// console.log($(`.trainingID`).text());
// 		const trainingID = $(`.trainingID`).text();
// 		const updatedDate = new Date(Date.now());
// 		$.post("/update_date", { trainingID, updatedDate }, function (res, err) {
// 			if (err != "success") return console.log(err);
// 			console.log(res);
// 		});
// 		console.log(trainingID);
// 		console.log(updatedDate);
// 	} else {
// 		alert("no date");
// 	}
// });
// end test
