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
	var rowHTML = `
            <tr>
                <td>${data.department}</td>
                <td>${data.requests}</td>
                <td>${data.clearances}</td>
                <td>${data.finalApproval}</td>
                <td>${data.exitInterview}</td>
                <td>${data.total}</td> 
                <td>${data.rate}</td> 
            </tr>
        `;
	return rowHTML;
}

function getEndOfTableHTML(message) {
	var html = `
        <tr>
            <td colspan="7" class="center">${message}</td>
        </tr>
    `;
	return html;
}

function getRowData() {
	if (validator()) {
		var businessUnit = $("#businessUnit").val();
		var s_date = $("#s_date").val();
		var e_date = $("#e_date").val();
		const needed_data =
			"department status approvalHR approvalBUHead approvalCHRODDirector interview";
		const exit_interview = false;
		// console.log(businessUnit);
		$.get(
			`/get-offboarding-data`,
			{ businessUnit, s_date, e_date, needed_data, exit_interview },
			function (data, e) {
				if (e != "success") return console.error(e);
				console.log(data);

				let dataRaw = [];
				let departments = [];
				data.map((off, offInd) => {
					const dept = {
						department: off.department,
						status: off.status,
						approvalHR: off.approvalHR.approval,
						approvalBUHead: off.approvalBUHead.approval,
						approvalCHRODDirector: off.approvalCHRODDirector.approval,
						interview: off.interview ? off.interview.status : "",
					};
					departments.push(off.department);
					dataRaw.push(dept);
				});
				// get rid of duplicates
				departments = [...new Set(departments)];
				// console.log("dataRaw");
				// console.log(dataRaw);
				// process data per department
				let dataPerBU = [];
				departments.forEach(dept => {
					let clearances = 0;
					let finalApproval = 0;
					let exitInterview = 0;
					let totalOffboardedEmps = 0;
					let totalReq = 0;

					dataRaw.forEach(off => {
						if (off.department === dept) {
							totalReq++;
							// console.log(off);
							if (off.status === "Recorded") totalOffboardedEmps++;
							// if (off.status == "Recorded") clearances++;
							else if (off.status === "Completed") finalApproval++;
							else if (
								off.approvalHR === "Approved" &&
								off.approvalBUHead === "Approved" &&
								off.approvalCHRODDirector === "Approved" &&
								off.interview !== "Completed"
							)
								exitInterview++;
							else clearances++;
						}
					});
					// if (department===dept) {
					const data = {
						department: dept,
						requests: totalReq,
						total: totalOffboardedEmps,
						clearances,
						finalApproval,
						exitInterview,
						rate: `${(totalOffboardedEmps / totalReq) * 100}%`,
					};
					dataPerBU.push(data);
					// }
				});

				// console.log(dataPerBU);

				if (dataPerBU.length == 0) {
					// clears the table first
					$("#ReportTable tbody").html(``);

					$("#ReportTable tbody").append(getEndOfTableHTML("No data."));
					tableDataRows = 0;
				} else {
					// clears the table first
					$("#ReportTable tbody").html(``);

					// adds each row
					dataPerBU.forEach((data, index) => {
						$("#ReportTable tbody").append(getRowHTML(data));
						if (index == dataPerBU.length - 1)
							$("#ReportTable tbody").append(
								getEndOfTableHTML("End of report.")
							);
					});
					tableDataRows = dataPerBU.length;
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
	getRowData();
});

$(".header").on("click", "#exportToPDF", function () {
	// console.log("tableDataRows");
	// console.log(tableDataRows);
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
			styles: { overflow: "linebreak", fontSize: 10 },
			headStyles: { fillColor: "#286132" },
			startY: 80,
			theme: "striped",
			html: "#ReportTable",
		});
		doc.save(`${title}.pdf`);
	} else alert("Nothing to export.");
});
