// holds the id of the report
const reportId = document.getElementById("reportId");
// canvas
const perfSatis = document.getElementById("emp-sat");
let perfSatisChart;
// filter value holders
const satisRealbufilter = document.getElementById("realbufilter");
const satisRealDptfilter = document.getElementById("realdptfilter");
// canvas
const perfRev = document.getElementById("perf-rev");
let perfRevChart;

$(window).load(function () {
  // $("#reports").addClass("active-menu");
  const id = reportId.value;
  $.get(`/get-report-data/${id}`, function (data, err) {
    if (err != "success") return console.error(err);
    // console.log(data);
    // format data
    let perfSatisData = data[0].data["satisData"];
    perfSatisDataArr = [];
    if (Array.isArray(perfSatisData)) {
      perfSatisData.map((s) => perfSatisDataArr.push(s.split(",")));
      perfSatisData = perfSatisDataArr;
    } else perfSatisData = [perfSatisData.split(",")];

    let perfSatisLabel = data[0].data["satisName"];
    if (!Array.isArray(perfSatisLabel)) {
      perfSatisLabel = [perfSatisLabel];
    }
    let perfRevData = data[0].data["DataArrayperf-rev"][0];
    perfRevData = perfRevData.split(",");
    let perfRevLabel = data[0].data["DataArrayperf-rev"][1];
    perfRevLabel = perfRevLabel.split(",");
    // if (!Array.isArray(perfRevLabel)) {
    //   perfRevLabel = perfRevLabel;
    // }
    // display descriptions
    $(`#emp-sat-ta`).append(data[0].data["emp-sat-ta-name"]);
    $(`#perf-rev-ta`).append(data[0].data["perf-rev-ta-name"]);
    // console.log(perfSatisData);
    // console.log(perfSatisLabel);

    // display filter values
    $(`#bufilter`).append(`
     <option selected>${data[0].data["realbufilterName"]}</option>
     `);
    $(`#dptfilter`).append(`
     <option selected>${data[0].data["realdptfilterName"]}</option>
     `);
    $(`#dptrevfilter`).append(`
     <option selected>${data[0].data["realdptrevfilterName"]}</option>
     `);
    $(`#posrevfilter`).append(`
     <option selected>${data[0].data["realposrevfilterName"]}</option>
     `);
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
      perfSatisLabel.length,
      perfSatisLabel,
      perfSatisData,
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

    const perfRevConfig = chart(
      perfRevLabel,
      1,
      [
        `${data[0].data["satisrealStartDate"]} - ${data[0].data["satisrealEndDate"]}`,
      ],
      [perfRevData],
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
});
