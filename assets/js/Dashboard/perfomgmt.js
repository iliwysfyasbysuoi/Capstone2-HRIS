/** start HTML date picker ng Employee Satisfaction Rating*/
const satisstartDate = document.getElementById("satisstartDate");
/** end HTML date picker ng Employee Satisfaction Rating*/
const satisendDate = document.getElementById("satisendDate");
/** value container ng start date picker ng Employee Satisfaction Rating*/
const satisrealStartDate = document.getElementById("satisrealStartDate");
/** value container ng end date picker ng Employee Satisfaction Rating*/
const satisrealEndDate = document.getElementById("satisrealEndDate");
/** canvas ng Employee Satisfaction Rating*/
const perfSatis = document.getElementById("emp-sat");
let perfSatisChart;
/** value container ng business unit filter ng Employee Satisfaction Rating*/
const satisRealbufilter = document.getElementById("realbufilter");
/** value container ng dept filter ng Employee Satisfaction Rating*/
const satisRealDptfilter = document.getElementById("realdptfilter");
/** business unit filter ng Employee Satisfaction Rating*/
const satisBufilter = document.getElementById("bufilter");
/** dept filter ng Employee Satisfaction Rating*/
const satisDptfilter = document.getElementById("dptfilter");
/** value container ng dept filter ng Performance Review*/
const revRealdptrevfilter = document.getElementById("realdptrevfilter");
/** value container ng position filter ng Performance Review*/
const revRealposrevfilter = document.getElementById("realposrevfilter");
/** dept filter ng Performance Review*/
const revDptrevfilter = document.getElementById("dptrevfilter");
/** position filter ng Performance Review*/
const revPosrevfilter = document.getElementById("posrevfilter");
// globals ng employee satisfaction
let satisfactionGlobal;
let cycleIdsArrGlobal;
let cycleObjGlobal;
let bUList;
let deptList;
/** start HTML date picker ng Performance Review*/
const reviewstartDate = document.getElementById("reviewstartDate");
/** end HTML date picker ng Performance Review*/
const reviewendDate = document.getElementById("reviewendDate");
/** value container start HTML date picker ng Performance Review*/
const reviewrealStartDate = document.getElementById("reviewrealStartDate");
/** value container end HTML date picker ng Performance Review*/
const reviewrealEndDate = document.getElementById("reviewrealEndDate");
/** canvas ng Performance Review*/
const perfRev = document.getElementById("perf-rev");
let perfRevChart;
//review form data holders hidden sa front end
const reviewRatingsForForm = document.getElementById("reviewRatings");
const reviewNamesForForm = document.getElementById("reviewNames");
// globals ng perfo review
let ratingsGlobal;
let ratingNamesGlobal;
let ratingPosGlobal;
let ratingDeptGlobal;
let deptrevList;
let posrevList;

/** date range application of perfo review */
$(document).on("click", "#reviewDateRange", () => {
	const start = reviewstartDate.value;
	const end = reviewendDate.value;
	reviewrealEndDate.value = end;
	reviewrealStartDate.value = start;
	$.get(
		`/get-chart-data/performance-management/perfo-review/${start}/${end}`,
		function (data, err) {
			if (err != "success") return console.error(err);
			// console.log(data);
			ratingsGlobal = data.ratings;
			ratingNamesGlobal = data.ratingNames;
			ratingPosGlobal = data.ratingPos;
			ratingDeptGlobal = data.ratingDept;

			// remove data list
			deptrevList.map(function (d) {
				$(`#dptrevfilter option[value="${d}"]`).remove();
			});
			deptrevList = [...new Set(data.ratingDept)];
			deptrevList.map(d =>
				$("#dptrevfilter").append(`<option value="${d}">${d}</option>`)
			);
			// remove  data list
			posrevList.map(function (p) {
				$(`#posrevfilter option[value="${p}"]`).remove();
			});
			posrevList = [...new Set(data.ratingPos)];
			posrevList.map(p =>
				$("#posrevfilter").append(`<option value="${p}">${p}</option>`)
			);
			// format data for chart
			let ratingsNameSet = new Set(data.ratingNames);
			const ratingsNameArr = [...ratingsNameSet];
			let ratingsArr = new Array(ratingsNameArr.length).fill(0);
			let ratingDivider = new Array(ratingsNameArr.length).fill(0);
			data.ratingNames.map((name, nameI) => {
				const index = ratingsNameArr.indexOf(name);
				ratingsArr[index] += data.ratings[nameI];
				++ratingDivider[index];
			});
			let formattedRatings = [];
			ratingsArr.map((rate, ratei) => {
				formattedRatings.push(rate / ratingDivider[ratei]);
			});
			// store data for submission
			reviewRatingsForForm.value = formattedRatings;
			reviewNamesForForm.value = data.ratingsNameArr;
			// chart
			perfRevChart.destroy();
			const perfRevConfig = chart(
				ratingsNameArr,
				1,
				[`${start} - ${end}`],
				[formattedRatings],
				barBGC,
				barBorC,
				[4],
				"bar",
				{
					scale: {
						max: 5,
					},
				}
			);
			perfRevChart = new Chart(perfRev, perfRevConfig);
		}
	);
});

