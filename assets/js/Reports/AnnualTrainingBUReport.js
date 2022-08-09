let tableDataRows = 0;
const currentDate = new Date();

$(window).load(function () {
	// setup date dropdown
	$("#s_date").val(
		`${currentDate.getFullYear() - 1}-${
			currentDate.getMonth() + 1 > 10 ? "" : 0
		}${currentDate.getMonth() + 1}-${
			currentDate.getDate() > 10 ? "" : 0
		}${currentDate.getDate()}`
	);
	$("#e_date").val(
		`${currentDate.getFullYear()}-${currentDate.getMonth() + 1 > 10 ? "" : 0}${
			currentDate.getMonth() + 1
		}-${currentDate.getDate() > 10 ? "" : 0}${currentDate.getDate()}`
	);
	$("#s_date").prop("max", `${$("#e_date").val()}`);
	$("#e_date").prop("max", `${$("#e_date").val()}`);
});

// returns true if there is already an input for year and businessUnit
function validator() {
	if (
		$("#s_date").val() == "" ||
		$("#e_date").val() == "" ||
		$("#businessUnit").val() == null
	)
		return false;
	else {
		// shows the table on first complete input
		$("#ReportTable").removeClass("d-none");
		return true;
	}
}

function getRowHTML(data) {
	const rowHTML = ` <tr>
		<td>${data.trainingTitle}</td>  
		<td>${data.department}</td> 
		<td>${data.position}</td> 
		<td>${data.participants}</td> 
		<td>${data.venue}</td> 
		<td>${data.sponsor}</td> 
		<td>${data.trainingFee}</td>  
		<td title="${data.programUsefulness} / 5">${data.programUsefulness}</td>  
		<td title="${data.programAdequacy} / 5">${data.programAdequacy}</td>  
		<td title="${data.programSkillsPractice} / 5">${data.programSkillsPractice}</td>  
		<td title="${data.programInstructorKnowledge} / 5">${data.programInstructorKnowledge}</td>  
		<td title="${data.programInstructorDelivery} / 5">${data.programInstructorDelivery}</td>  
		<td title="${data.programFacility} / 5">${data.programFacility}</td>  
		<td title="${data.programAVSupport} / 5">${data.programAVSupport}</td>  
		<td title="${data.programLectureNotes} / 5">${data.programLectureNotes}</td>  
		<td title="${data.programDuration} / 5">${data.programDuration}</td>  
	</tr>`;
	return rowHTML;
}

function getEndOfTableHTML(message) {
	var html = `
        <tr>
            <td colspan="16" class="center">${message}</td>
        </tr>
    `;
	return html;
}

