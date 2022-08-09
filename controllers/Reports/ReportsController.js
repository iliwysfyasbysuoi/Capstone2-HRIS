const applicationsModel = require("../../models/applicationsModel");
const PRFModel = require("../../models/PRFModel");

const ReportsController = {
	getReportPage: function (req, res) {
		var reportName = req.params.reportName;
		var data, report_page_path;

		switch (reportName) {
			case "AnnualRecruitmentReport":
				report_page_path = "pages/Reports/AnnualRecrtuitmentReport";
				data = {
					page_title: "Annual Recruitment report",
				};
				break;
			case "AnnualOffboardingBusinessReport":
				report_page_path = "pages/Reports/AnnualOffboardingBusinessReport";
				data = {
					page_title: "Annual Offboarding Report",
				};
				break;
			case "AnnualOffboardingDepartmentReport":
				report_page_path = "pages/Reports/AnnualOffboardingDepartmentReport";
				data = {
					page_title: "Annual Departmental Offboarding Report",
				};
				break;
			case "AnnualPerformanceCycleReport":
				report_page_path = "pages/Reports/AnnualPerformanceCycleReport";
				data = {
					page_title: "Annual Performance Review Cycle Report",
				};
				break;
			case "AnnualPerformanceListReport":
				report_page_path = "pages/Reports/AnnualPerformanceListReport";
				data = {
					page_title: "Annual Performance List Report",
				};
				break;
			case "AnnualEmployeeSatisfactionReport":
				report_page_path = "pages/Reports/AnnualEmployeeSatisfactionReport";
				data = {
					page_title: "Annual Employee Satisfactory Report",
				};
				break;
			case "AnnualTrainingBUReport":
				report_page_path = "pages/Reports/AnnualTrainingBUReport";
				data = {
					page_title: "Annual Employee Training Report",
				};
				break;
			case "AnnualTrainingDeptReport":
				report_page_path = "pages/Reports/AnnualTrainingDeptReport";
				data = {
					page_title: "Annual Departamental Employee Training Report",
				};
				break;
			case "AnnualTrainingPosReport":
				report_page_path = "pages/Reports/AnnualTrainingPosReport";
				data = {
					page_title: "Annual Employee Training Report - Position",
				};
				break;
			default:
				report_page_path = "Pages/errorPage";
				data = {
					error: "Invalid url. Report page does not exist.",
				};
				break;
		}

		res.render(report_page_path, data);
	},

	getReportData_AnnualRecruitmentReport: function (req, res) {
		var businessUnit = req.query.businessUnit;
		var start = new Date(`${req.query.s_date}`),
			end = new Date(`${req.query.e_date}`).setDate(
				new Date(`${req.query.e_date}`).getDate() + 1
			); //date work around to include the exact date (added 1 day)
		var combinedData = [];
		var arrayRowData = [];

		// console.log(` ${start} \n ${new Date(start)} \n${new Date(end)}`);
		PRFquery = {
			createdDate: { $gte: start, $lte: end },
			businessUnit,
		};

		PRF_variables =
			"requisitionID createdDate positionTitle department closeDate headcount";

		PRFModel.find(PRFquery, PRF_variables, function (err, PRF_data) {
			// console.log(PRF_data.length);

			if (PRF_data.length == 0) {
				res.send(arrayRowData);
			} else {
				for (let i = 0; i < PRF_data.length; i++) {
					// console.log(`PRF ${i} \n${PRF_data}`);
					applicationsModel.find(
						{ requisition_id: PRF_data[i].requisitionID },
						function (err, applicationsData) {
							// console.log(PRF_data[i].requisitionID);

							// combines the PRF and applciations into 1 object
							var combine = {
								PRF: PRF_data[i],
								applications: applicationsData,
							};

							// pushes all combined into 1 array
							combinedData.push(combine);

							// executes only at the end of for loop
							if (i == PRF_data.length - 1) {
								// console.log(JSON.stringify(combinedData, null ,' '))

								combinedData.sort((a, b) => {
									const first_date = a.PRF.createdDate;
									const second_date = b.PRF.createdDate;
									return first_date - second_date;
								}); // sort by date (createdDate)

								
								combinedData.forEach((v, index) => {
									// var duration = (v.PRF.closeDate - v.PRF.createdDate) / (1000 * 3600 * 24);
									// console.log(`${v.PRF.closeDate} ${v.PRF.createdDate} ${duration} ${Math.round((v.PRF.closeDate- v.PRF.createdDate) / (1000 * 3600 * 24))}`);
									var initialInterviewCount = 0,
										numOnboarded = 0,
										finalInterviewCount = 0;
									var ratioAcceptedToFinalInterview;
									var dateFinished;
									// console.log(v.PRF);

									// counts the number of stuff
									v.applications.forEach((appData, appIndex) => {
										if (
											appData.approval1stInterview == "Approved" ||
											appData.approval1stInterview == "Disapproved"
										)
											initialInterviewCount++;

										if (
											appData.approval3rdInterview == "Approved" ||
											(appData.approval3rdInterview == null &&
												appData.approvalFinal != null)
										)
											finalInterviewCount++;

										if (
											appData.status == "Employed" ||
											appData.status == "Transferred"
										)
											numOnboarded++;
									});

									if (numOnboarded == 0 && numOnboarded == 0) {
										ratioAcceptedToFinalInterview = "N/A";
									} else {
										ratioAcceptedToFinalInterview =
											(numOnboarded / finalInterviewCount) * 100 + "%";
									}

									// date finished
									if (v.PRF.closeDate == undefined) {
										dateFinished = "N/A";
									} else
										dateFinished = v.PRF.closeDate.toLocaleString("en-US", {
											month: "short",
											year: "numeric",
											day: "numeric",
										});

									// formatted data
									rowData = {
										position: v.PRF.positionTitle,
										department: v.PRF.department,
										dateStarted: v.PRF.createdDate.toLocaleString("en-US", {
											month: "short",
											year: "numeric",
											day: "numeric",
										}),
										dateFinished,
										duration:
											Math.round(
												(v.PRF.closeDate - v.PRF.createdDate) /
													(1000 * 3600 * 24)
											) || "N/A",
										headcount: v.PRF.headcount,
										numApplicants: v.applications.length || 0,
										numInitialInterview: initialInterviewCount,
										numIFinalInterview: finalInterviewCount,
										numOnboarded,
										ratioAcceptedToHeadcount:
											(numOnboarded / v.PRF.headcount) * 100 + "%",
										ratioAcceptedToFinalInterview,
									};
									// console.log(`${index}: ${JSON.stringify(rowData)}`);
									// pushes the row to the array
									arrayRowData.push(rowData);

									// executes only at the end of combinedData loop
									if (index == combinedData.length - 1) {
										// console.log(arrayRowData);
										// console.log(arrayRowData.length);

										res.send(arrayRowData);
									}
								});
							}
						}
					);
				}
			}
		});
	},
};

module.exports = ReportsController;
