var employeeList = [];

const bu_string = `#bu_select`;
const dept_string = `#dept_select`;
const pos_string = `#pos_select`;

const spec_select = `#spec_select`;
const kpi_select = `#kpi_select`;
const filt_opt_select = `#filt_opt_select`;
const value_select = `#value_select`;

const value_select_label = `#value_select_label`;

const err_msg_string = `#error_msg_for_value_select`;
const err_msg_val_string = `#error_msg_value_for_value_select`;

const a_value = `#a_value`;
const a_value_err_msg_string = `#error_msg_for_a_value`;
const a_value_err_msg_val_string = `#error_msg_value_for_a_value`;
const a_value_div = `#a_value_div`;
let global_goal_cycles = [];

function get_end_of_table_html(message) {
	var html = `
        <tr>
            <td colspan="4" class="center">${message}</td>
        </tr>
    `;
	return html;
}

function get_row_html(data) {
	const rowspan = data.employees.length;
	let row_html = ``;
	let kpi_string = "";
	let emp_ids = data.employees.map(emp => emp.user_id);
	let emp_ids_string = "";
	data.kpi_list.forEach((kpi, kpi_index) => {
		kpi_string += `${kpi}`;
		if (kpi_index !== data.kpi_list.length - 1) kpi_string += `, `;
	});
	emp_ids.forEach((emp, emp_index) => {
		emp_ids_string += `emp_id=${emp}`;
		if (emp_index !== emp_ids.length - 1) emp_ids_string += `&`;
	});

	data.employees.forEach((emp, emp_index) => {
		if (emp_index === 0) {
			row_html += `
			<tr> 
				<td rowspan="${rowspan}">${data.training}</td>
				<td rowspan="${rowspan}">${kpi_string}</td>

			`;
		}
		if (emp_index > 0) row_html += `<tr>`;
		row_html += `
		 <td>${emp.name}</td> 
		 `;
		if (emp_index === 0) {
			row_html += ` 
				<td rowspan="${rowspan}" style="display:flex;justify-content:center;align-items:center;">
					<a class="green-button" style="border:none;" href="/training-nomination-form/${null}/${null}?${emp_ids_string}&training_id=${
				data.training_id
			}" >
						Create Training
					</a>
				</td>  
			`;
		}
		row_html += "</tr>";
	});
	return row_html;
}

function process_input() {
	if (
		$(bu_string).val() != null &&
		$(dept_string).val() != null &&
		$(pos_string).val() != null
		// &&
		// $(spec_select).val() != null &&
		// $(kpi_select).val() != null &&
		// $(filt_opt_select).val() != null &&
		// $(value_select).val() != ""
	)
		get_training_recommendation();
}
function process_output() {
	// console.log(global_goal_cycles);
	const algo = $(spec_select).val();
	const expo_smooth_alpha =
		$(spec_select).val() === "Exponential Smoothing" ? $(a_value).val() : null;
	const kpi = $(kpi_select).val();
	const filter = $(filt_opt_select).val();
	const value = $(value_select).val();
	// console.log(`algo`, algo);
	// console.log(`kpi`, kpi);
	// console.log(`filter`, filter);
	// console.log(`value`, value);
	if (algo != null && kpi != null && filter != null && value != "") {
		let list_of_employees_to_train;
		let list_of_trainings = [];
		global_goal_cycles.forEach((c, c_index) => {
			// only get the latest perfo employees
			if (c_index === global_goal_cycles.length - 1)
				list_of_employees_to_train = c.get_employees(filter, value, kpi);
			list_of_trainings = list_of_trainings.concat(
				c.training_improvement_rating_above(algo, kpi, expo_smooth_alpha)
			);
		});
		// console.log(list_of_employees_to_train);
		// console.log(list_of_trainings);

		let rows_to_display = [];
		const emp_id_list = list_of_employees_to_train.map(emp => emp.user_id);
		$.get(
			`/get_trainings`,
			{ id_list: list_of_trainings, needed_data: "trainingTitle kpi_list" },
			function (data, err) {
				if (err != "success") return console.error(err);
				// console.log("get_trainings data");
				// console.log(data);
				data.forEach(training => {
					const training_obj = {
						training_id: training._id,
						training: training.trainingTitle,
						kpi_list: training.kpi_list,
					};

					rows_to_display.push(training_obj);
				});
				$.get(
					`/get_employees`,
					{
						id_list: emp_id_list,
						needed_data: "firstName middleName lastName",
					},
					function (data, err) {
						if (err != "success") return console.error(err);
						// console.log("get_employees data");
						// console.log(data);
						let list_of_emp = [];
						data.forEach(emp => {
							list_of_emp.push({
								user_id: emp._id,
								name: `${emp.firstName} ${emp.lastName}`,
							});
						});
						rows_to_display.forEach(row => {
							row.employees = list_of_emp;
						});
						// console.log("rows_to_display", rows_to_display);

						if (rows_to_display.length == 0) {
							// clears the table first
							$("#recommended_table tbody").html(``);

							$("#recommended_table tbody").append(
								get_end_of_table_html("No data.")
							);
							// tableDataRows = 0;
						} else {
							// clears the table first
							$("#recommended_table tbody").html(``);

							// adds each row
							rows_to_display.forEach((data, index) => {
								$("#recommended_table tbody").append(get_row_html(data));
								if (index == rows_to_display.length - 1)
									$("#recommended_table tbody").append(
										get_end_of_table_html("End of report.")
									);
							});
							// tableDataRows = rows_to_display.length;
						}
					}
				);
			}
		);
	}
}

