var businessUnitValue;
var departmentValue;
var employeeIndex = 1;
var skillIndex = 1;
var kpi_index = 1;
var skillList = [];
var employeeList = [];
var positionListFromDB = [];
let kpi_list_from_curr_g_cycle = [];

const skill = document.getElementById("skill").value;
const skillID = document.getElementById("skillID").value;
const training_id_ref = document.getElementById("training_id_ref").value;
const auto_fill_emp_arr = document.getElementById("auto_fill_emp_arr").value;
const auto_fill_kpi_arr = document.getElementById("auto_fill_kpi_arr").value;

function autofill_skill(pos) {
	$(`#skillPosition0`).append(`
						<option value="${pos}" selected>${pos}</option> 
					`);
	$(`#skillPosition0`).val(`${pos}`).change();
	$(`#skillName0`).append(`
						<option value="${skill}" selected>${skill}</option> 
					`);
	$(`#skillName0`).val(`${skill}`).change();
}

function autofill_selects(
	skill_or_kpi_list,
	businessUnit,
	department,
	position,
	emps
) {
	setTimeout(() => {
		$(`#businessUnitDropdown`).val(`${businessUnit}`).change();
		$(`#departmentDropdown`).val(`${department}`).change();

		if (skill_or_kpi_list == "skill") autofill_skill(position);
		else {
			// fill kpi
			skill_or_kpi_list.forEach((kpi, kpi_i) => {
				if (kpi_i === 0) {
					$(`#kpi0`).append(`
					<option value="${kpi}" selected>${kpi}</option> 
				`);
				}

				if (kpi_i > 0) {
					add_kpi();
					$(`#kpi${kpi_i}`).append(`
				<option value="${kpi}" selected>${kpi}</option> 
			`);
				}
			});
		}

		// fill employees
		emps.forEach((e, i) => {
			if (i === 0) {
				$(`#employeePosition0`).append(`
					<option value="${position}" selected>${position}</option> 
				`);
				$(`#employeePosition0`).val(`${position}`).change();
				$(`#employeeName0`).append(`
					<option value="${e.name}" selected>${e.name}</option> 
				`);
				$(`#employeeName0`).val(`${e.name}`).change();
			}

			if (i > 0) addEmployee(e.name, position);

			document.getElementById(`employeeContractPeriod${i}`).value =
				e.contractPeriod;
			document.getElementById(`employeeID${i}`).value = e.id;
		});
	}, 500);
}