function getRowData() {
	if (!validator()) {
		$("#ReportTable tbody").html(``);

		$("#ReportTable tbody").append(getEndOfTableHTML("No data."));
		tableDataRows = 0;
		return;
	}
	var businessUnit = $("#businessUnit").val();
	var s_date = $("#s_date").val();
	var e_date = $("#e_date").val();
	const needed_data_t_nom =
		"_id trainingTitle employees venue department sponsor trainingFee";
	const needed_data_t_eval =
		"trainingDetails employeeDetails programUsefulness programAdequacy programSkillsPractice programInstructorKnowledge programInstructorDelivery programFacility programAVSupport programLectureNotes programDuration";

	$.get(
		`/get-training-evaluations`,
		{ businessUnit, s_date, e_date, needed_data_t_nom, needed_data_t_eval },
		function (data, e) {
			if (e != "success") return console.error(e);
			console.log(data);
			// console.log(year);

			let dataList = [];
			let finalDataList = [];

			if (!(data.tNomData.length === 0 || data.tEvalDataFinal.length === 0)) {
				let trainingEvalArr = [];
				let trainingEvalRef = [];
				let trainingIDs = [];
				data.tNomData.forEach(training => {
					const trainingData = {
						id: training._id,
						trainingTitle: training.trainingTitle,
						participants: training.employees.length,
						venue: training.venue,
						department: training.department,
						sponsor: training.sponsor,
						trainingFee: training.trainingFee,
					};
					dataList.push(trainingData);
					trainingIDs.push(training._id);
				});

				// evaluation data
				data.tEvalDataFinal.forEach(evalu => {
					if (trainingIDs.includes(evalu.trainingDetails.id)) {
						const trainingEval = {
							refID: evalu.trainingDetails.id,
							position: evalu.employeeDetails.position,
							department: evalu.employeeDetails.department,
							programUsefulness: evalu.programUsefulness,
							programAdequacy: evalu.programAdequacy,
							programSkillsPractice: evalu.programSkillsPractice,
							programInstructorKnowledge: evalu.programInstructorKnowledge,
							programInstructorDelivery: evalu.programInstructorDelivery,
							programFacility: evalu.programFacility,
							programAVSupport: evalu.programAVSupport,
							programLectureNotes: evalu.programLectureNotes,
							programDuration: evalu.programDuration,
						};
						trainingEvalArr.push(trainingEval);
						trainingEvalRef.push(evalu.trainingDetails.id);
					}
				});
				// console.log(trainingEvalArr);
				// average evaluation scores
				trainingIDs.forEach((id, i) => {
					let numOfEvaluations = 0;
					let programUsefulness = 0;
					let programAdequacy = 0;
					let programSkillsPractice = 0;
					let programInstructorKnowledge = 0;
					let programInstructorDelivery = 0;
					let programFacility = 0;
					let programAVSupport = 0;
					let programLectureNotes = 0;
					let programDuration = 0;
					let position = [];
					trainingEvalRef.forEach((refId, refIdIndex) => {
						if (id === refId) {
							numOfEvaluations++;
							programUsefulness +=
								trainingEvalArr[refIdIndex].programUsefulness;
							programAdequacy += trainingEvalArr[refIdIndex].programAdequacy;
							programSkillsPractice +=
								trainingEvalArr[refIdIndex].programSkillsPractice;
							programInstructorKnowledge +=
								trainingEvalArr[refIdIndex].programInstructorKnowledge;
							programInstructorDelivery +=
								trainingEvalArr[refIdIndex].programInstructorDelivery;
							programFacility += trainingEvalArr[refIdIndex].programFacility;
							programAVSupport += trainingEvalArr[refIdIndex].programAVSupport;
							programLectureNotes +=
								trainingEvalArr[refIdIndex].programLectureNotes;
							programDuration += trainingEvalArr[refIdIndex].programDuration;
							position.push(trainingEvalArr[refIdIndex].position);
						}
					});
					position = [...new Set(position)];
					let positionString = "";
					position.forEach(pos => {
						positionString += `${pos}, `;
					});
					if (numOfEvaluations !== 0) {
						programUsefulness /= numOfEvaluations;
						programAdequacy /= numOfEvaluations;
						programSkillsPractice /= numOfEvaluations;
						programInstructorKnowledge /= numOfEvaluations;
						programInstructorDelivery /= numOfEvaluations;
						programFacility /= numOfEvaluations;
						programAVSupport /= numOfEvaluations;
						programLectureNotes /= numOfEvaluations;
						programDuration /= numOfEvaluations;
						positionString = positionString.substring(
							0,
							positionString.length - 2
						);
						finalDataList.push({
							...dataList[i],
							programUsefulness,
							programAdequacy,
							programSkillsPractice,
							programInstructorKnowledge,
							programInstructorDelivery,
							programFacility,
							programAVSupport,
							programLectureNotes,
							programDuration,
							position: positionString,
							numOfEvaluations,
						});
					}
				});
			}

			// console.log("dataList");
			// console.log(finalDataList);

			if (finalDataList.length == 0) {
				// clears the table first
				$("#ReportTable tbody").html(``);

				$("#ReportTable tbody").append(getEndOfTableHTML("No data."));
				tableDataRows = 0;
			} else {
				// clears the table first
				$("#ReportTable tbody").html(``);

				// adds each row
				finalDataList.forEach((data, index) => {
					$("#ReportTable tbody").append(getRowHTML(data));
					if (index == finalDataList.length - 1)
						$("#ReportTable tbody").append(getEndOfTableHTML("End of report."));
				});
				tableDataRows = finalDataList.length;
			}
		}
	);
}
$(document).on("change", "#s_date", function () {
	const new_s_date = $("#s_date").val();
	const curr_e_date = $("#e_date").val();
	$("#e_date").prop("min", `${new_s_date}`);
	if (new Date(new_s_date) > new Date(curr_e_date))
		$("#e_date").val(new_s_date);
	getRowData();
});

$(document).on("change", "#e_date", function () {
	getRowData();
});

$(document).on("change", "#businessUnit", function () {
	getRowData();
});

$(".header").on("click", "#exportToPDF", function () {
	// alert("clicked");
	if (validator() && tableDataRows !== 0) {
		// console.log(req.body);
		var businessUnit = $("#businessUnit").val();
		var s_date = $("#s_date").val();
		var e_date = $("#e_date").val();
		var title = `${
			document.getElementById("title").innerHTML
		} ${s_date} to ${e_date}`;
		// console.log(title);
		window.jsPDF = window.jspdf.jsPDF;
		let doc = new jsPDF("landscape", "px", "a4", "false");
		doc.setFontSize(11);
		doc.setFont("Helvetica", "bold");
		doc.text(title, 30, 50);
		doc.setFontSize(10);
		doc.text(`Company Name: ${businessUnit}`, 30, 60);
		doc.setFont("Helvetica", "normal");
		doc.setFontSize(9);
		doc.text(`Date Exported: ${currentDate}`, 30, 70);

		doc.autoTable({
			styles: { overflow: "linebreak", fontSize: 6 },
			headStyles: { fillColor: "#286132" },
			startY: 80,
			theme: "striped",
			html: "#ReportTable",
		});
		doc.save(`${title}.pdf`);
	} else alert("Nothing to export.");
});
