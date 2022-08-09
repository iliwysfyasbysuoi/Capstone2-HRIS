// nominations
// date picker
const trainstartDate = document.getElementById("trainstartDate");
const trainendDate = document.getElementById("trainendDate");
// real date value holders
const trainrealStartDate = document.getElementById("trainrealStartDate");
const trainrealEndDate = document.getElementById("trainrealEndDate");
// canvas
const trainAttend = document.getElementById("train-attend").getContext("2d");
const trainComplete = document
  .getElementById("train-complete")
  .getContext("2d");
let trainAttendChart;
let trainCompleteChart;

// form data  holders
const presentForForm = document.getElementById("present");
const lateForForm = document.getElementById("late");
const absentForForm = document.getElementById("absent");
const completedTrainingsForForm = document.getElementById("completedTrainings");
const totalTrainingsForForm = document.getElementById("totalTrainings");

// evaluations
// date picker
const traevalstartDate = document.getElementById("traevalstartDate");
const traevalendDate = document.getElementById("traevalendDate");
// real date value holders
const traevalrealStartDate = document.getElementById("traevalrealStartDate");
const traevalrealEndDate = document.getElementById("traevalrealEndDate");
// canvas
const postEventAss = document.getElementById("post-event-ass").getContext("2d");
let postEventAssChart;

// eval date filter
$(document).on("click", "#traevalDateRange", function () {
  const startRange = traevalstartDate.value;
  const endRange = traevalendDate.value;
  // store date
  traevalrealStartDate.value = startRange;
  traevalrealEndDate.value = endRange;
  $.get(
    `/get-chart-data/training-development/training-evaluation/${startRange}/${endRange}`,
    function (data, err) {
      if (err != "success") return console.error(err);

      // console.log(data);
      const { programDataArr, trainingNames } = data;

      // format data
      const trainEval = formatChartData(programDataArr, "trainEval");
      // console.log(trainEval);

      // store form data
      trainEval.map((arr) => {
        $(`#post-event-ass`).append(
          `
          <input type="text" name="trainEvalData" value="${arr}" hidden/> 
          `
        );
      });
      trainingNames.map((arr) => {
        // console.log(arr);
        $(`#post-event-ass`).append(
          ` 
          <input type="text" name="trainEvalName" value="${arr}" hidden/>
          `
        );
      });
      // chart
      const trainEvalConfig = chart(
        [
          "Usefulness",
          "Adequacy",
          "Skills Practice",
          "Instructor Knowledge",
          "Instructor Delivery",
          "Facility",
          "AV Support",
          "Lecture Notes",
          "Duration",
        ],
        trainingNames.length,
        trainingNames,
        trainEval,
        barBGC,
        barBorC,
        [4],
        "bar",
        {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }
      );
      postEventAssChart.destroy();
      postEventAssChart = new Chart(postEventAss, trainEvalConfig);
    }
  );
});
// date input validation
$(document).on("change", "#trainstartDate", function () {
  trainendDate.min = trainstartDate.value;
});
$(document).on("change", "#trainendDate", function () {
  trainstartDate.max = trainendDate.value;
});
// date input validation
$(document).on("change", "#traevalstartDate", function () {
  traevalendDate.min = traevalstartDate.value;
});
$(document).on("change", "#traevalendDate", function () {
  traevalstartDate.max = traevalendDate.value;
});

// nominations date range filter
$(document).on("click", "#trainDateRange", function () {
  const startRange = trainstartDate.value;
  const endRange = trainendDate.value;
  // stpre date
  trainrealStartDate.value = startRange;
  trainrealEndDate.value = endRange;
  $.get(
    `/get-chart-data/training-development/training-nomination/${startRange}/${endRange}`,
    function (data, err) {
      if (err != "success") return console.error(err);
      // console.log(data);
      // console.log(data);
      const { present, late, absent, completedTrainings, totalTrainings } =
        data;
      // store form data
      presentForForm.value = present;
      lateForForm.value = late;
      absentForForm.value = absent;

      completedTrainingsForForm.value = completedTrainings;
      totalTrainingsForForm.value = totalTrainings;

      // chart
      const trainAttendConfig = chart(
        [`${startRange} - ${endRange}`],
        3,
        ["Present", "Late", "Absent"],

        [[present], [late], [absent]],
        barBGC,
        barBorC,
        [4],
        "bar",
        {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }
      );
      const trainCompleteConfig = chart(
        ["Completed", "Ongoing"],
        1,
        [``],
        [[completedTrainings, totalTrainings - completedTrainings]],
        // [[2, 1]],
        pieBGC,
        pieBorC,
        [4],
        "doughnut",
        {}
      );
      trainAttendChart.destroy();
      trainCompleteChart.destroy();
      trainAttendChart = new Chart(trainAttend, trainAttendConfig);
      trainCompleteChart = new Chart(trainComplete, trainCompleteConfig);
    }
  );
});

