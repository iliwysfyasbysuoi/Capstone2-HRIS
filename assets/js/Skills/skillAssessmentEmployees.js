const skillID = document.getElementById("skillID").value;
let options = {
	weekday: "long",
	year: "numeric",
	month: "long",
	day: "numeric",
};
function customDate(string) {
	const date = new Date(string);
	if (string === "") {
		return "-";
	} else {
		return date.toLocaleString(options);
	}
}

$(window).load(function () {
	$.get(`/get-list-of-employees/${skillID}`, function (data, err) {
		if (err != "success") return console.error(err);
		// console.log(data.result);
		let skills = [];
		let employees = [];
		data.result.map((emp, i) => {
			let empSkills = [];
			let empSkillRates = [];
			emp.targetSkills.map(skill => {
				empSkills.push(skill.skillName);
				empSkillRates.push(skill.rating);
				skills.push(skill.skillName);
			});
			const employeeData = {
				id: emp._id,
				name: emp.employeeDetails.name,
				position: emp.employeeDetails.position,
				department: emp.employeeDetails.department,
				businessUnit: emp.employeeDetails.businessUnit,
				skills: emp.targetSkills,
				skillNames: empSkills,
				skillRates: empSkillRates,
				submissionDate: emp.submissionDate,
			};
			employees.push(employeeData);
		});
		// get rid of duplicates
		skills = [...new Set(skills)];

		let employeesSectioned = [];
		skills.map(skill => {
			let employeesPerSkill = [];
			employees.map(emp => {
				if (emp.skillNames.includes(skill)) {
					const employee = {
						id: emp.id,
						name: emp.name,
						position: emp.position,
						department: emp.department,
						businessUnit: emp.businessUnit,
						submissionDate: customDate(emp.submissionDate),
						rate: emp.skillRates[emp.skillNames.indexOf(skill)],
					};
					employeesPerSkill.push(employee);
				}
			});
			// put low rating on top
			employeesPerSkill.sort((a, b) => {
				return a.rate - b.rate;
			});
			employeesSectioned.push(employeesPerSkill);
		});
		// console.log("employeesSectioned");
		// console.log(employeesSectioned);
		skills.map((skill, skillIND) => {
			// for each skill, list employees
			let rows = ``;
			employeesSectioned[skillIND].map(emp => {
				rows += `<tr onclick="window.location.href = '/SkillAssessmentTracker/${emp.id}';" >
		                <th>${emp.name}</th>
		                <th>${emp.position}</th>
		                <th>${emp.department}</th>
		                <th>${emp.businessUnit}</th>
		                <th>${emp.submissionDate}</th>
		                <th>${emp.rate}</th>
		            </tr>`;
			});
			$(".table-responsive").append(`
		        <div class='col-12 p-5' style="display:flex; justify-content:space-between;">
		            <h1 >${skill}</h1>
		            <a class="green-button" href="/training-nomination-form/${skill}/${skillID}">Create Training</a>
		        </div>
		        <table class="table table-hover pointer green-thead mb-5">
		            <thead>
		                <tr>
		                    <th>Name</th>
		                    <th>Position</th>
		                    <th>Department</th>
		                    <th>Business Unit</th>
		                    <th>Date Submitted</th>
		                    <th>Rating</th>
		                </tr>
		            </thead>
		            <tbody>
		                ${rows}
		            </tbody>
		        </table>
		    `);
		});

		// console.log("skills");
		// console.log(skills);
		// console.log("employees");
		// console.log(employees);
	});
});
