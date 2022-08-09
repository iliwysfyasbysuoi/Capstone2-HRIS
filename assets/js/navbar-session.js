window.onload = function () {
	//   console.log("reload");
	$.get("/getSessionDetails", function (session, err) {


		var hrPartnerPositions = ["HR Specialist", "HR Officer", "HR Supervisor", "HR Assistant Manager"];

		// alert(hrPartnerPositions.indexOf(session.position) )

		console.log(`
		(hrPartnerPositions.indexOf(session.position) == -1 ) ${(hrPartnerPositions.indexOf(session.position) == -1 )} \n
		(session.position != "Department Director" && session.department != "Corporate Human Resource & Organization Department") ${(session.position != "Department Director" && session.department != "Corporate Human Resource & Organization Department")}
		`)

		// && (session.position != "Department Director" && session.department != "Corporate Human Resource & Organization Department")){

		// if not HR Partner && if not CHROD Director, hide reports
		if(hrPartnerPositions.indexOf(session.position) == -1 ){
			if(session.position != "Department Director" || session.department != "Corporate Human Resource & Organization Department"){
				$(".reports-dropdown").addClass("d-none");
				$("#a-dashboard-report").addClass("d-none");
			}
		}
		
		

		// if(session.position != "Department Director" 
		// 	&& session.department != "Corporate Human Resource & Organization Department"){
		// 		$(".reports-dropdown").addClass("d-none");
		// 	}


		if (session.name != undefined) {
			$(".sidenav-user-information").html(`
                <span>Logged in as:</span> ${session.name} <br>
				<span>Business Unit:</span> ${session.businessUnit} <br>
				<span>Department:</span> ${session.department} <br>
				<span>Position:</span> ${session.position} <br>
            `);

			$(".topnav-profile-link").attr("href", "/profile/" + session._id);
			$(".topnav-name").text(session.name);
		}

		const reportsTracker = `
      <a class="waves-effect waves-dark d-none" id="a-reports" href="/ReportTracker"><i class="fa fa-bar-chart-o"></i>
       Reports Tracker</a>
      `;

		if (
			session.position != null &&
			session.position &&
			session.userType !== "Non-Employee"
		) {
			switch (session.position) {
				case "HR Supervisor":
					$("#side_offboarding").append(`
              <li>
                  <a href="/OffboardingTracker">Offboarding Tracker</a>
              </li>
              <li>
              <a href="/ExitSurveyTracker">Exit Survey Tracker</a>
            </li>
            <li>
                <a href="/EmployeeActionTracker">Employee Action Form Tracker</a>
            </li>
            `);
					// $("#dashboard-report").append(`
					// 	<a class="waves-effect waves-dark" id="a-dashboard-report" href="/Dashboard/recruitment-retention"><i class="fa fa-dashboard"></i>
					// 	Dashboard</a>
					// `);
					// $("#dashboard-report").append(`
					// 	<a class="waves-effect waves-dark" id="a-dashboard-report" href="/Dashboard"><i class="fa fa-dashboard"></i>
					// 	Dashboard</a>
					// `);

					$("#reports").append(reportsTracker);

					$(".side_tnf").remove();
					$(".side_skills").remove();
					$(".side_performance").remove();
					break;

				case "HR Assistant Manager":
					// $("#dashboard-report").append(`
					// 	<a class="waves-effect waves-dark" id="a-dashboard-report" href="/Dashboard/performance-management"><i class="fa fa-dashboard"></i>
					// 	Dashboard</a>
					// `);
					// $("#dashboard-report").append(`
					// 	<a class="waves-effect waves-dark" id="a-dashboard-report" href="/Dashboard"><i class="fa fa-dashboard"></i>
					// 	Dashboard</a>
					// `);

					$("#reports").append(reportsTracker);

					$("#side_offboarding").append(`
            <li>
                <a href="/InterviewTracker">Interview Tracker</a>
            </li>
            `);

					$("#side_performance").append(
						`
          <li>
          <a href="/PerformanceAppraisalTracker">Performance Appraisal Tracker</a>
          </li>
          <li>
          <a href="/PerformanceSatisfactionTracker">Performance Satisfaction Tracker</a>
          </li>
          `
					);
					$(".side_tnf").remove();
					$(".side_skills").remove();
					break;

				case "HR Specialist":
					// $("#dashboard-report").append(`
					// 	<a class="waves-effect waves-dark" id="a-dashboard-report" href="/Dashboard/training-development"><i class="fa fa-dashboard"></i>
					// 	Dashboard</a>
					// `);
					// $("#dashboard-report").append(`
					// 	<a class="waves-effect waves-dark" id="a-dashboard-report" href="/Dashboard"><i class="fa fa-dashboard"></i>
					// 	Dashboard</a>
					// `);

					$("#reports").append(reportsTracker);
					$("#side_tnf").append(`
                    <li>
                        <a href="/form/TrainingNominationForm">Training Nomination Form</a>
                    </li>
                    <li>
                        <a href="/TrainingNominationTracker">Training Nomination Tracker</a>
                    </li>
                    <li>
                         <a href="/GetEvaluationForms">Training Evaluation Tracker</a>
                    </li>
                    <li>
                        <a href="/GetApprovedNominations">Training Tracker</a>
                    </li>
                `);
					$("#side_skills").append(`
                    <li>
                        <a href="/form/SkillsSetupForm">Skills Set-Up Form</a>
                    </li>
                    <li>
                        <a href="/SkillAssessmentTracker">Skills Assessment Tracker</a>
                    </li>
                    <li>
                        <a href="/SkillSetupTracker">Skills Set Up Tracker</a>
                    </li>
                    `);
					$(".side_performance").remove();
					break;
				case "Department Head":
					$("#side_offboarding").append(`
                  <li>
                      <a href="/ClearanceAccountabilityTracker">Clearance Accountability Tracker</a>
                  </li>
                  <li>
                  <a href="/EmployeeActionTracker">Employee Action Form Tracker</a>
              </li>
              `);
					$("#side_tnf").append(`
                  <li>
                      <a href="/TrainingNominationTracker">Training Nomination Tracker</a>
                  </li>
              `);
					$("#side_performance").append(`
            <li>
                <a href="/PerformanceSetGoalsCycleForm">Set Cycle and Goals Form</a>
            </li>
            <li>
                <a href="/PerformanceAppraisalTracker">Performance Appraisal Tracker</a>
            </li>
            <li>
                <a href="/PerformanceReviewTracker">Performance Review Tracker</a>
            </li>
                            
        `);
					$(".side_skills").remove();
					break;

				case "Business Unit Head":
					$("#side_offboarding").append(`
              <li>
                  <a href="/OffboardingTracker">Offboarding Tracker</a>
              </li>  
              <li>
              <a href="/EmployeeActionTracker">Employee Action Form Tracker</a>
          </li>
          `);
					$("#side_tnf").append(`
              <li>
                  <a href="/TrainingNominationTracker">Training Nomination Tracker</a>
              </li>
          `);
					$(".side_skills").remove();
					$(".side_performance").remove();

					break;

				case "Department Director":
					if (
						session.department ===
						"Corporate Human Resource & Organization Department"
					) {
						$("#side_offboarding").append(`
                <li>
                    <a href="/OffboardingTracker">Offboarding Tracker</a>
                </li> 
                <li>
                <a href="/EmployeeActionTracker">Employee Action Form Tracker</a>
            </li>
            `);
						$("#reports").append(reportsTracker);

						$("#side_tnf").append(`
            <li>
                <a href="/TrainingNominationTracker">Training Nomination Tracker</a>
            </li>
            `);
						$(".side_skills").remove();
						$(".side_performance").remove();
					}
					break;

				case "None":
					$(".side_prf").remove();
					$(".side_offboarding").remove();
					$(".side_accountability").remove();
					$(".side_tnf").remove();
					$(".side_skills").remove();
					$(".side_performance").remove();
					// $('#job_listings').append(`
					//     <a class="waves-effect waves-dark" href="/JobListing"><i class="fa fa-list-alt"></i>
					//     Job Listings</a>
					// `)

					break;

				default:
					$("#side_tnf").append(`
              <li>
                  <a href="/TrainingTrackerEmployee">Training Tracker</a>
              </li>
            `);

					$("#side_performance").append(`
              <li>
              <a href="/PerformanceAppraisalTracker">Performance Appraisal Tracker</a>
              </li>
            `);

					$(".side_skills").remove();
			}
		} else {
			$(".side_prf").remove();
			$(".side_offboarding").remove();
			$(".side_accountability").remove();
			$(".side_tnf").remove();
			$(".side_skills").remove();
			$(".side_performance").remove();
		}

		// FOR Personnel Requisitions Links
		if (
			session.position == "Department Head" ||
			session.position == "Business Unit Head" ||
			session.position == "Department Director" ||
			session.position == "HR Supervisor"
		) {
			$("#side_prf").append(
				`
        <li>
          <a href="/form/PersonnelRequisitionForm">Personnel Requisition Form</a>
        </li>
        <li>
          <a href="/PRFTracker">PRF Tracker</a>
        </li>
        <li>
          <a href="/EmployeeActionTracker">Employee Action Form Tracker</a>
        </li>
        `
			);
		} else if (
			session.position == "HR Director" ||
			session.position == "HR Assistant Manager" ||
			session.position == "HR Officer" ||
			session.position == "HR Specialist"
		) {
			$("#side_prf").append(
				`
              <li>
                <a href="/PRFTracker">PRF Tracker</a>
              </li>
              <li>
                <a href="/EmployeeActionTracker">Employee Action Form Tracker</a>
              </li>
              `
			);
		} else {
			$(".side_prf").hide();
		}

		/**
		 * For users who can apply for a job.
		 * shows My Job Applications link
		 */
		if (
			session.position != "HR Director" &&
			session.position != "HR Assistant Manager" &&
			session.position != "HR Officer" &&
			session.position != "HR Specialist" &&
			session.position != "HR Supervisor" &&
			session.position != "Department Head" &&
			session.position != "Business Unit Head" &&
			session.position != "Department Director"
		) {
			$("#my_job_applications").html(
				`
         <a class="waves-effect waves-dark" href="/MyJobApplications"><i class="fa fa-list-alt"></i>My Job Applications</a>
         `
			);
		}
	});
};