$(window).load(function () {
  $("#dashboard-report").addClass("active-menu");
  $.get(
    "/get-chart-data/training-development/training-nomination",
    function (data, err) {
      if (err != "success") return console.error(err);
      // console.log(data);
      const dateNow = new Date();
      const dateNowStr = dateNow.toISOString().substring(0, 10);
      trainendDate.value = dateNowStr;
      const date1YrAgo = new Date(
        dateNow.setFullYear(dateNow.getFullYear() - 1)
      )
        .toISOString()
        .substring(0, 10);
      trainstartDate.value = date1YrAgo;
      // store date
      trainrealEndDate.value = dateNowStr;
      trainrealStartDate.value = date1YrAgo;

      // console.log(data);
      const { present, late, absent, completedTrainings, totalTrainings } =
        data;
      // store form data
      presentForForm.value = present;
      lateForForm.value = late;
      absentForForm.value = absent;

      completedTrainingsForForm.value = completedTrainings;
      totalTrainingsForForm.value = totalTrainings;
      // cjart
      const trainAttendConfig = chart(
        [`${date1YrAgo} - ${dateNowStr}`],
        3,
        ["Present", "Late", "Absent"],

        [[present], [late], [absent]],
        barBGC,
        barBorC,
        [4],
        "bar",
        {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }
      );
      const trainCompleteConfig = chart(
        ["Completed", "Ongoing"],
        1,
        [``],
        [[completedTrainings, totalTrainings - completedTrainings]],
        pieBGC,
        pieBorC,
        [4],
        "doughnut",
        {}
      );
      trainAttendChart = new Chart(trainAttend, trainAttendConfig);
      trainCompleteChart = new Chart(trainComplete, trainCompleteConfig);
    }
  );
  $.get(
    "/get-chart-data/training-development/training-evaluation",
    function (data, err) {
      if (err != "success") return console.error(err);
      const dateNow = new Date();
      const dateNowStr = dateNow.toISOString().substring(0, 10);
      traevalendDate.value = dateNowStr;
      const date1YrAgo = new Date(
        dateNow.setFullYear(dateNow.getFullYear() - 1)
      )
        .toISOString()
        .substring(0, 10);
      traevalstartDate.value = date1YrAgo;
      // store date
      traevalrealEndDate.value = dateNowStr;
      traevalrealStartDate.value = date1YrAgo;

      // console.log(data);
      const { programDataArr, trainingNames } = data;

      // format data
      const trainEval = formatChartData(programDataArr, "trainEval");
      // store form data
      trainEval.map((arr) => {
        // console.log(arr);
        $(`#post-event-ass`).append(
          `
          <input type="text" name="trainEvalData" value="${arr}" hidden/> 
          `
        );
      });
      trainingNames.map((arr) => {
        // console.log(arr);
        $(`#post-event-ass`).append(
          ` 
          <input type="text" name="trainEvalName" value="${arr}" hidden/>
          `
        );
      });

      // chart
      const trainEvalConfig = chart(
        [
          "Usefulness",
          "Adequacy",
          "Skills Practice",
          "Instructor Knowledge",
          "Instructor Delivery",
          "Facility",
          "AV Support",
          "Lecture Notes",
          "Duration",
        ],
        trainingNames.length,
        trainingNames,
        trainEval,
        barBGC,
        barBorC,
        [4],
        "bar",
        {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }
      );
      postEventAssChart = new Chart(postEventAss, trainEvalConfig);
    }
  );
});