$(window).load(function () {
	$.get("/getNextTrainingID", function (trainingID, err) {
		document.getElementById("trainingID").value = trainingID;
	});

	$.get(
		"/get-positions/department positionTitle skills",
		function (positions, err) {
			if (err != "success") return console.error(err);
			positionListFromDB = positions;
		}
	);

	$.get("/getEmployees", function (employees, err) {
		// console.log(employees);.trim()
		employees.forEach(employee => {
			employeeList.push({
				name: employee.firstName + " " + employee.lastName,
				department: employee.department,
				businessUnit: employee.businessUnit,
				position: employee.position,
				employeeID: employee._id,
				contractPeriod: employee.assessmentLength
					? employee.assessmentLength.years +
					  " year(s) and " +
					  employee.assessmentLength.months +
					  " month(s)"
					: "N/A",
			});
		});
		addBusinessUnitDropdown();
	});
	// autofill from Skills Assessment Tracker - List of Employees
	if (!(skillID == "null" && skill == "null")) {
		// skills
		$.get("/GetSkills", function (skills, err) {
			if (err != "success") return console.error(err);
			// console.log(skills);
			skills.forEach(skill => {
				skillList.push({
					department: skill.skillDepartment,
					businessUnit: skill.skillBusinessUnit,
					position: skill.skillPositionTitle,
					skills: skill.targetSkills,
				});
			});
		});
		// console.log(skillID);

		$.get(`/get-list-of-employees/${skillID}`, function (data, err) {
			if (err != "success") return console.error(err);
			// console.log(data.result);
			// process data
			let employees = [];
			let businessUnit;
			let department;
			let position;

			data.result.forEach((asse, i) => {
				if (i === 0) {
					businessUnit = asse.employeeDetails.businessUnit;
					department = asse.employeeDetails.department;
					position = asse.employeeDetails.position;
				}
				let empSkills = [];
				let empSkillRates = [];
				asse.targetSkills.forEach(skill => {
					empSkills.push(skill.skillName);
					empSkillRates.push(skill.rating);
				});
				// dont change &
				if (
					empSkills.includes(skill) &
					(empSkillRates[empSkills.indexOf(skill)] < 4)
				) {
					const employeeDetails = {
						id: asse.employeeDetails.id,
						name: asse.employeeDetails.name,
						contractPeriod: "N/A",
					};
					employees.push(employeeDetails);
				}
			});
			// console.log(employees);
			// assessmentLength??
			$.get(`/getAssessmentLength/${position}`, function (data, err) {
				if (err != "success") return console.error(err);
				// console.log(data);
				data.forEach(e => {
					employees.forEach((emp, ind) => {
						if (e._id === emp.id)
							employees[ind] = {
								...emp,
								contractPeriod: e.assessmentLength
									? e.assessmentLength.years +
									  " year(s) and " +
									  e.assessmentLength.months +
									  " month(s)"
									: "N/A",
							};
					});
				});

				// autofill selects
				autofill_selects(
					"skill",
					businessUnit,
					department,
					position,
					employees
				);
			});
		});
	}
	// autofill from training recommender
	else {
		// console.log("training_id_ref", training_id_ref);
		const emp_arr = auto_fill_emp_arr.split(",");
		const kpi_arr = auto_fill_kpi_arr.split(",");

		const needed_data = "firstName lastName position businessUnit department";
		let employees = [];
		let businessUnit;
		let department;
		let position;
		$.get(
			`/get_employees`,
			{ id_list: emp_arr, needed_data },
			function (data, err) {
				if (err != "success") return console.error(err);

				businessUnit = data[0].businessUnit;
				department = data[0].department;
				position = data[0].position;
				data.forEach(e => {
					const employeeDetails = {
						id: e._id,
						name: `${e.firstName} ${e.lastName}`,
						contractPeriod: "N/A",
					};
					employees.push(employeeDetails);
				});

				$.get(`/getAssessmentLength/${position}`, function (a_data, a_err) {
					if (a_err != "success") return console.error(a_err);
					// console.log(data);
					a_data.forEach(e => {
						employees.forEach((emp, ind) => {
							if (e._id === emp.id)
								employees[ind] = {
									...emp,
									contractPeriod: e.assessmentLength
										? e.assessmentLength.years +
										  " year(s) and " +
										  e.assessmentLength.months +
										  " month(s)"
										: "N/A",
								};
						});
					});

					// autofill selects
					autofill_selects(
						kpi_arr,
						businessUnit,
						department,
						position,
						employees
					);
				});
			}
		);
		// console.log("auto_fill_emp_arr", typeof emp_arr);
		// console.log("auto_fill_emp_arr", emp_arr);
	}
});

const addBusinessUnitDropdown = () => {
	// var businessUnit = employeeList;
	var businessUnits = [
		...new Set(employeeList.map(({ businessUnit }) => businessUnit)),
	];

	//resets value of dropdown
	$(`#businessUnitDropdown`).html(
		`<option value="" selected disabled>Select Business Unit</option>`
	);

	businessUnits.forEach(businessUnit => {
		if (businessUnit && businessUnit !== "None") {
			$(`#businessUnitDropdown`).append(
				`<option value="${businessUnit}">${businessUnit}</option>`
			);
		}
	});

	addDepartmentDropdown();
};

const addDepartmentDropdown = () => {
	$("#businessUnitDropdown").on("change", () => {
		// var departments = [];
		businessUnitValue = document.getElementById("businessUnitDropdown").value;

		//resets value of other dropdown
		$(`#departmentDropdown`).html(
			`<option value="" selected disabled>Select Department</option>`
		);
		// console.log(skillList);
		// if (!(skill == "/" || skill == "")) {
		// 	skillList.forEach(skill => {
		// 		if (businessUnitValue == skill.businessUnit) {
		// 			if (!departments.includes(skill.department)) {
		// 				$(`#departmentDropdown`).append(
		// 					`<option value="${skill.department}">${skill.department}</option>`
		// 				);
		// 				departments.push(skill.department);
		// 			}
		// 		}
		// 	});
		// } else {
		switch (businessUnitValue) {
			case "Circle Corporation Inc.":
				$(`#departmentDropdown`).append(`
				<option value="Corporate Human Resource & Organization Department">Corporate Human Resource & Organization Department</option>
				<option value="Finance & Treasury">Finance & Treasury</option>
				<option value="ICT">ICT</option>
				<option value="Accounting and Finance">Accounting and Finance</option>
				<option value="Supply Chain and Administration">Supply Chain and Administration</option>
			`);
				break;
			case "LNL Archipelago Minerals":
				$(`#departmentDropdown`).append(`
				<option value="Environment & Safety">Environment & Safety</option> 
				<option value="Functional Materials">Functional Materials</option>  
			`);
				break;
			case "Leonio Land":
				$(`#departmentDropdown`).append(`
				<option value="Real Estate Development">Real Estate Development</option> 
				<option value="General Contracting">General Contracting</option>  
			`);
				break;
			case "Petrolift":
				$(`#departmentDropdown`).append(`
				<option value="Technical">Technical</option> 
				<option value="Quality, Safety & Environmental">Quality, Safety & Environmental</option>  
			`);
				break;

			default:
				break;
		}
		// }
	});

	addPositionDropdown(0, 0, 0);
};

