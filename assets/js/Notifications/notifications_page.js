function notification_template(seen, id, refID, control, description, date) {
	if (!seen) isSeenClass = "notificationAlert";
	else isSeenClass = "notificationSeen";
	$("#notifications_list").append(
		`
                  <li class='notification on_page_notif' notificationID = "${id}" >

                      <a href="/${refID ? `${control}/${refID}` : control}">
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

function list_out_notifs_on_page(notifs) {
	// console.log(notifs);
	for (i = 0; i < notifs.length; i++) {
		const notif = notifs[i].isCompleted ? notifs[i]._doc : notifs[i];
		// console.log(i);
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

				$("#notifications_list").append(
					`
                                <li class='notification on_page_notif'  notificationID = "${notif._id}" >
    
                                    <a   href="/ExitSurveyTracker/${notif.reference._id}">
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
					redirect = `<a   href="/EmployeeActionApproval/${notif.reference._id}">`;
				} else {
					redirect = `<a   href="/">`;
				}
				$("#notifications_list").append(
					`
                <li class='notification on_page_notif'  notificationID = "${notif._id}" >
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

				$("#notifications_list").append(
					`
                                      <li class='notification on_page_notif'  notificationID = "${notif._id}" >
    
                                          <a   href="/EmployeeActionApproval/${notif.reference._id}">
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

				$("#notifications_list").append(
					`
                                    <li  class='notification on_page_notif' notificationID = "${notif._id}" >
    
                                        <a   href="/EmployeeExitSurveyForm/${notif.reference._id}">
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

				$("#notifications_list").append(
					`
                            <li class='notification on_page_notif'  notificationID = "${notif._id}" >
    
                                <a   href="/PRFTracker/${notif.reference.requisitionID}">
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
				$("#notifications_list").append(
					`
                                    <li class='notification on_page_notif'  notificationID = "${notif._id}" >
    
                                        <a   href="/PerformanceReviewIndividualPage/${notif.reference._id}">
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
					$("#notifications_list").append(
						`
                                    <li class='notification on_page_notif'  notificationID = "${notif._id}" >
    
                                        <a   href="/PerformanceAppraisalForm/${notif.reference._id}/${notif.date}">
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
				$("#notifications_list").append(
					`
                                    <li  class='notification on_page_notif' notificationID = "${notif._id}" >
    
                                        <a   href="/${linkForAppraisal}">
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

				$("#notifications_list").append(
					`
                                <li class='notification on_page_notif'  notificationID = "${notif._id}" >
    
                                    <a   href="/ApplicantApproval/${notif.reference._id}">
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

				$("#notifications_list").append(
					`
                                <li  class='notification on_page_notif' notificationID = "${notif._id}" >
    
                                    <a   href="${link}">
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

				$("#notifications_list").append(
					`
                                    <li class='notification on_page_notif'  notificationID = "${notif._id}" >
    
                                        <a   href="${link}">
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

				$("#notifications_list").append(
					`
                                <li class='notification on_page_notif'  notificationID = "${notif._id}" >
    
                                    <a   href="/TrainingNominationTracker/${notif.reference._id}">
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

				$("#notifications_list").append(
					`
                                <li class='notification on_page_notif'  notificationID = "${notif._id}" >
    
                                    <a   href="/TrainingIndividualTracker/${notif.reference._id}">
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

				$("#notifications_list").append(
					`
                                <li  class='notification on_page_notif' notificationID = "${notif._id}" >
    
                                    <a   href="/TrainingNominationTracker/${notif.reference.trainingDetails.id}">
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

				$("#notifications_list").append(
					`
                                <li class='notification on_page_notif'  notificationID = "${notif._id}" >
    
                                    <a   href="/EvaluationForm/${notif.reference._id}">
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

				$("#notifications_list").append(
					`
                            <li  class='notification on_page_notif' notificationID = "${notif._id}" >
    
                                <a   href="/EmployeeActionApproval/${notif.reference._id}">
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
				$("#notifications_list").append(`
    
                        <li  class='notification on_page_notif' notificationID = "${notif._id}" >
    
                            <a   href="/ReportTracker/${notif.reference._id}">
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

				$("#notifications_list").append(
					`
                <li  class='notification on_page_notif' notificationID = "${notif._id}" >
                    <a   href="#">
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
					$("#notifications_list").append(
						`
                                    <li  class='notification on_page_notif' notificationID = "${notif._id}" >
    
                                        <a   href="/SkillAssessmentForm/${notif.reference._id}/${notif.date}">
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
				notification_template(
					notif.isSeen,
					notif._id,
					notif.reference._id,
					control,
					notif.description,
					notifDate
				);
				break;

			case "All Assessments Answered":
				var control = "SkillAssessmentTrackerSorted";
				notification_template(
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
					notification_template(
						notif.isSeen,
						notif._id,
						notif.reference._id,
						control,
						notif.description,
						notifDate
					);
				}

				break;
			case "Training Schedule HRSpecialist":
				if (new Date(new Date(Date.now())) >= new Date(notif.date)) {
					$("#notifications_list").append(
						`
                                    <li class='notification on_page_notif'  notificationID = "${notif._id}" >
    
                                        <a   href="/GetConfirmAttendancePage/${notif.reference._id}">
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

				$("#notifications_list").append(
					`
                                <li  class='notification on_page_notif' notificationID = "${notif._id}" >
                                    <a   href="/GetIndividualEvaluationForm/${notif.reference._id}">
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
					$("#notifications_list").append(
						`
                      <li class='notification on_page_notif'  notificationID = "${notif._id}" >
                          <a   href="/PerformanceSetGoalsCycleForm">
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
				$("#notifications_list").append(
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
	$.get("/GetMyNotifications", function (data, err) {
		// console.log(data);
		list_out_notifs_on_page(data);
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
// $(document).on("click", ".notifButton", function () {
// 	$("#notifBell").css("color", "black");
// 	$("#notifBell").removeClass("fa-bell");
// 	$("#notifBell").addClass("fa-bell-o");
// });