function get_training_recommendation() {
	// console.log("get training recommendation");
	const bu = $(bu_string).val();
	const dept = $(dept_string).val();
	const pos = $(pos_string).val();
	// const algo = $(spec_select).val();
	// const kpi = $(kpi_select).val();
	// const filter = $(filt_opt_select).val();
	// const value = $(value_select).val();

	// console.log(`bu`, bu);
	// console.log(`dept`, dept);
	// console.log(`pos`, pos);
	// console.log(`algo`, algo);
	// console.log(`kpi`, kpi);
	// console.log(`filter`, filter);
	// console.log(`value`, value);
	$.get(
		`/get_training_recommendation`,
		{ bu, dept, pos },
		function (data, err) {
			if (err != "success") return console.error(err);
			// console.log("data");
			// console.log(data);

			data.forEach(goal_cycle => {
				const g_c = Goal_Cycle(goal_cycle);
				global_goal_cycles.push(g_c);
				// goalc.console_log_cycle_matrixes();
			});
		}
	);
}

$(window).load(function () {
	// get_training_recommendation()
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

		// test
		// let tra_arr = [
		// 	null,
		// 	[
		// 		{ name: "bob", improvement_rating: 3 },
		// 		{ name: "amy", improvement_rating: 4 },
		// 		{ name: "daniel", improvement_rating: 3 },
		// 		{ name: "reck", improvement_rating: 1 },
		// 		{ name: "rock", improvement_rating: 0 },
		// 	],
		// 	[{ name: "nate", improvement_rating: -3 }],
		// ];
		// let tra_arr = [
		// 	null,
		// 	[
		// 		{ name: "bob", improvement_rating: 3 },
		// 		{ name: "amy", improvement_rating: -3 },
		// 		{ name: "daniel", improvement_rating: 0 },
		// 		{ name: "reck", improvement_rating: 1 },
		// 		{ name: "rock", improvement_rating: 3 },
		// 	],
		// 	[{ name: "nate", improvement_rating: 4 }],
		// ];

		// get_all_trainings(trainings_mod)
		// let new_trainings_arr = [];
		// tra_arr.forEach((tra, tra_index) => {
		// 	if (tra != null && tra_index !== 0)
		// 		new_trainings_arr = new_trainings_arr.concat(tra);
		// });

		// get_x_sq_&_x_y(new_trainings_arr)
		// new_trainings_arr.forEach((tra, tra_index) => {
		// 	tra.x_sq = (tra_index + 1) ** 2;
		// 	tra.x_y = tra.improvement_rating * (tra_index + 1);
		// });
		// const sum = {
		// 	x: 0,
		// 	y: 0,
		// 	x_sq: 0,
		// 	x_y: 0,
		// };
		// // get_sum_of_all(new_trainings_arr)
		// new_trainings_arr.forEach((tra, tra_index) => {
		// 	sum.x += tra_index + 1;
		// 	sum.y += tra.improvement_rating;
		// 	sum.x_sq += tra.x_sq;
		// 	sum.x_y += tra.x_y;
		// });

		// console.log(sum);
		// // function formula
		// const N = new_trainings_arr.length;
		// const denominator = N * sum.x_sq - sum.x ** 2;
		// const reg_a = (sum.y * sum.x_sq - sum.x * sum.x_y) / denominator;
		// const reg_b = (N * sum.x_y - sum.x * sum.y) / denominator;
		// console.log(N);
		// console.log(reg_a);
		// console.log(reg_b);

		// // get y values of reg line
		// new_trainings_arr.forEach((tra, tra_index) => {
		// 	const reg_y = reg_a + reg_b * (tra_index + 1);
		// 	tra.reg_y = reg_y;
		// 	tra.reg_y_rating_diff =
		// 		reg_b > 0
		// 			? tra.improvement_rating - reg_y
		// 			: reg_y - tra.improvement_rating;
		// });

		// console.log(new_trainings_arr);

		// // last part
		// const trainings_to_return = [];
		// // sort_array('reg_y_rating_diff',)
		// const sorted_arr = new_trainings_arr.map(tra => tra);
		// sorted_arr.sort((a, b) => b.reg_y_rating_diff - a.reg_y_rating_diff);

		// sorted_arr.forEach((tra_el, tra_el_index) => {
		// 	if (tra_el_index === 0) trainings_to_return.push(tra_el.name);
		// 	else {
		// 		if (tra_el.reg_y_rating_diff > 0) trainings_to_return.push(tra_el.name);
		// 	}
		// });
	});
	$(err_msg_string).hide();
});

