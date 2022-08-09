let tableDataRows = 0;
const currentDate = new Date();

$(window).load(function () {
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

// returns true if there is already an input for date and businessUnit
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
                <td>${data.position}</td>
                <td>${data.department}</td>
                <td>${data.dateStarted}</td>
                <td>${data.dateFinished}</td>
                <td>${data.duration}</td>
                <td>${data.headcount}</td>
                <td>${data.numApplicants}</td>
                <td>${data.numInitialInterview}</td>
                <td>${data.numIFinalInterview}</td>
                <td>${data.numOnboarded}</td>
                <td>${data.ratioAcceptedToHeadcount}</td>
                <td>${data.ratioAcceptedToFinalInterview}</td>
            </tr>
        `;
	return rowHTML;
}

function getEndOfTableHTML(message) {
	var html = `
        <tr>
            <td colspan="12" class="center">${message}</td>
        </tr>
    `;
	return html;
}

function getRowData() {
	if (validator()) {
		var businessUnit = $("#businessUnit").val();
		var s_date = $("#s_date").val();
		var e_date = $("#e_date").val();

		$.get("/getReportData_AnnualRecruitmentReport", {
			businessUnit,
			s_date,
			e_date,
		}).then(arrayRow => {
			console.log(arrayRow);

			if (arrayRow.length == 0) {
				// clears the table first
				$("#ReportTable tbody").html(``);

				$("#ReportTable tbody").append(getEndOfTableHTML("No data."));
				tableDataRows = 0;
			} else {
				// clears the table first
				$("#ReportTable tbody").html(``);

				// adds each row
				arrayRow.forEach((data, index) => {
					$("#ReportTable tbody").append(getRowHTML(data));

					if (index == arrayRow.length - 1) {
						$("#ReportTable tbody").append(getEndOfTableHTML("End of report."));
					}
				});
				tableDataRows = arrayRow.length;
			}
		});
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
	// console.log(new Date(new_s_date));
	// console.log(new Date(curr_e_date));
	// console.log(new Date(new_s_date) > new Date(curr_e_date));
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
			styles: { overflow: "linebreak", fontSize: 9 },
			headStyles: { fillColor: "#286132" },
			startY: 80,
			theme: "striped",
			html: "#ReportTable",
		});
		doc.save(`${title}.pdf`);
	} else alert("Nothing to export.");
});
