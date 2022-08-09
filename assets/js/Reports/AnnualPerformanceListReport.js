let tableDataRows = 0;
const currentDate = new Date();
var employeeList = [];

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

	// get employees
	$.get("/getEmployees", function (employees, err) {
		if (err != "success") return console.error(err);
		// console.log(employees);.trim()
		employees.map(employee => {
			employeeList.push({
				department: employee.department,
				position: employee.position,
			});
		});
	});
});

// returns true if there is already an input for year and businessUnit
function validator() {
	// console.log($("#year").val());
	// console.log($("#businessUnit").val());
	// console.log($("#position").val());
	// console.log($("#department").val());
	if (
		$("#s_date").val() == "" ||
		$("#e_date").val() == "" ||
		$("#businessUnit").val() == null ||
		$("#position").val() == null ||
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
	// console.log(data);
	let max = data.taskDescriptions;
	// if (data.keyResAreasArr)
	if (data.totalTasks < data.keyResAreasArr.length) max = data.keyResAreasArr;

	const rowspan = max.length;
	var rowHTML = `  `;
	let tasks = data.taskDescriptions.length;
	let keys = data.keyResAreasArr.length;
	max.forEach((el, index) => {
		if (index === 0) rowHTML += `<tr> <td rowspan=${rowspan}>${data.name}</td>`;
		if (index < 0) rowHTML += "<tr>";
		if (keys > 0) {
			keys--;
			rowHTML += `
				<td>${data.keyResAreasArr[index]}</td>
				<td>${data.rateArr[index]}</td> 
			`;
		}
		if (index === 0) rowHTML += `<td rowspan=${rowspan}>${data.rating}</td>`;
		if (tasks > 0) {
			tasks--;
			rowHTML += `
				<td>${data.taskDescriptions[index]}</td> 
			`;
		}
		if (index < 0) rowHTML += "</tr>";
		if (index === 0)
			rowHTML += ` 
			<td rowspan=${rowspan}>${data.totalTasks}</td>
			<td rowspan=${rowspan}>${data.coreValues}</td>
			<td rowspan=${rowspan}>${data.keyActions}</td>
			<td rowspan=${rowspan}>${data.career}</td> </tr>
			
			
			`;
	});
	return rowHTML;
}

function getEndOfTableHTML(message) {
	var html = `
        <tr>
            <td colspan="9" class="center">${message}</td>
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
	var position = $("#position").val();
	var s_date = $("#s_date").val();
	var e_date = $("#e_date").val();
	const needed_data_rev =
		"kpiRating userId workRelatedItems entrepSpirit customerFocus passionExcellence peopleDevelopment stakeholderCommitment submissionDate	";
	const needed_data_app = "listOfAddTasks	userId agreedKeyActsNextCycText submissionDate";
	const needed_data_users = "firstName lastName _id";

	$.get(
		`/get-all-performance-reviews-appraisals`,
		{
			businessUnit,
			department,
			position,
			s_date,
			e_date,
			needed_data_rev,
			needed_data_app,
			needed_data_users,
		},
		function (data, e) {
			if (e != "success") return console.error(e);
			console.log(data);
			let dataList = [];
			if (
				!(
					data.users.length === 0 ||
					(data.reviews.length === 0 && data.apps.length === 0)
				)
			) {
				let reviewsArr = [];
				let reviewsUsers = [];
				let appsArr = [];
				let appsUsers = [];

				data.reviews.forEach(rev => {
					let keyResAreasArr = [];
					let rateArr = [];
					let rating = 0;
					const ratingDivider = rev.kpiRating.length;
					rev.kpiRating.forEach(kpi => {
						keyResAreasArr.push(kpi.keyResAreas);
						rateArr.push(kpi.rating);
						rating += kpi.rating;
					});
					rating /= ratingDivider;
					const employeeDataRev = {
						// name: `${emp.firstName} ${emp.lastName}`,
						id: rev.userId,
						keyResAreasArr,
						rateArr,
						rating,
						career: rev.workRelatedItems,
						coreValues:
							`${rev.entrepSpirit}, ${rev.customerFocus}, ${rev.passionExcellence}, ${rev.peopleDevelopment}, ${rev.stakeholderCommitment}`.replace(
								/\n|\r/g,
								""
							),
					};
					reviewsArr.push(employeeDataRev);
					reviewsUsers.push(rev.userId);
				});
				data.apps.forEach(app => {
					// if (year === app.submissionDate.substring(0, 4)) {
					if (s_date.substring(0,4) === app.submissionDate.substring(0, 4) || e_date.substring(0, 4) === app.submissionDate.substring(0, 4) ) {
						let taskDescriptions = [];
						app.listOfAddTasks.forEach(task => {
							taskDescriptions.push(task.description);
						});
						const employeeDataApp = {
							// name: `${emp.firstName} ${emp.lastName}`,
							id: app.userId,
							taskDescriptions,
							totalTasks: app.listOfAddTasks.length,
							keyActions: app.agreedKeyActsNextCycText,
						};
						appsArr.push(employeeDataApp);
						appsUsers.push(app.userId);
					}
				});
				if (!(reviewsArr.length === 0 && appsArr.length === 0))
					data.users.forEach(user => {
						let employee = {
							name: `${user.firstName} ${user.lastName}`,
							id: user._id,
						};
						if (
							appsUsers.includes(user._id) ||
							reviewsUsers.includes(user._id)
						) {
							if (appsUsers.includes(user._id))
								employee = {
									...employee,
									...appsArr[appsUsers.indexOf(user._id)],
								};
							if (reviewsUsers.includes(user._id))
								employee = {
									...employee,
									...reviewsArr[reviewsUsers.indexOf(user._id)],
								};

							dataList.push(employee);
						}
					});

				// console.log(dataList);
			}

			if (dataList.length == 0) {
				// clears the table first
				$("#ReportTable tbody").html(``);

				$("#ReportTable tbody").append(getEndOfTableHTML("No data."));
				tableDataRows = 0;
			} else {
				// clears the table first
				$("#ReportTable tbody").html(``);

				// adds each row
				dataList.forEach((data, index) => {
					$("#ReportTable tbody").append(getRowHTML(data));
					if (index == dataList.length - 1)
						$("#ReportTable tbody").append(getEndOfTableHTML("End of report."));
				});
				tableDataRows = dataList.length;
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
	$("#ReportTable tbody").html(``);

	$("#ReportTable tbody").append(getEndOfTableHTML("No data."));
	tableDataRows = 0;
	$(`#position`)
		.empty()
		.append('<option value="" selected disabled>Select a Position</option>');
	positionsList = [];

	employeeList.map(emp => {
		if ($("#department").val().trim() == emp.department.trim()) {
			if (!positionsList.includes(emp.position.trim())) {
				$(`#position`).append(
					`<option value="${emp.position.trim()}">${emp.position.trim()}</option>`
				);
				positionsList.push(emp.position.trim());
			}
		}
	});
});

$(document).on("change", "#position", function () {
	getRowData();
});

$(".header").on("click", "#exportToPDF", function () {
	// console.log("tableDataRows");
	// console.log(tableDataRows);
	if (validator() && tableDataRows !== 0) {
		// console.log(req.body);
		var businessUnit = $("#businessUnit").val();
		var department = $("#department").val();
		var position = $("#position").val();
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
		doc.text(`position: ${position}`, 30, 80);
		doc.setFont("Helvetica", "normal");
		doc.setFontSize(9);
		doc.text(`Date Exported: ${currentDate}`, 30, 90);

		doc.autoTable({
			styles: { overflow: "linebreak", fontSize: 10 },
			headStyles: { fillColor: "#286132" },
			startY: 100,
			theme: "striped",
			html: "#ReportTable",
		});
		doc.save(`${title}.pdf`);
	} else alert("Nothing to export.");
});
