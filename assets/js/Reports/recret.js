// holds the id of the report
const reportId = document.getElementById("reportId");
// canvas
const recSucRate = document.getElementById("rec-suc").getContext("2d");
const recProgRate = document.getElementById("rec-prog").getContext("2d");
let recSucRateChart;
let recProgRateChart;
const attrition = document.getElementById("attrition").getContext("2d");
let attrChart;
const exitInt = document.getElementById("exit-int").getContext("2d");
let exitIntChart;

$(window).load(function () {
  // $("#reports").addClass("active-menu");
  const id = reportId.value;
  $.get(`/get-report-data/${id}`, function (data, err) {
    if (err != "success") return console.error(err);
    // format data
    const recSucData = data[0].data["DataArrayrec-suc"];
    const recProgData = data[0].data["DataArrayrec-prog"];
    const attrData = data[0].data["DataArrayattrition"];
    const exitIntData = data[0].data["DataArrayexit-int"];
    // display descriptions
    $(`#rec-suc-ta`).append(data[0].data["rec-suc-ta-name"]);
    $(`#rec-prog-ta`).append(data[0].data["rec-prog-ta-name"]);
    $(`#attrition-ta`).append(data[0].data["attrition-ta-name"]);
    $(`#exit-int-ta`).append(data[0].data["exit-int-ta-name"]);
    //   console.log(recSucData);
    // chart
    const recSucRateConfig = chart(
      [
        "Accepted Applicants",
        "Rejected Applicants",
        "Other Applicants",
        "Total Applicants",
      ],
      1,
      [``],
      [[recSucData[0], recSucData[1], recSucData[2], recSucData[3]]],
      pieBGC,
      pieBorC,
      [4],
      "polarArea",
      {}
    );
    const recProgRateConfig = chart(
      ["Current Progress"],
      7,
      [
        "Pending (Assistant HR Manager)",
        "Pending Inverview (Assistant HR Manager)",
        "Pending (HR Partner)",
        "Pending Inverview (HR Partner)",
        "Pending (Department Head)",
        "Pending Inverview (Department Head)",
        "Pending (Business Unit Head)",
      ],
      [
        [recProgData[0]],
        [recProgData[1]],
        [recProgData[2]],
        [recProgData[3]],
        [recProgData[4]],
        [recProgData[5]],
        [recProgData[6]],
      ],
      barBGC,
      barBorC,
      [4],
      "bar",
      {}
    );
    const attrConfig = chart(
      ["Last 30 days"],
      3,
      ["Resignations", "Terminations", "Retirement"],
      [[attrData[0]], [attrData[1]], [attrData[2]]],
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

    const exitIntConfig = chart(
      [``],
      // [`${totalExitSurveys} Exit Surveys in Total`],
      9,
      [
        "Better Pay elsewhere",
        "Better Benefits elsewhere",
        "Better Job Opportunities elsewhere",
        "Commute",
        "Conflict with other Employees",
        "Family and Personal Reasons",
        "Relocation/Move",
        "Company Instability",
        "Others",
      ],
      [
        [exitIntData[0]],
        [exitIntData[1]],
        [exitIntData[2]],
        [exitIntData[3]],
        [exitIntData[4]],
        [exitIntData[5]],
        [exitIntData[6]],
        [exitIntData[7]],
        [exitIntData[8]],
      ],
      barBGC,
      barBorC,
      [4],
      "bar",
      {}
    );
    recSucRateChart = new Chart(recSucRate, recSucRateConfig);
    recProgRateChart = new Chart(recProgRate, recProgRateConfig);
    attrChart = new Chart(attrition, attrConfig);
    exitIntChart = new Chart(exitInt, exitIntConfig);
  });
});