/** date range application of emp satisfaction */
$(document).on("click", "#satisDateRange", () => {
	const start = satisstartDate.value;
	const end = satisendDate.value;
	$.get(
		`/get-chart-data/performance-management/perfo-appraisal/${start}/${end}`,
		function (data, err) {
			if (err != "success") return console.error(err);
			// reset filter
			satisRealbufilter.value = "All Business Units";
			satisRealDptfilter.value = "All Departments";
			// store date
			satisrealEndDate.value = end;
			satisrealStartDate.value = start;

			let { satisfaction, cycleIdsArr, cycleObj } = data;
			//update dropdown options
			let setBU = new Set();
			let setDept = new Set();
			cycleObj.map(d => {
				setBU.add(d.bU);
				setDept.add(d.dept);
			});
			// remove data list
			bUList.map(function (b) {
				$(`#bufilter option[value="${b}"]`).remove();
			});
			bUList = [...setBU];
			bUList.map(b =>
				$("#bufilter").append(`<option value="${b}">${b}</option>`)
			);
			// remove  data list
			deptList.map(function (d) {
				$(`#dptfilter option[value="${d}"]`).remove();
			});
			deptList = [...setDept];
			deptList.map(d =>
				$("#dptfilter").append(`<option value="${d}">${d}</option>`)
			);

			//  store data to globals
			satisfactionGlobal = satisfaction;
			cycleIdsArrGlobal = cycleIdsArr;
			cycleObjGlobal = cycleObj;
			// format data for chart
			const satisfactionLabelsFormatted = formatChartData(
				{ cycleIdsArrGlobal, cycleObjGlobal },
				"satisfactionLabels"
			);
			const satisfactionDataFormatted = formatChartData(
				satisfaction,
				"satisfactionData"
			);

			const satisfactionDataCompressed = formatChartData(
				{ satisfactionDataFormatted, cycleIdsArrGlobal },
				"satisfactionCompress"
			);

			// chart
			perfSatisChart.destroy();
			const satisConfig = chart(
				[
					["Clear Role", "Assignment"],
					["Opportunities", "Explore Skills"],
					"Treatment",
					"Recognition",
					"Work-Life Balance",
					["Empowered by", "Supervisor/Manager"],
					"Teamwork",
				],
				satisfactionDataCompressed.length,
				satisfactionLabelsFormatted,
				satisfactionDataCompressed,
				barBGC,
				barBorC,
				[4],
				"bar",
				{
					scales: {
						y: {
							ticks: {
								//para malagyan % ung number label
								callback: function (value, index, values) {
									return value + "%";
								},
							},
						},
					},
				}
			);
			perfSatisChart = new Chart(perfSatis, satisConfig);
		}
	);
});

// date input validation
$(document).on("change", "#satisstartDate", function () {
	satisendDate.min = satisstartDate.value;
});
$(document).on("change", "#satisendDate", function () {
	satisstartDate.max = satisendDate.value;
});
$(document).on("change", "#reviewstartDate", function () {
	reviewendDate.min = reviewstartDate.value;
});
$(document).on("change", "#reviewendDate", function () {
	reviewstartDate.max = reviewendDate.value;
});

