var businessUnit;
var department;
var position;
var employeeList = [];

// initializes the modal UI
$(".modal").modal();

$(window).load(function () {
	$.get("/getNextSkillSetUpID", function (skillID, err) {
		$(".skillID").text(skillID);
	});

	$.get("/getEmployees", function (employees, err) {
		employees.map(employee => {
			employeeList.push({
				department: employee.department,
				businessUnit: employee.businessUnit,
				position: employee.position,
			});
		});

		addBusinessUnitDropdown();
	});
});

//!FOR DROPDOWNS
function addBusinessUnitDropdown() {
	// departments = [...new Set(employees.map(({department})=>department))]

	var buLists = [];
	$(`#skillBusinessUnit`).html(
		`<option value="" selected disabled>Select Business Unit</option>`
	);

	employeeList.map(employee => {
		if (employee.businessUnit && employee.businessUnit != "None") {
			if (!buLists.includes(employee.businessUnit)) {
				$(`#skillBusinessUnit`).append(
					`<option value="${employee.businessUnit}">${employee.businessUnit}</option>`
				);
			}
			buLists.push(employee.businessUnit);
		}
	});

	addDepartmentDropdown();
}

function addDepartmentDropdown() {
	// departments = [...new Set(employees.map(({department})=>department))]

	var deptLists = [];
	$(`#skillDepartment`).html(
		`<option value="" selected disabled>Select Department</option>`
	);

	$(`#skillBusinessUnit`).on("change", function () {
		deptLists = [];
		businessUnit = this.value;
		$(`#skillDepartment`).html(
			`<option value="" selected disabled>Select Department</option>`
		);
		employeeList.map(employee => {
			if (businessUnit == employee.businessUnit) {
				if (!deptLists.includes(employee.department)) {
					$(`#skillDepartment`).append(
						`<option value="${employee.department}">${employee.department}</option>`
					);
				}
				deptLists.push(employee.department);
			}
		});
	});

	addPositions();
}

function addPositions() {
	//positions = [...new Set(employees.map(({position})=>position))]

	var positionsList = [];
	$(`#skillDepartment`).on("change", function () {
		positionsList = [];
		department = this.value;
		$(`#skillPositionTitle`).html(
			`<option value="" selected disabled>Select Position</option>`
		);

		employeeList.map(employee => {
			if (
				department == employee.department &&
				businessUnit == employee.businessUnit
			) {
				if (!positionsList.includes(employee.position)) {
					$(`#skillPositionTitle`).append(
						`<option value="${employee.position}">${employee.position}</option>`
					);
				}
				positionsList.push(employee.position);
			}
		});
	});
}

//!FOR SKILLS
// remove the set of fields for the toolsOfTrade if user clicks on remove button
$(document).on("click", ".removeSkill", function () {
	$(this).parent().parent().remove();
});

$(document).on("click", ".addSkill", async function () {
	var position = $(".skillPositionTitle").val();
	var skillOptions = await getSkillsOptions(position);
	var optionString = "<option value='' selected disabled>Select Skill</option>";

	var count = 0;
	$.each(skillOptions, function (key, value) {
		optionString += '<option value="' + value + '">' + key + "</option>";
		count++;
		// console.log(optionString);
	});

	if (count == Object.keys(skillOptions).length) {
		// console.log("PASOK");
		// console.log(optionString);
		$("#tools").append(
			`
            <div class="toolpair col s12">
                <div class="form-group col s9">
                <select class="targetSkills" id="targetSkills" name="targetSkills"  required>
                    ${optionString}
                </select>
                </div>

                <div class="col s2" style = "position: relative; top: 10px;">
                    <label for=""> &nbsp;</label>
                    <a class="btn-floating removeSkill" onClick=><i class="material-icons">remove</i></a>
                </div>
            </div>
            `
		);
	}
});

