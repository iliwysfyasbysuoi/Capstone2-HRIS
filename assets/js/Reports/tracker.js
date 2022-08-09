// const reportsFilter = document.getElementById("reports-filter");
/**to hold data for filtering */
let reportsGlobal;
$(window).load(function () {
  $("#reports").addClass("active-menu");
  // get reports from db
  $.get(`/get-report-data`, (data, err) => {
    if (err !== "success") console.error(err);
    reportsGlobal = data.reports;
    // list the reports
    data.reports.forEach((val, vali) => {
      const date = new Date(val.dateSubmitted);
      const month = date.toLocaleString("default", {
        month: "short",
      });
      $(`#list-of-reports`).append(`
      <tr onclick="window.location.href = '/ReportTracker/${val._id}' ;">
          <td>${vali + 1}</td>
          <td>${val.type}</td>
          <td>${val.submittedBy}</td>
          <td>${`${month}. ${date.getDate()}, ${date.getFullYear()}`}</td>
      </tr>
      `);
    });
    // show filter if user is chrod director
    if (data.chrodDirector)
      $("#reports-filter-holder").append(`
        <div class="row card-content">
          <div class="input-group col filter-select "> 
              <label>Filter Type</label>
              <select class="filter-table" id="reports-filter">
                  <option value="All" selected>none</option>
                  <option value="Recruitment & Retention">Recruitment & Retention</option>
                  <option value="Training & Development">Training & Development</option>
                  <option value="Performance Management">Performance Management</option>
              </select>
          </div> 
        </div> 
        <br/>
      `);
  });
});
let options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
// filter reports
$(document).on("change", `#reports-filter`, function (e) {
  // console.log(e.target.value);
  $(`#list-of-reports`).children().remove();
  let newIndex = 1;
  // list reports
  reportsGlobal.forEach((val) => {
    if (val.type === e.target.value || e.target.value === "All") {
      const date = new Date(val.dateSubmitted);
      $(`#list-of-reports`).append(`
      <tr onclick="window.location.href = '/ReportTracker/${val._id}';">
          <td>${newIndex++}</td>
          <td>${val.type}</td>
          <td>${val.submittedBy}</td>
          <td>${`${date.toLocaleString(options)}`}</td>
      </tr>
      `);
    }
  });
  // console.log(a.target.options[a.target.options.selectedIndex].innerText);
  // console.log(reportsFilter);
});