// emp satisfaction filter application
$(document).on("click", "#buDeptFilterBtn", () => {
	const satisBufilterQ = satisBufilter.value;
	const satisDptfilterQ = satisDptfilter.value;
	// store filter applied
	satisRealbufilter.value = satisBufilterQ;
	satisRealDptfilter.value = satisDptfilterQ;
	// console.log("satisRealbufilter.value", satisRealbufilter.value);
	// console.log("satisRealDptfilter.value", satisRealDptfilter.value);

	// console.log(validIds);

	// filter data
	let validIds = new Set();
	cycleObjGlobal.map(d => {
		if (
			(satisDptfilterQ === "All Departments"
				? true
				: d.dept === satisDptfilterQ) &&
			(satisBufilterQ === "All Business Units" ? true : d.bU === satisBufilterQ)
		) {
			validIds.add(d.cycleId);
		}
	});
	// console.log(validIds);

	// format and chart data
	cycleIdsArr = [...validIds];
	cycleIdsArrGlobal = cycleIdsArr;
	// console.log("cycleIdsArr", cycleIdsArr);
	// console.log(cycleIdsArr.length);

	perfSatisChart.destroy();

	if (cycleIdsArr.length) {
		const satisfactionLabelsFormatted = formatChartData(
			{ cycleIdsArrGlobal, cycleObjGlobal },
			"satisfactionLabels"
		);
		const satisfactionDataFormatted = formatChartData(
			satisfactionGlobal,
			"satisfactionData"
		);

		const satisfactionDataCompressed = formatChartData(
			{ satisfactionDataFormatted, cycleIdsArrGlobal },
			"satisfactionCompress"
		);

		// chart
		const satisConfig = chart(
			[
				["Clear Role", "Assignment"],
				["Opportunities", "Explore Skills"],
				"Treatment",
				"Recognition",
				"Work-Life Balance",
				["Empowered by", "Supervisor/Manager"],
				"Teamwork",
			],
			satisfactionDataCompressed.length,
			satisfactionLabelsFormatted,
			satisfactionDataCompressed,
			barBGC,
			barBorC,
			[4],
			"bar",
			{
				scales: {
					y: {
						ticks: {
							callback: function (value, index, values) {
								return value + "%";
							},
						},
					},
				},
			}
		);

		perfSatisChart = new Chart(perfSatis, satisConfig);
	}
});

// perfo review filter application
$(document).on("click", "#deptPosFilterBtn", () => {
	const revDptrevfilterQ = revDptrevfilter.value;
	const revPosrevfilterQ = revPosrevfilter.value;
	// store filter data
	revRealdptrevfilter.value = revDptrevfilterQ;
	revRealposrevfilter.value = revPosrevfilterQ;
	// console.log("revRealdptrevfilter.value", revRealdptrevfilter.value);
	// console.log("revRealposrevfilter.value", revRealposrevfilter.value);

	// filter data
	let validNames = new Set();
	ratingNamesGlobal.map((r, ri) => {
		if (
			(revDptrevfilterQ === "All Departments"
				? true
				: ratingDeptGlobal[ri] === revDptrevfilterQ) &&
			(revPosrevfilterQ === "All Positions"
				? true
				: ratingPosGlobal[ri] === revPosrevfilterQ)
		) {
			validNames.add(r);
		}
	});

	// format data
	const ratingsNameArr = [...validNames];
	let ratingsArr = new Array(ratingsNameArr.length).fill(0);
	let ratingDivider = new Array(ratingsNameArr.length).fill(0);
	ratingNamesGlobal.map((name, nameI) => {
		const index = ratingsNameArr.indexOf(name);
		ratingsArr[index] += ratingsGlobal[nameI];
		++ratingDivider[index];
	});
	let formattedRatings = [];
	ratingsArr.map((rate, ratei) => {
		formattedRatings.push(rate / ratingDivider[ratei]);
	});
	// store data for form submission
	reviewRatingsForForm.value = formattedRatings;
	reviewNamesForForm.value = ratingsNameArr;
	// chart
	perfRevChart.destroy();
	const perfRevConfig = chart(
		ratingsNameArr,
		1,
		[`${satisstartDate.value} - ${satisendDate.value}`],
		[formattedRatings],
		barBGC,
		barBorC,
		[4],
		"bar",
		{
			scale: {
				max: 5,
			},
		}
	);
	perfRevChart = new Chart(perfRev, perfRevConfig);
});

