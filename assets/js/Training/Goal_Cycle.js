function Goal_Cycle({ _id, listOfCycles, performanceRatings, trainings_mod }) {
	// console.log(_id)
	// console.log(listOfCycles)
	// console.log(performanceRatings)
	const goal_cycle = {
		id: _id,
		list_of_cycles: listOfCycles,
		list_of_kpi: listOfCycles.map(c => c.keyResAreas),
		performance_ratings: performanceRatings,
		trainings_mod,
		cycles: [],
		// mean_imp_rating: 0,
	};
	// structure cycle matrixes
	performanceRatings.forEach((per, per_index) => {
		// matrix header
		goal_cycle.cycles[per_index] = [["Employees"]];
		goal_cycle.list_of_kpi.forEach(kpi =>
			goal_cycle.cycles[per_index][0].push(kpi)
		);
		// employees and ratings
		per.employees.forEach(emp => {
			let row = [];
			row.push(emp.userId);
			emp.ratings.forEach(r => row.push(r.rating));

			goal_cycle.cycles[per_index].push(row);
		});
	});

	// console.log("trainings_mod", trainings_mod);

	// console.log("goal_cycle.cycles", goal_cycle.cycles);
	// console.log("last cycle", goal_cycle.cycles[goal_cycle.cycles.length - 1]);
	// function console_log_cycle_matrixes() {
	// 	console.log("goal_cycle.cycles", goal_cycle.cycles);
	// }
	/**
	 *
	 * @param {*} str_case
	 * @param {*} arr
	 * @returns a sorted array depending on the case
	 */
	function sort_array(str_case, arr) {
		const sorted_arr = arr.map(tra => tra);
		switch (str_case) {
			case "improvement_rating":
				sorted_arr.sort((a, b) => a.improvement_rating - b.improvement_rating);
				break;
			case "reg_y_rating_diff":
				sorted_arr.sort((a, b) => b.reg_y_rating_diff - a.reg_y_rating_diff);
				break;
			default:
				break;
		}
		return sorted_arr;
	}
	/**
	 *
	 * @param {*} arr array of arrays
	 * @returns concatenated one dimensional array
	 */
	function get_all_trainings(arr) {
		let new_arr = [];
		arr.forEach((tra, tra_index) => {
			if (tra != null && tra_index !== 0) {
				new_arr = new_arr.concat(tra);
			}
		});

		return new_arr;
	}

	function get_mean(arr) {
		// get mean of improvement rating
		let mean_imp_rating = 0;
		let valid_training = 0;
		arr.forEach((tra, tra_index) => {
			if (tra != null && tra_index !== 0) {
				tra.forEach(tra_el => {
					if (isNaN(tra_el.improvement_rating)) return;
					mean_imp_rating += tra_el.improvement_rating;
					valid_training++;
				});
			}
		});
		// console.log(mean_imp_rating / valid_training);
		return mean_imp_rating / valid_training;
	}

	/**
	 *
	 * @param {*} kpi_select ('All' or a specific KPI)
	 * @process structure trainings -> loop through cycles and training arrays
	 * @returns list of trainings having an improvement rating above the mean
	 */
	function training_improvement_rating_above(algorithm, kpi_select, a) {
		// const kpi_select = "All";
		// structure trainings
		trainings_mod.forEach((tra, tra_index) => {
			//skip first element
			if (tra_index === 0 || tra == null) return;
			// loop through every training in a specific cycle
			tra.forEach((tra_el, tra_el_index) => {
				// to only target the kpi list of the training
				let kpi_indexes = [];
				// get the kpi list of the training and the kpi that matches the
				//   goal cycle
				tra_el.kpi_list.forEach(tra_kpi => {
					goal_cycle.list_of_kpi.every((kpi_str, kpi_str_index) => {
						// kpi filter is All
						if (kpi_select === "All") {
							if (kpi_str === tra_kpi) {
								kpi_indexes.push(kpi_str_index + 1);
								return false;
							}
							return true;
						}
						// kpi filter is a specific KPI
						if (kpi_str === tra_kpi && kpi_select === tra_kpi) {
							kpi_indexes.push(kpi_str_index + 1);
							return false;
						}
						return true;
					});
				});
				// console.log("kpi_indexes", kpi_indexes);

				// get ratings to calculate improvement rating
				let improvement_rating = 0;
				tra_el.employees.forEach(emp => {
					// use tra_index to match cycle
					goal_cycle.cycles[tra_index].forEach((row, row_index) => {
						if (row[0] === emp) {
							let improvement_rating_for_emp = 0;
							kpi_indexes.forEach(i => {
								const prev = goal_cycle.cycles[tra_index - 1][row_index][i];
								const current = goal_cycle.cycles[tra_index][row_index][i];
								improvement_rating_for_emp += current - prev;
								// console.log("prev", prev);
								// console.log("current", current);
							});

							// console.log("improvement_rating", improvement_rating);
							// console.log("kpi_indexes.length", kpi_indexes.length);
							improvement_rating_for_emp /= kpi_indexes.length;
							improvement_rating += improvement_rating_for_emp;
							// console.log(
							// 	`calculated improvement_rating for ${emp}`,
							// 	improvement_rating_for_emp
							// );
						}
					});
				});
				// console.log("tra_el.employees.length", tra_el.employees.length);
				// console.log("improvement_rating", improvement_rating);
				improvement_rating /= tra_el.employees.length;
				trainings_mod[tra_index][tra_el_index].improvement_rating =
					improvement_rating;
				// console.log(`calculated improvement_rating`, improvement_rating);
			});
		});

		let trainings_to_return = [];
		let limit;
		switch (algorithm) {
			case "Mean":
				limit = get_mean(trainings_mod);
				break;
			case "Median":
				const arr = sort_array(
					"improvement_rating",
					get_all_trainings(trainings_mod)
				);

				// console.log(sorted_arr);
				const arr_length = arr.length;
				const mid_point = arr_length / 2;
				let median;
				if (Number.isInteger(mid_point)) {
					median =
						(arr[mid_point].improvement_rating +
							arr[mid_point - 1].improvement_rating) /
						2;
				} else {
					median = arr[mid_point - 0.5].improvement_rating;
				}
				limit = median;
				break;
			case "Mode":
				const arr_mode = sort_array(
					"improvement_rating",
					get_all_trainings(trainings_mod)
				);
				const counter = {};
				arr_mode.forEach(tra => {
					if (!counter[tra.improvement_rating])
						counter[tra.improvement_rating] = 1;
					else counter[tra.improvement_rating] += 1;
				});
				// console.log(counter);

				let highestValue = 0;
				// let highestValueKey = -Infinity;
				for (let key in counter) {
					const value = counter[key];
					if (value > highestValue) {
						highestValue = value;
						// highestValueKey = key;
					}
				}
				let mode;
				const keys = Object.keys(counter);
				keys.every(key => {
					if (counter[key] === highestValue) {
						mode = key;
						return false;
					}
					return true;
				});
				limit = mode;
				break;
			case `Exponential Smoothing`:
				const mean = get_mean(trainings_mod);
				const arr_exp_s = sort_array(
					"improvement_rating",
					get_all_trainings(trainings_mod)
				);
				let max = -4;
				arr_exp_s.forEach((tra, tra_index) => {
					let forecast;
					if (tra_index === 0) {
						arr_exp_s[tra_index].forecast = mean;
						forecast = mean;
					} else {
						forecast = tra.forecast;
					}
					if (tra_index !== arr_exp_s.length - 1) {
						const final_forecast =
							a * tra.improvement_rating + (1 - a) * forecast;
						arr_exp_s[tra_index + 1].forecast = final_forecast;
						if (final_forecast > max) max = final_forecast;
						// console.log(
						// 	`forecast = ${α}*${tra.improvement_rating} + ${1 - α}* ${forecast}`
						// );
					}
				});
				arr_exp_s.forEach(tra_el => {
					if (tra_el.forecast >= max) trainings_to_return.push(tra_el._id);
				});
				break;
			case `Regression Line`:
				const reg_arr = get_all_trainings(trainings_mod);
				if (reg_arr.length == 0 || reg_arr.length == 1) {
					trainings_to_return = reg_arr;
				} else {
					// get x squared and xy
					reg_arr.forEach((tra, tra_index) => {
						tra.x_sq = (tra_index + 1) ** 2;
						tra.x_y = tra.improvement_rating * (tra_index + 1);
					});

					const sum = {
						x: 0,
						y: 0,
						x_sq: 0,
						x_y: 0,
					};
					reg_arr.forEach((tra, tra_index) => {
						sum.x += tra_index + 1;
						sum.y += tra.improvement_rating;
						sum.x_sq += tra.x_sq;
						sum.x_y += tra.x_y;
					});

					const N = reg_arr.length;
					const denominator = N * sum.x_sq - sum.x ** 2;
					const reg_a = (sum.y * sum.x_sq - sum.x * sum.x_y) / denominator;
					const reg_b = (N * sum.x_y - sum.x * sum.y) / denominator;

					// get y values of reg line
					reg_arr.forEach((tra, tra_index) => {
						const reg_y = reg_a + reg_b * (tra_index + 1);
						tra.reg_y = reg_y;
						tra.reg_y_rating_diff =
							reg_b > 0
								? tra.improvement_rating - reg_y
								: reg_y - tra.improvement_rating;
					});
					const final_reg_arr = sort_array("reg_y_rating_diff", reg_arr);
					final_reg_arr.forEach((tra_el, tra_el_index) => {
						if (tra_el_index === 0) trainings_to_return.push(tra_el._id);
						else {
							if (tra_el.reg_y_rating_diff > 0)
								trainings_to_return.push(tra_el._id);
						}
					});
				}
				break;
			case `Mann-Kendall Trend Test`:
				const mann_arr = get_all_trainings(trainings_mod);
				if (mann_arr.length == 0 || mann_arr.length == 1) {
					trainings_to_return = mann_arr;
				} else {
					// get x squared and xy
					mann_arr.forEach((tra, tra_index) => {
						tra.x_sq = (tra_index + 1) ** 2;
						tra.x_y = tra.improvement_rating * (tra_index + 1);
					});

					const sum = {
						x: 0,
						y: 0,
						x_sq: 0,
						x_y: 0,
					};
					mann_arr.forEach((tra, tra_index) => {
						sum.x += tra_index + 1;
						sum.y += tra.improvement_rating;
						sum.x_sq += tra.x_sq;
						sum.x_y += tra.x_y;
					});

					const N = mann_arr.length;
					const denominator = N * sum.x_sq - sum.x ** 2;
					const reg_a = (sum.y * sum.x_sq - sum.x * sum.x_y) / denominator;
					const reg_b = (N * sum.x_y - sum.x * sum.y) / denominator;

					// get y values of reg line
					mann_arr.forEach((tra, tra_index) => {
						const reg_y = reg_a + reg_b * (tra_index + 1);
						tra.reg_y = reg_y;
						tra.reg_y_rating_diff =
							reg_b > 0
								? tra.improvement_rating - reg_y
								: reg_y - tra.improvement_rating;
					});
					const final_mann_arr = sort_array("reg_y_rating_diff", mann_arr);
					final_mann_arr.forEach((tra_el, tra_el_index) => {
						if (tra_el_index === 0) trainings_to_return.push(tra_el._id);
						else {
							if (tra_el.reg_y_rating_diff > 0)
								trainings_to_return.push(tra_el._id);
						}
					});
				}
				break;
			default:
				break;
		}
		if (
			algorithm !== "Exponential Smoothing" ||
			algorithm !== "Mann-Kendall Trend Test" ||
			algorithm !== "Regression Line"
		)
			trainings_mod.forEach(tra_arr => {
				if (tra_arr) {
					tra_arr.forEach(tra_el => {
						if (tra_el.improvement_rating >= limit)
							trainings_to_return.push(tra_el._id);
					});
				}
			});

		// console.log(
		// 	"trainings_above_or_eq_to_the_mean",
		// 	trainings_above_or_eq_to_the_mean
		// );
		console.log("goal_cycle", goal_cycle);
		return trainings_to_return;
	}
	/**
	 *
	 * @param {*} ALL_KPI
	 * @param {*} kpi_input
	 * @param {*} arr
	 * @returns a list of employees having ave ratings with respect to the kpi input
	 */
	function extract_emp_ratings(ALL_KPI, kpi_input, arr) {
		// if ever kpi is specific
		let kpi_index;
		let list_of_employees_to_return = [];
		// check last cycle matrix

		arr.forEach((row, row_index) => {
			if (row_index === 0) {
				if (!ALL_KPI) kpi_index = row.indexOf(kpi_input, 1);
				return;
			}

			const employee_obj = {};
			employee_obj.user_id = row[0];

			if (ALL_KPI) {
				// remove emp_id
				const new_row = row.slice(1);
				// add all the ratings of the emp
				const total_ratings = new_row.reduce((tot, item) => item + tot, 0);
				// ave sum
				employee_obj.final_total = total_ratings / new_row.length;
			}
			// just get the rating of the specific kpi
			else employee_obj.final_total = row[kpi_index];

			list_of_employees_to_return.push(employee_obj);
		});
		return list_of_employees_to_return;
	}

	function get_employees(filter_option, value, kpi_select) {
		let final_emp_list = [];
		const ALL_KPI = kpi_select === "All";
		const list_of_emp = extract_emp_ratings(
			ALL_KPI,
			kpi_select,
			goal_cycle.cycles[goal_cycle.cycles.length - 1]
		);
		// console.log("list_of_emp", list_of_emp);
		// let kpi_index;
		switch (filter_option) {
			// return employees who have an average rating equal or below value
			case "Equal or Below the Rating":
				const rating = value;
				final_emp_list = list_of_emp.filter(item => item.final_total <= rating);
				break;
			case "Below Percentile":
				const PERCENTAGE = value / 100;
				let average = 0;
				list_of_emp.forEach(emp => {
					// average += 5; // test
					average += emp.final_total;
				});
				// ave the sum
				average /= list_of_emp.length;
				// get list of emp below ave
				const list_of_emp_below_ave = list_of_emp.filter(
					emp => emp.final_total < average
				);
				const COUNT_OF_EMP_BELOW_AVE = list_of_emp_below_ave.length;

				if (COUNT_OF_EMP_BELOW_AVE <= 1) {
					final_emp_list = list_of_emp_below_ave;
					break;
				}

				const COUNT_OF_EMP_TO_RETURN = Math.ceil(
					COUNT_OF_EMP_BELOW_AVE * PERCENTAGE
				);
				// console.log(
				// 	`COUNT_OF_EMP_TO_RETURN = Math.ceil(${COUNT_OF_EMP_BELOW_AVE} * ${PERCENTAGE})`,
				// 	COUNT_OF_EMP_TO_RETURN
				// );
				const desc_sort_list_of_emp = list_of_emp_below_ave.sort(
					(a, b) => b.final_total - a.final_total
				);
				final_emp_list = desc_sort_list_of_emp.slice(-COUNT_OF_EMP_TO_RETURN);
				break;

			case "Poor Performance":
				if (value > goal_cycle.cycles.length) return [];
				// const cycles_limit = value - 1
				// goal_cycle.cycles.
				// console.log("list_of_emp", list_of_emp);
				const cycles_arr = goal_cycle.cycles.map(c => c);
				cycles_arr.reverse();
				let past_lists = [];
				cycles_arr.map((cycle, cycle_index) => {
					if (cycle_index !== 0 && cycle_index < value)
						past_lists.push(extract_emp_ratings(ALL_KPI, kpi_select, cycle));
				});
				const new_list_of_emp = [list_of_emp].concat(past_lists);
				// console.log("new_list_of_emp", new_list_of_emp);
				new_list_of_emp.forEach((c, c_index) => {
					if (c_index < new_list_of_emp.length - 1)
						c.forEach((e, e_index) => {
							const improvement =
								e.final_total -
								new_list_of_emp[c_index + 1][e_index].final_total;
							// console.log("improvement", improvement);
							list_of_emp[e_index].final_total = improvement;
						});
				});
				const divider = new_list_of_emp.length - 1;
				list_of_emp.forEach((emp, emp_index) => {
					list_of_emp[emp_index].final_total = emp.final_total / divider;
				});

				// console.log("list_of_emp", list_of_emp);
				final_emp_list = list_of_emp.filter(item => item.final_total < 0);
				break;
			default:
				break;
		}
		return final_emp_list;
	}

	return {
		...goal_cycle,
		training_improvement_rating_above,
		get_employees,
		// console_log_cycle_matrixes,
	};
}