const addPositionDropdown = (skillIdx, employeeIdx, kpi_idx) => {
	$("#departmentDropdown").on("change", function () {
		departmentValue = document.getElementById("departmentDropdown").value;
		//resets value of other dropdown
		$(`#skillPosition${skillIdx}`).html(
			`<option value="" selected disabled>Select Position</option>`
		);
		$(`#skillName${skillIdx}`).html(
			`<option value="" selected disabled>Select Skill</option>`
		);
		$(`#kpi${kpi_idx}`).html(
			`<option value="" selected disabled>Select a KPI</option>`
		);
		$(`#employeePosition${employeeIdx}`).html(
			`<option value="" selected disabled>Select Position</option>`
		);
		$(`#employeeName${employeeIdx}`).html(
			`<option value="" selected disabled>Select Employee</option>`
		);
		document.getElementById(`employeeContractPeriod${employeeIdx}`).value = "";
		const curr_date = new Date(Date.now());
		// get kpi list
		$.get(
			"/get_current_cycle",
			{
				businessUnit: businessUnitValue,
				department: departmentValue,
				needed_data: "listOfCycles dates startDate",
			},
			function (res, err) {
				if (err != "success") return console.error(err);
				// if (res) {
				kpi_list_from_curr_g_cycle = [];
				if (res.length > 0) {
					res.forEach(kpi_array => {
						if (kpi_array.length > 0) {
							kpi_array.forEach(kpi =>
								kpi_list_from_curr_g_cycle.push(kpi.keyResAreas)
							);
						}
					});
				}
				kpi_list_from_curr_g_cycle.forEach(kpi => {
					// console.log("appending", kpi);
					$(`#kpi${0}`).append(
						`<option value="${kpi.trim()}">${kpi.trim()}</option>`
					);
				});
				// } else kpi_list_from_curr_g_cycle = [];
				// console.log(kpi_list_from_curr_g_cycle);
				// console.log(res);
			}
		);
	});

	$(`#skillPosition${skillIdx}`).on("focus", function () {
		positionsList = [];
		departmentValue = document.getElementById("departmentDropdown").value;

		//resets value of other dropdown
		$(`#skillPosition${skillIdx}`).html(
			`<option value="" selected disabled>Select Position</option>`
		);
		$(`#skillName${skillIdx}`).html(
			`<option value="" selected disabled>Select Skill</option>`
		);

		employeeList.forEach(emp => {
			if (departmentValue.trim() == emp.department.trim()) {
				if (!positionsList.includes(emp.position.trim())) {
					$(`#skillPosition${skillIdx}`).append(
						`<option value="${emp.position.trim()}">${emp.position.trim()}</option>`
					);
					positionsList.push(emp.position.trim());
				}
			}
		});
	});

	kpi_list_from_curr_g_cycle.forEach(kpi => {
		console.log("appending", kpi);
		$(`#kpi${kpi_idx}`).append(
			`<option value="${kpi.trim()}">${kpi.trim()}</option>`
		);
	});

	$(`#employeePosition${employeeIdx}`).on("focus", function () {
		positionsList = [];
		departmentValue = document.getElementById("departmentDropdown").value;

		$(`#employeePosition${employeeIdx}`).html(
			`<option value="" selected disabled>Select Position</option>`
		);
		$(`#employeeName${employeeIdx}`).html(
			`<option value="" selected disabled>Select Employee</option>`
		);
		employeeList.forEach(emp => {
			if (departmentValue.trim() == emp.department.trim()) {
				if (!positionsList.includes(emp.position.trim())) {
					$(`#employeePosition${employeeIdx}`).append(
						`<option value="${emp.position.trim()}">${emp.position.trim()}</option>`
					);
					positionsList.push(emp.position.trim());
				}
			}
		});
	});
	addSkills(skillIdx);
	addEmployeeNames(employeeIdx);
};