$(window).load(function () {
	$("#dashboard-report").addClass("active-menu");
	$.get(
		`/get-chart-data/performance-management/perfo-review`,
		function (data, err) {
			if (err != "success") return console.error(err);
			// console.log("success");
			// console.log(data);

			// store date
			const dateNow = new Date();
			const dateNowStr = dateNow.toISOString().substring(0, 10);
			reviewendDate.value = dateNowStr;
			const date1YrAgo = new Date(
				dateNow.setFullYear(dateNow.getFullYear() - 1)
			)
				.toISOString()
				.substring(0, 10);
			reviewstartDate.value = date1YrAgo;
			//  real date to be read when submitted
			reviewrealEndDate.value = dateNowStr;
			reviewrealStartDate.value = date1YrAgo;
			// console.log(data);

			// store to globals
			ratingsGlobal = data.ratings;
			ratingNamesGlobal = data.ratingNames;
			ratingPosGlobal = data.ratingPos;
			ratingDeptGlobal = data.ratingDept;

			// update filter
			posrevList = [...new Set(data.ratingPos)];
			posrevList.map(p =>
				$("#posrevfilter").append(`<option value="${p}">${p}</option>`)
			);
			deptrevList = [...new Set(data.ratingDept)];
			deptrevList.map(d =>
				$("#dptrevfilter").append(`<option value="${d}">${d}</option>`)
			);

			// format data
			let ratingsNameSet = new Set(data.ratingNames);
			// console.log(data.ratingNames);
			// console.log(ratingsNameSet);
			const ratingsNameArr = [...ratingsNameSet];
			let ratingsArr = new Array(ratingsNameArr.length).fill(0);
			let ratingDivider = new Array(ratingsNameArr.length).fill(0);
			data.ratingNames.map((name, nameI) => {
				const index = ratingsNameArr.indexOf(name);
				ratingsArr[index] += data.ratings[nameI];
				++ratingDivider[index];
			});
			let formattedRatings = [];
			ratingsArr.map((rate, ratei) => {
				formattedRatings.push(rate / ratingDivider[ratei]);
			});
			// store data for form submission
			reviewRatingsForForm.value = formattedRatings;
			reviewNamesForForm.value = ratingsNameArr;
			// chart
			const perfRevConfig = chart(
				ratingsNameArr,
				1,
				[`${date1YrAgo} - ${dateNowStr}`],
				[formattedRatings],
				barBGC,
				barBorC,
				[4],
				"bar",
				{
					scale: {
						max: 5,
					},
				}
			);
			perfRevChart = new Chart(perfRev, perfRevConfig);
		}
	);
	$.get(
		"/get-chart-data/performance-management/perfo-appraisal",
		function (data, err) {
			if (err != "success") return console.error(err);
			// console.log("data", data);

			// store date
			const dateNow = new Date();
			const dateNowStr = dateNow.toISOString().substring(0, 10);
			satisendDate.value = dateNowStr;
			const date1YrAgo = new Date(
				dateNow.setFullYear(dateNow.getFullYear() - 1)
			)
				.toISOString()
				.substring(0, 10);
			satisstartDate.value = date1YrAgo;

			//  real date to be read when submitted
			satisrealEndDate.value = dateNowStr;
			satisrealStartDate.value = date1YrAgo;

			let { satisfaction, cycleIdsArr, cycleObj } = data;
			// store to globals
			satisfactionGlobal = satisfaction;
			cycleIdsArrGlobal = cycleIdsArr;
			cycleObjGlobal = cycleObj;

			//update dropdown options
			let setBU = new Set();
			let setDept = new Set();
			cycleObj.map(d => {
				setBU.add(d.bU);
				setDept.add(d.dept);
			});
			bUList = [...setBU];
			bUList.map(b =>
				$("#bufilter").append(`<option value="${b}">${b}</option>`)
			);
			deptList = [...setDept];
			deptList.map(d =>
				$("#dptfilter").append(`<option value="${d}">${d}</option>`)
			);

			// store and format data
			const satisfactionLabelsFormatted = formatChartData(
				{ cycleIdsArrGlobal, cycleObjGlobal },
				"satisfactionLabels"
			);
			// console.log(cycleIdsArrGlobal);
			// console.log(cycleObjGlobal);
			// console.log("satisfactionLabelsFormatted", satisfactionLabelsFormatted);
			const satisfactionDataFormatted = formatChartData(
				satisfaction,
				"satisfactionData"
			);

			const satisfactionDataCompressed = formatChartData(
				{ satisfactionDataFormatted, cycleIdsArrGlobal },
				"satisfactionCompress"
			);

			// hidden input to hold graph value for form submission
			satisfactionDataCompressed.map(arr => {
				// console.log(arr);
				$(`#emp-sat`).append(
					` 
          <input type="text" name="satisData" value="${arr}" hidden/>
          `
				);
			});
			satisfactionLabelsFormatted.map(arr => {
				// console.log(arr);
				$(`#emp-sat`).append(
					` 
          <input type="text" name="satisName" value="${arr}" hidden/>
          `
				);
			});
			// char ta
			const satisConfig = chart(
				[
					["Clear Role", "Assignment"],
					["Opportunities", "Explore Skills"],
					"Treatment",
					"Recognition",
					"Work-Life Balance",
					["Empowered by", "Supervisor/Manager"],
					"Teamwork",
				],
				satisfactionDataCompressed.length,
				satisfactionLabelsFormatted,
				satisfactionDataCompressed,
				barBGC,
				barBorC,
				[4],
				"bar",
				{
					scales: {
						y: {
							ticks: {
								callback: function (value, index, values) {
									return value + "%";
								},
							},
						},
					},
				}
			);
			perfSatisChart = new Chart(perfSatis, satisConfig);
		}
	);
});
