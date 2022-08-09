function notificationTemplate(seen, id, refID, control, description, date) {
	if (!seen) isSeenClass = "notificationAlert";
	else isSeenClass = "notificationSeen";
	$("#notificationsDropdown").append(
		`
                  <li class="notification " notificationID = "${id}" >
                  
                      <a class="" href="/${
												refID ? `${control}/${refID}` : control
											}">
                      <span class="${isSeenClass}"> • </span>
                              <div style="height:100%;">
                                  ${description}
                                  <span class="pull-right text-muted small ">${date}</span>
                              </div>
                      </a>
                  </li>
                  <li class="divider"></li>
              `
	);
}

function list_out_notifs(notifs) {
	for (i = notifs.length - 1; i >= 0; i--) {
		const notif = notifs[i].isCompleted ? notifs[i]._doc : notifs[i];
		// console.log(notif);
		//if at least 1 notif is not yet seen, alertBell is color is green

		// converts date to string
		var notifDate = new Date(notif.date).toLocaleString();
		var isSeenClass;

		if (!notif.isSeen) {
			$("#notifBell").css("color", "#286132");
			$("#notifBell").removeClass("fa-bell-o");
			$("#notifBell").addClass("fa-bell");
		}

		switch (notif.referenceType) {
			case "exitsurvey":
				if (notif.isSeen == false) {
					isSeenClass = "notificationAlert";
				} else isSeenClass = "notificationSeen";

				$("#notificationsDropdown").append(
					`
                                <li class="notification " notificationID = "${notif._id}" >
    
                                    <a class="" href="/ExitSurveyTracker/${notif.reference._id}">
                                    <span class="${isSeenClass}"> • </span>
                                            <div style="height:100%;">
                                                ${notif.description}
                                                <span class="pull-right text-muted small ">${notifDate}</span>
                                            </div>
                                    </a>
                                </li>
                                <li class="divider"></li>
                                `
				);
				break;
			case "Termination":
				if (notif.isSeen == false) {
					isSeenClass = "notificationAlert";
				} else isSeenClass = "notificationSeen";
				var redirect;
				if (notif.receiver.position === "HR Supervisor") {
					redirect = `<a class="" href="/EmployeeActionApproval/${notif.reference._id}">`;
				} else {
					redirect = `<a class="" href="/">`;
				}
				$("#notificationsDropdown").append(
					`
                <li class="notification " notificationID = "${notif._id}" >
                                        ${redirect}
                                        <span class="${isSeenClass}"> • </span>
                                                <div style="height:100%;">
                                                    ${notif.description}
                                                    <span class="pull-right text-muted small ">${notifDate}</span>
                                                </div>
                                    </li>
                                    <li class="divider"></li>
                                    `
				);
				break;
			case "Termination Approved":
				if (notif.isSeen == false) {
					isSeenClass = "notificationAlert";
				} else isSeenClass = "notificationSeen";

				$("#notificationsDropdown").append(
					`
                                      <li class="notification " notificationID = "${notif._id}" >
    
                                          <a class="" href="/EmployeeActionApproval/${notif.reference._id}">
                                          <span class="${isSeenClass}"> • </span>
                                                  <div style="height:100%;">
                                                      ${notif.description}
                                                      <span class="pull-right text-muted small ">${notifDate}</span>
                                                  </div>
                                          </a>
                                      </li>
                                      <li class="divider"></li>
                                      `
				);
				break;
			case "ExitSurveyForm":
				if (notif.isSeen == false) {
					isSeenClass = "notificationAlert";
				} else isSeenClass = "notificationSeen";

				$("#notificationsDropdown").append(
					`
                                    <li class="notification " notificationID = "${notif._id}" >
    
                                        <a class="" href="/EmployeeExitSurveyForm/${notif.reference._id}">
                                        <span class="${isSeenClass}"> • </span>
                                                <div style="height:100%;">
                                                    ${notif.description}
                                                    <span class="pull-right text-muted small ">${notifDate}</span>
                                                </div>
                                        </a>
                                    </li>
                                    <li class="divider"></li>
                                    `
				);
				break;

			case "PRF":
				// checks if the notification is seen already or not.
				if (notif.isSeen == false) {
					isSeenClass = "notificationAlert";
				} else isSeenClass = "notificationSeen";

				$("#notificationsDropdown").append(
					`
                            <li class="notification " notificationID = "${notif._id}" >
    
                                <a class="" href="/PRFTracker/${notif.reference.requisitionID}">
                                <span class="${isSeenClass}"> • </span>
                                        <div style="height:100%;">
                                            ${notif.description}
                                            <span class="pull-right text-muted small ">${notifDate}</span>
                                        </div>
                                </a>
                            </li>
                            <li class="divider"></li>
                            `
				);
				break;
			case "Performance Review":
				// checks if the notification is seen already or not.
				if (notif.isSeen == false) {
					isSeenClass = "notificationAlert";
				} else isSeenClass = "notificationSeen";
				$("#notificationsDropdown").append(
					`
                                    <li class="notification " notificationID = "${notif._id}" >
    
                                        <a class="" href="/PerformanceReviewIndividualPage/${notif.reference._id}">
                                        <span class="${isSeenClass}"> • </span>
                                                <div style="height:100%;">
                                                    ${notif.description}
                                                    <span class="pull-right text-muted small ">${notifDate}</span>
                                                </div>
                                        </a>
                                    </li>
                                    <li class="divider"></li>
                                    `
				);
				break;
			case "Performance Appraisal":
				// checks if the notification is seen already or not.
				if (notif.isSeen == false) {
					isSeenClass = "notificationAlert";
				} else isSeenClass = "notificationSeen";

				if (new Date(Date.now()) >= new Date(notif.date)) {
					$("#notificationsDropdown").append(
						`
                                    <li class="notification " notificationID = "${notif._id}" >
    
                                        <a class="" href="/PerformanceAppraisalForm/${notif.reference._id}/${notif.date}">
                                        <span class="${isSeenClass}"> • </span>
                                                <div style="height:100%;">
                                                    ${notif.description}
                                                    <span class="pull-right text-muted small ">${notifDate}</span>
                                                </div>
                                        </a>
                                    </li>
                                    <li class="divider"></li>
                                    `
					);
				}

				break;
			case "Performance Appraisal Answered":
				// checks if the notification is seen already or not.
				if (notif.isSeen == false) {
					isSeenClass = "notificationAlert";
				} else isSeenClass = "notificationSeen";
				let linkForAppraisal;
				if (notif.receiver.position === "Department Head") {
					// linkForAppraisal = `PerformanceAppraisalIndividual/${notif.reference._id}/${notif.date}`;
					linkForAppraisal = `PerformanceAppraisalIndividual/${notif.reference._id}`;
				} else {
					linkForAppraisal = `PerformanceAppraisalIndividualPage/${notif.reference._id}`;
				}
				$("#notificationsDropdown").append(
					`
                                    <li class="notification " notificationID = "${notif._id}" >
    
                                        <a class="" href="/${linkForAppraisal}">
                                        <span class="${isSeenClass}"> • </span>
                                                <div style="height:100%;">
                                                    ${notif.description}
                                                    <span class="pull-right text-muted small ">${notifDate}</span>
                                                </div>
                                        </a>
                                    </li>
                                    <li class="divider"></li>
                                    `
				);
				break;
			case "Application":
				// checks if the notification is seen already or not.
				if (notif.isSeen == false) {
					isSeenClass = "notificationAlert";
				} else isSeenClass = "notificationSeen";

				$("#notificationsDropdown").append(
					`
                                <li class="notification " notificationID = "${notif._id}" >
    
                                    <a class="" href="/ApplicantApproval/${notif.reference._id}">
                                    <span class="${isSeenClass}"> • </span>
                                            <div style="height:100%;">
                                                ${notif.description}
                                                <span class="pull-right text-muted small ">${notifDate}</span>
                                            </div>
                                    </a>
                                </li>
                                <li class="divider"></li>
    
                                `
				);
				break;
			case "Offboarding":
				// converts date to string
				var link;

				if (notif.receiver.position === "Department Head") {
					link = `/ClearanceAccountabilityForm/${notif.reference._id}`;
				} else {
					link = `/OffboardingTracker/${notif.reference._id}`;
				}

				// checks if the notification is seen already or not.
				if (notif.isSeen == false) {
					isSeenClass = "notificationAlert";
				} else isSeenClass = "notificationSeen";

				$("#notificationsDropdown").append(
					`
                                <li class="notification " notificationID = "${notif._id}" >
    
                                    <a class="" href="${link}">
                                    <span class="${isSeenClass}"> • </span>
                                            <div style="height:100%;">
                                                ${notif.description}
                                                <span class="pull-right text-muted small ">${notifDate}</span>
                                            </div>
                                    </a>
                                </li>
                                <li class="divider"></li>
    
                                `
				);
				break;
			case "OffboardingApproval":
				// converts date to string
				var link;

				link = `/OffboardingTracker/${notif.reference._id}`;

				// checks if the notification is seen already or not.
				if (notif.isSeen == false) {
					isSeenClass = "notificationAlert";
				} else isSeenClass = "notificationSeen";

				$("#notificationsDropdown").append(
					`
                                    <li class="notification " notificationID = "${notif._id}" >
    
                                        <a class="" href="${link}">
                                        <span class="${isSeenClass}"> • </span>
                                                <div style="height:100%;">
                                                    ${notif.description}
                                                    <span class="pull-right text-muted small ">${notifDate}</span>
                                                </div>
                                        </a>
                                    </li>
                                    <li class="divider"></li>
    
                                    `
				);
				break;
			case "TNF":
				// converts date to string
				var link;

				if (notif.isSeen == false) {
					isSeenClass = "notificationAlert";
				} else isSeenClass = "notificationSeen";

				$("#notificationsDropdown").append(
					`
                                <li class="notification " notificationID = "${notif._id}" >
    
                                    <a class="" href="/TrainingNominationTracker/${notif.reference._id}">
                                    <span class="${isSeenClass}"> • </span>
                                            <div style="height:100%;">
                                                ${notif.description}
                                                <span class="pull-right text-muted small ">${notifDate}</span>
                                            </div>
                                    </a>
                                </li>
                                <li class="divider"></li>
                            `
				);
				break;
			case "Training Schedule":
				// converts date to string
				var link;

				if (notif.isSeen == false) {
					isSeenClass = "notificationAlert";
				} else isSeenClass = "notificationSeen";

				$("#notificationsDropdown").append(
					`
                                <li class="notification " notificationID = "${notif._id}" >
    
                                    <a class="" href="/TrainingIndividualTracker/${notif.reference._id}">
                                    <span class="${isSeenClass}"> • </span>
                                            <div style="height:100%;">
                                                ${notif.description}
                                                <span class="pull-right text-muted small ">${notifDate}</span>
                                            </div>
                                    </a>
                                </li>
                                <li class="divider"></li>
                            `
				);
				break;
			case "Training Approval":
				// converts date to string
				var link;

				if (notif.isSeen == false) {
					isSeenClass = "notificationAlert";
				} else isSeenClass = "notificationSeen";

				$("#notificationsDropdown").append(
					`
                                <li class="notification " notificationID = "${notif._id}" >
    
                                    <a class="" href="/TrainingNominationTracker/${notif.reference.trainingDetails.id}">
                                    <span class="${isSeenClass}"> • </span>
                                            <div style="height:100%;">
                                                ${notif.description}
                                                <span class="pull-right text-muted small ">${notifDate}</span>
                                            </div>
                                    </a>
                                </li>
                                <li class="divider"></li>
                            `
				);
				break;
			// case "Answer Training Evaluation":
			case "Answer Training Evaluation":
				// converts date to string
				var link;

				if (notif.isSeen == false) {
					isSeenClass = "notificationAlert";
				} else isSeenClass = "notificationSeen";

				$("#notificationsDropdown").append(
					`
                                <li class="notification " notificationID = "${notif._id}" >
    
                                    <a class="" href="/EvaluationForm/${notif.reference._id}">
                                    <span class="${isSeenClass}"> • </span>
                                            <div style="height:100%;">
                                                ${notif.description}
                                                <span class="pull-right text-muted small ">${notifDate}</span>
                                            </div>
                                    </a>
                                </li>
                                <li class="divider"></li>
                            `
				);
				break;

			case "EAF":
				// checks if the notification is seen already or not.
				if (notif.isSeen == false) {
					isSeenClass = "notificationAlert";
				} else isSeenClass = "notificationSeen";

				$("#notificationsDropdown").append(
					`
                            <li class="notification " notificationID = "${notif._id}" >
    
                                <a class="" href="/EmployeeActionApproval/${notif.reference._id}">
                                <span class="${isSeenClass}"> • </span>
                                        <div style="height:100%;">
                                            ${notif.description}
                                            <span class="pull-right text-muted small ">${notifDate}</span>
                                        </div>
                                </a>
                            </li>
                            <li class="divider"></li>
                            `
				);
				break;
			case "Report":
				// converts date to string
				//   console.log("report");
				//   let link;
				if (notif.isSeen == false) {
					isSeenClass = "notificationAlert";
				} else isSeenClass = "notificationSeen";
				$("#notificationsDropdown").append(`
    
                        <li class="notification " notificationID = "${notif._id}" >
    
                            <a class="" href="/ReportTracker/${notif.reference._id}">
                            <span class="${isSeenClass}"> • </span>
                                    <div style="height:100%;">
                                        ${notif.description}
                                        <span class="pull-right text-muted small ">${notifDate}</span>
                                    </div>
                            </a>
                        </li>
                        <li class="divider"></li>
                    `);
				break;
			case "None":
				// checks if the notification is seen already or not.
				if (notif.isSeen == false) {
					isSeenClass = "notificationAlert";
				} else isSeenClass = "notificationSeen";

				$("#notificationsDropdown").append(
					`
                <li class="notification " notificationID = "${notif._id}" >
                    <a class="" href="#">
                        <span class="${isSeenClass}"> • </span>
                        <div style="height:100%;">
                            ${notif.description}
                            <span class="pull-right text-muted small ">${notifDate}</span>
                        </div>
                    </a>
                </li>
                <li class="divider"></li> `
				);
				break;
			case "Answer Assessment Form Employee":
				var link;

				if (notif.isSeen == false) {
					isSeenClass = "notificationAlert";
				} else isSeenClass = "notificationSeen";

				if (new Date(new Date(Date.now())) >= new Date(notif.date)) {
					$("#notificationsDropdown").append(
						`
                                    <li class="notification " notificationID = "${notif._id}" >
    
                                        <a class="" href="/SkillAssessmentForm/${notif.reference._id}/${notif.date}">
                                        <span class="${isSeenClass}"> • </span>
                                                <div style="height:100%;">
                                                    ${notif.description}
                                                    <span class="pull-right text-muted small ">${notifDate}</span>
                                                </div>
                                        </a>
                                    </li>
                                    <li class="divider"></li>
                                `
					);
				}
				break;
			case "Assessment Form Answer":
				var control = "SkillAssessmentTracker";
				notificationTemplate(
					notif.isSeen,
					notif._id,
					notif.reference._id,
					control,
					notif.description,
					notifDate
				);
				break;
			case "Create a Training":
				console.log(notif);
				var control = "get_training_prescription_page";
				notificationTemplate(
					notif.isSeen,
					notif._id,
					null,
					control,
					notif.description,
					notifDate
				);
				break;

			case "All Assessments Answered":
				var control = "SkillAssessmentTrackerSorted";
				notificationTemplate(
					notif.isSeen,
					notif._id,
					notif.reference._id,
					control,
					notif.description,
					notifDate
				);
				break;
			case "Set Skill Setup":
				var control = "form/SkillsSetupForm";
				// console.log("notifDate", new Date(notifDate));
				// console.log("new Date()", new Date());
				if (new Date(notifDate) <= new Date()) {
					notificationTemplate(
						notif.isSeen,
						notif._id,
						null, //notif.reference._id, removed the ID because nageerror kapag kasama
						control,
						notif.description,
						notifDate
					);
				}

				break;
			case "Training Schedule HRSpecialist":
				if (new Date(new Date(Date.now())) >= new Date(notif.date)) {
					$("#notificationsDropdown").append(
						`
                                    <li class="notification " notificationID = "${notif._id}" >
    
                                        <a class="" href="/GetConfirmAttendancePage/${notif.reference._id}">
                                        <span class="${isSeenClass}"> • </span>
                                                <div style="height:100%;">
                                                    ${notif.description}
                                                    <span class="pull-right text-muted small ">${notifDate}</span>
                                                </div>
                                        </a>
                                    </li>
                                    <li class="divider"></li>
                                `
					);
				}
				break;
			case "Training Evaluation Form Answer":
				// checks if the notification is seen already or not.
				if (notif.isSeen == false) {
					isSeenClass = "notificationAlert";
				} else isSeenClass = "notificationSeen";

				$("#notificationsDropdown").append(
					`
                                <li class="notification " notificationID = "${notif._id}" >
                                    <a class="" href="/GetIndividualEvaluationForm/${notif.reference._id}">
                                        <span class="${isSeenClass}"> • </span>
                                        <div style="height:100%;">
                                            ${notif.description}
                                            <span class="pull-right text-muted small ">${notifDate}</span>
                                        </div>
                                    </a>
                                </li>
                                <li class="divider"></li>
                                `
				);
				break;
			case "Set Cycle and Goals":
				if (notif.isSeen == false) {
					isSeenClass = "notificationAlert";
				} else isSeenClass = "notificationSeen";

				if (new Date(new Date(Date.now())) >= new Date(notif.date)) {
					$("#notificationsDropdown").append(
						`
                      <li class="notification " notificationID = "${notif._id}" >
                          <a class="" href="/PerformanceSetGoalsCycleForm">
                              <span class="${isSeenClass}"> • </span>
                              <div style="height:100%;">
                                  ${notif.description} asdas
                                  <span class="pull-right text-muted small ">${notifDate}</span>
                              </div>
                          </a>
                      </li>
                      <li class="divider"></li>
                      `
					);
				}

				break;
			case "referenceType":
				// place at end of adding to notifications dropdown.
				// this just places the "See all notifications"
				$("#notificationsDropdown").append(
					`
                                <li>
                                    <a class="text-center" href="#">
                                        <strong>See All Notifications</strong>
                                        <i class="fa fa-angle-right"></i>
                                    </a>
                                </li>
    
                            `
				);
				break;
		}
	}
}

