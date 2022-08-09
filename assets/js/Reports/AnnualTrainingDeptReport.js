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
		$("#businessUnit").val() == null ||
		$("#department").val() == null
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
		<td>${data.trainingDate}</td>
		<td>${data.position}</td>
		<td>${data.skills}</td>
		<td>${data.name}</td>
	</tr>`;
	return rowHTML;
}

function getEndOfTableHTML(message) {
	var html = `
        <tr>
            <td colspan="5" class="center">${message}</td>
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
	var department = $("#department").val();
	var businessUnit = $("#businessUnit").val();
	var s_date = $("#s_date").val();
	var e_date = $("#e_date").val();
	const needed_data_t_nom = "_id trainingTitle department skills";
	const needed_data_t_eval = "trainingDetails employeeDetails";

	$.get(
		`/get-training-evaluations`,
		{ businessUnit, s_date, e_date, needed_data_t_nom, needed_data_t_eval },
		function (data, e) {
			if (e != "success") return console.error(e);
			console.log(data);
			// console.log(year);

			let dataList = [];
			let finalDataList = [];
			let trainingEvalArr = [];
			if (!(data.tNomData.length === 0 || data.tEvalDataFinal.length === 0)) {
				let trainingEvalRef = [];
				let trainingIDs = [];
				data.tNomData.forEach(training => {
					if (department === training.department) {
						let skillsArr = training.skills.map(skill => skill.skillName);
						let skills = "";
						skillsArr.forEach(skill => (skills += `${skill}, `));
						skills = skills.substring(0, skills.length - 2);
						// console.log("skills");
						// console.log(skills);
						const trainingData = {
							id: training._id,
							trainingTitle: training.trainingTitle,
							skills,
						};
						dataList.push(trainingData);
						trainingIDs.push(training._id);
					}
				});

				// evaluation data
				data.tEvalDataFinal.forEach(eval => {
					if (
						trainingIDs.includes(eval.trainingDetails.id) &&
						department === eval.employeeDetails.department
					) {
						const trainingEval = {
							refID: eval.trainingDetails.id,
							name: eval.employeeDetails.name,
							position: eval.employeeDetails.position,
							trainingDate: new Date(
								eval.trainingDetails.trainingDate
							).toLocaleString("en-US", {
								month: "short",
								year: "numeric",
								day: "numeric",
							}), // todo: format date
						};
						trainingEvalArr.push(trainingEval);
						trainingEvalRef.push(eval.trainingDetails.id);
					}
				});
				// console.log(trainingEvalArr);
				// average evaluation scores
				trainingEvalRef.map((refId, index) => {
					if (trainingIDs.includes(refId)) {
						finalDataList.push({
							...trainingEvalArr[index],
							...dataList[trainingIDs.indexOf(refId)],
						});
					}
				});
			}

			// console.log("finalDataList");
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
	$("#ReportTable tbody").html(``);

	$("#ReportTable tbody").append(getEndOfTableHTML("No data."));
	tableDataRows = 0;
	$(`#department`)
		.empty()
		.append('<option value="" selected disabled>Select a Department</option>');

	switch ($("#businessUnit").val()) {
		case "Circle Corporation Inc.":
			$(`#department`).append(`
            <option value="Corporate Human Resource & Organization Department">Corporate Human Resource & Organization Department</option>
            <option value="Finance & Treasury">Finance & Treasury</option>
			<option value="ICT">ICT</option>
            <option value="Accounting and Finance">Accounting and Finance</option>
            <option value="Supply Chain and Administration">Supply Chain and Administration</option>
        `);
			break;
		case "LNL Archipelago Minerals":
			$(`#department`).append(`
            <option value="Environment & Safety">Environment & Safety</option> 
            <option value="Functional Materials">Functional Materials</option>  
        `);
			break;
		case "Leonio Land":
			$(`#department`).append(`
            <option value="Real Estate Development">Real Estate Development</option> 
            <option value="General Contracting">General Contracting</option>  
        `);
			break;
		case "Petrolift":
			$(`#department`).append(`
            <option value="Technical">Technical</option> 
            <option value="Quality, Safety & Environmental">Quality, Safety & Environmental</option>  
        `);
			break;

		default:
			break;
	}
});

$(document).on("change", "#department", function () {
	getRowData();
});

$(".header").on("click", "#exportToPDF", function () {
	// alert("clicked");
	if (validator() && tableDataRows !== 0) {
		// console.log(req.body);
		var businessUnit = $("#businessUnit").val();
		var department = $("#department").val();
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
		doc.text(`Department: ${department}`, 30, 70);

		doc.setFont("Helvetica", "normal");
		doc.setFontSize(9);
		doc.text(`Date Exported: ${currentDate}`, 30, 80);

		doc.autoTable({
			styles: { overflow: "linebreak", fontSize: 10 },
			headStyles: { fillColor: "#286132" },
			startY: 90,
			theme: "striped",
			html: "#ReportTable",
		});
		doc.save(`${title}.pdf`);
	} else alert("Nothing to export.");
});