const addSkills = skillIdx => {
	var positionID = `skillPosition${skillIdx}`;
	departmentValue = document.getElementById("departmentDropdown").value;

	$(`#${positionID}`).on("change", function () {
		skills = [];
		var position = document.getElementById(positionID).value;
		$(`#skillName${skillIdx}`).html(
			`<option value="" selected disabled>Select Skill</option>`
		);

		positionListFromDB.forEach(pos => {
			if (
				position.trim() == pos.positionTitle.trim() &&
				departmentValue.trim() == pos.department.trim()
			) {
				pos.skills.forEach(indivSkill => {
					if (!skills.includes(indivSkill)) {
						$(`#skillName${skillIdx}`).append(
							`<option value="${indivSkill.trim()}">${indivSkill.trim()}</option>`
						);

						skills.push(indivSkill);
					}
				});
			}
		});
		if (skills.length === 0) {
			[
				"Problem Solving",
				"Team Work",
				"Decision Making",
				"Attention to Detail",
				"Time Management",
			].forEach(s =>
				$(`#skillName${skillIdx}`).append(
					`<option value="${s.trim()}">${s.trim()}</option>`
				)
			);
		}
	});
};

const addEmployeeNames = employeeIdx => {
	var employeePositionID = `employeePosition${employeeIdx}`;
	var employeeNameID = `employeeName${employeeIdx}`;
	$(`#${employeePositionID}`).on("change", function () {
		var position = document.getElementById(employeePositionID).value;
		$(`#${employeeNameID}`).html(
			`<option value="" selected disabled>Select Employee</option>`
		);
		// runs quite plenty - refactor
		employeeList.forEach(employee => {
			var employeeOptionsAppended = $(`#${employeeNameID}`).html();
			// console.log(employeeOptionsAppended.includes(employee.name));
			if (
				position == employee.position &&
				departmentValue == employee.department &&
				businessUnitValue == employee.businessUnit &&
				employeeOptionsAppended.includes(employee.name) == false
			) {
				$(`#${employeeNameID}`).append(
					`<option value="${employee.name}">${employee.name}</option>`
				);
			}
		});
	});

	changeContractPeriod(employeeNameID, employeeIdx);
};

const changeContractPeriod = (id, idx) => {
	$(`#${id}`).on("change", function () {
		var name = this.value;

		var employee = employeeList.find(employee => name === employee.name);
		document.getElementById(`employeeContractPeriod${idx}`).value =
			employee.contractPeriod;
		document.getElementById(`employeeID${idx}`).value = employee.employeeID;
	});
};

//!FOR DATES
// remove the set of fields for the toolsOfTrade if user clicks on remove button
$(document).on("click", ".removeDate", function () {
	$(this).parent().parent().remove();
});

$(document).on("click", ".addDate", function () {
	$("#dates").append(
		`
        <div class="toolpair col s12">
            <div class="form-group col s6">
                <label for="skillPosition"> Inclusive Dates</label>
                <input placeholder="" name="inclusiveDates" type="datetime-local" class="inclusiveDates " required>
                
            </div>
            <div class="col s4">
                <label for=""> &nbsp;</label>
                <a class="btn-floating removeDate" onClick=><i class="material-icons">remove</i></a>
            </div>
        </div>
        `
	);
});

$(".modal").modal();
$(document).on("change", ".inclusiveDates", function () {
	var selectedDate = $(this).val().slice(0, 10);

	var inclusiveDates = $(".inclusiveDates")
		.map(function () {
			return this.value.slice(0, 10);
		})
		.get();

	var count = (input, arr) => arr.filter(x => x === input).length;
	var numInstance = count(selectedDate, inclusiveDates);

	if (numInstance > 1) {
		$("#snackbar").addClass("show");
		// After 3 seconds, remove the show class from DIV
		setTimeout(function () {
			$("#snackbar").removeClass("show");
		}, 3000);
		$(this).css("background-color", "#ffcece");
	} else {
		$(this).css("background-color", "transparent");
	}
});