$(document).on("change", bu_string, function () {
	// console.log($(bu_string).val());
	$("#recommended_table tbody").html(``);

	$("#recommended_table tbody").append(get_end_of_table_html("No data."));
	$(dept_string)
		.empty()
		.append('<option value="" selected disabled>Select a Department</option>');
	// clear kpi select
	$(kpi_select).empty();

	switch ($(bu_string).val()) {
		case "Circle Corporation Inc.":
			$(dept_string).append(`
            <option value="Corporate Human Resource & Organization Department">Corporate Human Resource & Organization Department</option>
            <option value="Finance & Treasury">Finance & Treasury</option>
			<option value="ICT">ICT</option>
            <option value="Accounting and Finance">Accounting and Finance</option>
            <option value="Supply Chain and Administration">Supply Chain and Administration</option>
      
        `);
			break;
		case "LNL Archipelago Minerals":
			$(dept_string).append(`
            <option value="Environment & Safety">Environment & Safety</option> 
            <option value="Functional Materials">Functional Materials</option>  
        `);
			break;
		case "Leonio Land":
			$(dept_string).append(`
            <option value="Real Estate Development">Real Estate Development</option> 
            <option value="General Contracting">General Contracting</option>  
        `);
			break;
		case "Petrolift":
			$(dept_string).append(`
            <option value="Technical">Technical</option> 
            <option value="Quality, Safety & Environmental">Quality, Safety & Environmental</option>  
        `);
			break;

		default:
			break;
	}
});

$(document).on("change", dept_string, function () {
	$("#recommended_table tbody").html(``);

	$("#recommended_table tbody").append(get_end_of_table_html("No data."));
	$(pos_string)
		.empty()
		.append('<option value="" selected disabled>Select a Position</option>');

	positionsList = [];

	employeeList.map(emp => {
		if ($("#dept_select").val().trim() == emp.department.trim()) {
			if (!positionsList.includes(emp.position.trim())) {
				$(pos_string).append(
					`<option value="${emp.position.trim()}">${emp.position.trim()}</option>`
				);
				positionsList.push(emp.position.trim());
			}
		}
	});
	// clear kpi select
	$(kpi_select).empty();
});