$(window).load(function () {
	$.get("/get_sorted_notifs", function (data, err) {
		// console.log(data);
		const { NotStartedTasks } = data;
		const not_started_notifs = NotStartedTasks;
		// const completed_notifs = CompletedTasks;
		$("#notificationsDropdown").append(
			`   
			<a href='/get-notifications-page'>
				<li style="text-align:right ">  
					<strong>See All</strong>   
				</li>
			</a>  
			<li class="divider"></li> 
			`
		);
		if (not_started_notifs.length > 0) {
			list_out_notifs(not_started_notifs);
		}
		// if (completed_notifs.length > 0) {
		// 	$("#notificationsDropdown").append(
		// 		`
		//         <br/>
		//         <li class="divider"></li>
		//         <li>
		//                 <strong class="text-center">Completed Tasks/Seen Notifications</strong>
		//         </li>

		//         <li class="divider"></li>
		//         <br/>
		//         <li class="divider"></li>
		//         `
		// 	);
		// 	list_out_notifs(completed_notifs);
		// }
	});
	// $.get("/GetMyNotifications", function (notificationsData, err) {
	// 	// console.log(notificationsData);
	//
	// });
});

$(document).on("click", ".notification", function () {
	var notificationID = $(this).attr("notificationID");
	$.post(
		"/setNotificationSeen",
		{ notificationID: notificationID },
		function (status) {
			// this sets the notification isSeen to true once clicked.
		}
	);
});

// make the notification bell
$(document).on("click", ".notifButton", function () {
	$("#notifBell").css("color", "black");
	$("#notifBell").removeClass("fa-bell");
	$("#notifBell").addClass("fa-bell-o");
});