//!FOR REQUIREMENTS
// remove the set of fields for the toolsOfTrade if user clicks on remove button
$(document).on("click", ".removeReq", function () {
	$(this).parent().parent().remove();
});

$(document).on("click", ".addReq", function () {
	$("#reqs").append(
		`
        <div class="toolpair col s12">
            <div class="form-group col s9">
                <input placeholder="Requirement" id="registrationRequirements" name="registrationRequirements" type="text" class="registrationRequirements"  required>
            </div>
            <div class="form-group col s3 registrationRequirements">
                <a class="btn-floating removeReq" onClick=><i class="material-icons">remove</i></a>
            </div>
        </div>
        `
	);
});

//!FOR SKILLS
// remove the set of fields for the toolsOfTrade if user clicks on remove button
$(document).on("click", ".removeSkill", function () {
	$(this).parent().parent().remove();
});

$(document).on("click", ".addSkill", function () {
	$("#tools").append(
		`<div class="toolpair col s12">
            <div class="form-group col s6">
                <label for="skillPosition${skillIndex}"> &nbsp;</label>
                <select class="skillPosition" id="skillPosition${skillIndex}" name="skillPosition" required>
                    <option value="" selected disabled>Select Position</option>
                </select>
            </div>
            <div class="col s4">
                <label for="skillName"> &nbsp;</label>
                <select class="skillName" id="skillName${skillIndex}" name="skillName" required>
                    <option value="" selected disabled>Select Skill</option>
                </select>
            </div>
            <div class="col s2" style = "position: relative; top: 10px;">
                <label for=""> &nbsp;</label>
                <a class="btn-floating removeSkill" onClick=><i class="material-icons">remove</i></a>
            </div>
        </div>`
	);

	addPositionDropdown(skillIndex, employeeIndex, kpi_index);
	++skillIndex;
});

$(document).on("click", ".remove_KPI", function () {
	$(this).parent().parent().remove();
});

$(document).on("click", ".add_KPI", function () {
	add_kpi();
});

//!FOR EMPLOYEE
$(document).on("click", ".addEmployee", function () {
	addEmployee("", "");
});

// remove the set of fields for the toolsOfTrade if user clicks on remove button
$(document).on("click", ".removeEmployee", function () {
	$(this).parent().parent().parent().remove();
});

function addEmployee(name, position) {
	$(`#employeeTrainingList`).append(`
    <tr class="toolpair">
        <td>
            <select class="employeePosition" id="employeePosition${employeeIndex}" name="employeePosition" required>
                <option value="" selected disabled> Select Position</option>
                ${
									position
										? `<option value='${position}' selected  >${position}</option>`
										: ""
								}
            </select>

        </td>
        <td>
            <div class="hello">
                <select class="employeeName" id="employeeName${employeeIndex}" name="employeeName" required>
                    <option value="" selected disabled> Select Employee</option>
                    ${
											name
												? `<option value='${name}' selected  >${name}</option>`
												: ""
										}
                </select>
            </div>
        </td>
        <td>
            <input placeholder="" id="employeeContractPeriod${employeeIndex}" name="employeeContractPeriod" type="text" class="employeeContractPeriod"  required>
            <input placeholder="" id="employeeID${employeeIndex}" name="employeeID" type="text" class="employeeID" hidden required>
        </td>
        <td>
            <div class="col s2" style = "position: relative; top: 10px;">
                <label for=""> &nbsp;</label>
                <a class="btn-floating removeEmployee"><i class="material-icons">remove</i></a>
            </div>
        </td>
    </tr>`);

	addPositionDropdown(skillIndex, employeeIndex, kpi_index);
	++employeeIndex;
}

function add_kpi() {
	$("#tools_kpi").append(
		`<div class="toolpair col s12" style="padding:15px 0;">
			<div class="col s10">
				<select class="kpi" id="kpi${kpi_index}" name="kpi">
					<option value="" selected disabled>Select a KPI</option> 
				</select>
			</div>
            <div class="col s2" style = "position: relative; top: 10px;">
                <label for=""> &nbsp;</label>
                <a class="btn-floating remove_KPI"><i class="material-icons">remove</i></a>
            </div>
        </div>`
	);

	addPositionDropdown(skillIndex, employeeIndex, kpi_index);
	++kpi_index;
}