$(document).on("change", pos_string, function () {
	$("#recommended_table tbody").html(``);

	$("#recommended_table tbody").append(get_end_of_table_html("No data."));
	const bu = $(bu_string).val();
	const dept = $(dept_string).val();
	const pos = $(pos_string).val();
	// clear kpi select
	$(kpi_select).empty();

	$.get(`/get_kpi_list`, { bu, dept, pos }, function (data, err) {
		if (err != "success") return console.error(err);

		if (data.length !== 0) {
			let kpi_list_to_inject = ["All"];

			data.forEach(cycle_list => {
				cycle_list.forEach(kpi => kpi_list_to_inject.push(kpi.keyResAreas));
			});

			kpi_list_to_inject.forEach(kpi => {
				$(kpi_select).append(`<option value="${kpi}">${kpi}</option>`);
			});
		}
	});
	process_input();
});
// algo
$(document).on("change", spec_select, function () {
	$("#recommended_table tbody").html(``);

	$("#recommended_table tbody").append(get_end_of_table_html("No data."));
	if ($(spec_select).val() != "Exponential Smoothing") {
		$(a_value_div).hide();
		process_output();
	} else {
		$(a_value_div).show();
	}
});
$(document).on("change", kpi_select, function () {
	$("#recommended_table tbody").html(``);

	$("#recommended_table tbody").append(get_end_of_table_html("No data."));
	process_output();
});

$(document).on("change", filt_opt_select, function () {
	$("#recommended_table tbody").html(``);

	$("#recommended_table tbody").append(get_end_of_table_html("No data."));
	// console.log($(filt_opt_select).val());
	// console.log($(value_select_label)[0].innerHTML);
	// $(value_select).prop("disabled", false);
	$(err_msg_string).hide();
	switch ($(filt_opt_select).val()) {
		case "Equal or Below the Rating":
			$(value_select_label)[0].innerHTML = "Rating";
			$(value_select).attr("min", 1);
			$(value_select).attr("max", 5);
			$(value_select).val("");
			break;
		case "Below Percentile":
			$(value_select_label)[0].innerHTML = "Below Percentile";
			// $(value_select).prop("disabled", true);
			$(value_select).attr("min", 1);
			$(value_select).attr("max", 100);
			$(value_select).val("");
			break;
		case "Poor Performance":
			$(value_select_label)[0].innerHTML = "Cycles";
			$(value_select).attr("min", 2);
			$(value_select).attr("max", 100);
			$(value_select).val("");
			break;
	}
});

// $(document).on("keydown", value_select, async () => {
// 	console.log($(value_select).val());
// 	process_input();
// });
$(document).on("keyup", value_select, () => {
	$("#recommended_table tbody").html(``);

	$("#recommended_table tbody").append(get_end_of_table_html("No data."));
	// console.log("keyip[");
	let valid_value = true;
	$(err_msg_string).hide();
	switch ($(value_select_label)[0].innerHTML) {
		case "Rating":
			if ($(value_select).val() > 5 || $(value_select).val() < 1) {
				$(err_msg_val_string)[0].innerHTML = "1-5";
				$(err_msg_string).show();
				valid_value = false;
			}
			break;
		case "Below Percentile":
			if ($(value_select).val() > 100 || $(value_select).val() < 1) {
				$(err_msg_val_string)[0].innerHTML = "1-100";
				$(err_msg_string).show();
				valid_value = false;
			}
			break;
		case "Cycles":
			if ($(value_select).val() > 100 || $(value_select).val() < 2) {
				$(err_msg_val_string)[0].innerHTML = "2-100";
				$(err_msg_string).show();
				valid_value = false;
			}
			break;
	}
	if (valid_value) process_output();
	// console.log($(value_select).val());
});

// a value
$(document).on("keyup", a_value, () => {
	$("#recommended_table tbody").html(``);

	$("#recommended_table tbody").append(get_end_of_table_html("No data."));
	// console.log("keyip[");
	let valid_value = true;
	$(a_value_err_msg_string).hide();
	if ($(a_value).val() > 1 || $(a_value).val() < 0) {
		$(a_value_err_msg_val_string)[0].innerHTML = "0-1";
		$(a_value_err_msg_string).show();
		valid_value = false;
	}
	if (valid_value) process_output();
	// else {
	// 	console.log($(a_value).val());
	// }
	// console.log($(value_select).val());
});
