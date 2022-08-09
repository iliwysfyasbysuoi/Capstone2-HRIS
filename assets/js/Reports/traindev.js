// holds the id of the report
const reportId = document.getElementById("reportId");

//  canvas
const trainAttend = document.getElementById("train-attend").getContext("2d");
const trainComplete = document
  .getElementById("train-complete")
  .getContext("2d");
let trainAttendChart;
let trainCompleteChart;
const postEventAss = document.getElementById("post-event-ass").getContext("2d");
let postEventAssChart;

$(window).load(function () {
  // $("#reports").addClass("active-menu");
  const id = reportId.value;
  $.get(`/get-report-data/${id}`, function (data, err) {
    if (err != "success") return console.error(err);

    // console.log(data);
    // format data
    const present = data[0].data["DataArraytrain-attend"][0];
    const late = data[0].data["DataArraytrain-attend"][1];
    const absent = data[0].data["DataArraytrain-attend"][2];

    const completedTrainings = data[0].data["DataArraytrain-complete"][0];
    const totalTrainings = data[0].data["DataArraytrain-complete"][1];
    const trainingNames = data[0].data["trainEvalName"];
    if (!Array.isArray(trainingNames)) {
      trainingNames = [trainingNames];
    }
    const trainEval = data[0].data["trainEvalData"];
    // display descriptions
    $(`#train-attend-ta`).append(data[0].data["train-attend-ta-name"]);
    $(`#train-complete-ta`).append(data[0].data["train-complete-ta-name"]);
    $(`#post-event-ass-ta`).append(data[0].data["post-event-ass-ta-name"]);
    // chart
    const trainAttendConfig = chart(
      [
        `${data[0].data["trainrealStartDate"]} - ${data[0].data["trainrealEndDate"]}`,
      ],
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
  });
});
