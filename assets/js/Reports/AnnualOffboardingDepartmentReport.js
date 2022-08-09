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
	// console.log("data", data);
	var rowHTML = `
            <tr>
                <td>${data.name}</td>
                <td>${data.position}</td>
                <td>${data.natureOfSeparation}</td>
                <td>${data.reasons}</td> 
                <td>${data.companyPositive}</td> 
                <td>${data.companyNegative}</td> 
                <td>${data.returnFuture}</td> 
                <td>${data.generalComments}</td> 
            </tr>
        `;
	return rowHTML;
}

function getEndOfTableHTML(message) {
	var html = `
        <tr>
            <td colspan="8" class="center">${message}</td>
        </tr>
    `;
	return html;
}

function getRowData() {
	if (validator()) {
		var businessUnit = $("#businessUnit").val();
		var department = $("#department").val();
		var s_date = $("#s_date").val();
		var e_date = $("#e_date").val();
		const needed_data =
			"_id department interview natureOfSeparation name position";
		const exit_interview = true;
		$.get(
			`/get-offboarding-data`,
			{ businessUnit, s_date, e_date, needed_data, exit_interview },
			function (data, e) {
				if (e != "success") return console.error(e);
				console.log(data);

				// ready exit survey data
				let surveyOffboardingIDs = [];
				let surveyReasons = [];
				let restOfData = [];
				// console.log(data.exitSurveyData);
				data.exitSurveyData.map(sur => {
					surveyOffboardingIDs.push(sur.offboardingId);
					surveyReasons.push(sur.reasonLeave);
					const data = {
						companyPositive: sur.companyPositive,
						companyNegative: sur.companyNegative,
						returnFuture: sur.returnFuture,
						generalComments: sur.generalComments,
					};
					// console.log(data);
					restOfData.push(data);
				});

				let dataPerDept = [];
				data.offboardingData.map((off, offInd) => {
					let reasonsArr = [];
					let reasons = "";
					let otherData = {};
					if (surveyOffboardingIDs.includes(off._id)) {
						otherData = restOfData[surveyOffboardingIDs.indexOf(off._id)];
						reasonsArr = surveyReasons[surveyOffboardingIDs.indexOf(off._id)];
					}
					reasonsArr.forEach(r => (reasons += `${r}, `));
					reasons = reasons.substring(0, reasons.length - 2);
					const status = off.interview
						? off.interview.status === "Completed"
						: false;
					if (off.department === department && status) {
						const dept = {
							name: off.name,
							position: off.position,
							natureOfSeparation: off.natureOfSeparation,
							department: off.department,
							reasons,
							...otherData,
						};
						dataPerDept.push(dept);
					}
				});

				// console.log("dataPerDept");
				// console.log(dataPerDept);

				if (dataPerDept.length == 0) {
					// clears the table first
					$("#ReportTable tbody").html(``);

					$("#ReportTable tbody").append(getEndOfTableHTML("No data."));
					tableDataRows = 0;
				} else {
					// clears the table first
					$("#ReportTable tbody").html(``);

					// adds each row
					dataPerDept.forEach((data, index) => {
						$("#ReportTable tbody").append(getRowHTML(data));
						if (index == dataPerDept.length - 1)
							$("#ReportTable tbody").append(
								getEndOfTableHTML("End of report.")
							);
					});
					tableDataRows = dataPerDept.length;
				}
			}
		);
	} else {
		$("#ReportTable tbody").html(``);

		$("#ReportTable tbody").append(getEndOfTableHTML("No data."));
		tableDataRows = 0;
	}
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
	// console.log("tableDataRows");
	// console.log(tableDataRows);
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