async function getSkillsOptions(position) {
	return new Promise(async (resolve, reject) => {
		$.post(
			"/postRetrievePositionDetails",
			{
				businessUnit: businessUnit,
				department: department,
				position: position,
			},
			function (positionDetails, result) {
				// console.log(result);
				// console.log(positionDetails);
				if (positionDetails.length === 0) {
					// console.log("positionDetails.length");
					// console.log(positionDetails.length);
					resolve({
						"Problem Solving": "Problem Solving",
						"Team Work": "Team Work",
						"Decision Making": "Decision Making",
						"Attention to Detail": "Attention to Detail",
						"Time Management": "Time Management",
					});
				} else {
					options = {};
					for (let i = 0; i <= positionDetails.skills.length; i++) {
						if (i == positionDetails.skills.length) {
							// console.log(options);
							resolve(options);
						} else {
							// console.log("skill");
							// console.log(positionDetails.skills[i]);
							options[positionDetails.skills[i]] = positionDetails.skills[i];
						}
					}
				}
			}
		);
	});

	// var options;
	// switch(position){
	//     case "Financial Analyst":
	//         options =
	//         {
	//             "Accounting": "Accounting",
	//             "Interpersonal": "Interpersonal",
	//             "Communication": "Communication",
	//             "Problem-solving": "Problem-solving",
	//             "Technical": "Technical",
	//             "Leadership & management": "Leadership & management",
	//             "Financial literacy": "Financial literacy",
	//             "Critical-thinking": "Critical-thinking",
	//             "Organizational": "Organizational",
	//             "Analytical ": "Analytical "
	//         };
	//         break;
	//     case "Credit Analyst":
	//         options =
	//         {
	//             "Accounting": "Accounting",
	//             "Knowledge of industry": "Interpersonal",
	//             "Computing": "Computing",
	//             "Communication": "Communication",
	//             "Problem-Solving": "Problem-Solving",
	//             "Attention to detail": "Attention to detail",
	//             "Documentation and organization": "Documentation and organization",
	//             "Knowledge in risk analysis": "Knowledge in risk analysis",
	//             "Investigative": "Investigative",
	//             "Quantitative analysis": "Quantitative analysis"
	//         };
	//         break;
	//     case "Risk Analyst":
	//         options =
	//         {
	//             "Accounting": "Accounting",
	//             "Knowledge of industry": "Knowledge of industry",
	//             "Computing": "Computing",
	//             "Communication": "Communication",
	//             "Problem-Solving": "Problem-Solving",
	//             "Attention to detail": "Attention to detail",
	//             "Documentation and organization": "Documentation and organization",
	//             "Knowledge in risk analysis": "Knowledge in risk analysis",
	//             "Investigative": "Investigative",
	//             "Quantitative analysis": "Quantitative analysis",
	//         };
	//         break;
	//     case "Treasurer":
	//         options =
	//         {
	//             "Analytical": "Analytical",
	//             "Mathematics": "Mathematics",
	//             "Management": "Management",
	//             "Communication": "Communication",
	//             "Attention to detail": "Attention to detail",
	//             "Problem-solving": "Problem-solving",
	//             "Strategic": "Strategic",
	//             "Working under pressure": "Working under pressure",
	//             "Sociable": "Sociable",
	//             "Business understanding": "Business understanding",
	//         };
	//         break;
	//     case "Underwriter":
	//         options =
	//         {
	//             "Qualitative and quantitative analysis": "Qualitative and quantitative analysis",
	//             "Communication": "Communication",
	//             "Customer service": "Customer service",
	//             "Time Management": "Time Management",
	//             "Project Management": "Project Management",
	//             "Critical thinking": "Critical thinking",
	//             "Mathematics": "Mathematics",
	//             "Statistics": "Statistics",
	//             "Deep knowledge of underwriting regulations": "Deep knowledge of underwriting regulations",
	//             "Attention to detail": "Attention to detail",
	//         };
	//         break;

	// }

	// return options;
}

$(document).on("change", ".skillPositionTitle", async function () {
	if ($(".skillPositionTitle").val() != "" && $(".starDate").val() != "") {
		checkExistingSkillsSetupNotice();
	}

	var position = $(".skillPositionTitle").val();
	var skillsOptions = [];
	skillsOptions = await getSkillsOptions(position);
	// console.log()

	var $el = $(".targetSkills");
	$el.empty(); // remove old options
	$el.append(
		$("<option></option>")
			.attr("value", "")
			.attr("disabled", true)
			.attr("selected", true)
			.text("Select Skill")
	);
	$.each(skillsOptions, function (key, value) {
		$el.append($("<option></option>").attr("value", value).text(key));
	});
});

$(document).on("change", ".startDate", function () {
	if ($(".skillPositionTitle").val() != "" && $(".starDate").val() != "") {
		checkExistingSkillsSetupNotice();
	}
});

/**
 *  checks if may existing active Skill Setup na.
 *  i compared the startDate input with the expireDate records for the specific position
 *  if the startDate is BEFORE the expireDate, then meron pang active.
 *
 * if may active, i show the notice and button to redirect to the active skill setup page
 * */

function checkExistingSkillsSetupNotice() {
	var businessUnit = $(".skillBusinessUnit").val();
	var department = $(".skillDepartment").val();
	var position = $(".skillPositionTitle").val();
	var startDateString = $(".startDate").val();
	// alert(position + startDateString);

	$.post(
		"/getExistingActiveSkillSetup",
		{ position: position, startDateString: startDateString },
		function (data, result) {
			if (data.showNotice == true) {
				$("#view_active_skills_setup_btn").attr(
					"href",
					"/SkillSetUpTracker/" + data.skillSetupData.skillID
				);
				$("#alert_div").prop("hidden", false);
				$("#submitBtn").prop("disabled", true);

				var expireDate = new Date(data.skillSetupData.expireDate);

				$("#alert_text").text(
					`
                There is already an active Skill Set-up that ends on ${expireDate.toDateString()} for the position ${position} in the ${department} Department of ${businessUnit}. 
                
               `
				);
			} else {
				$("#alert_div").prop("hidden", true);
				$("#submitBtn").prop("disabled", false);
			}
		}
	);
}

//Date
// var date = new Date().toISOString().slice(0, 10);
// $(".startDate").attr("min", date);
