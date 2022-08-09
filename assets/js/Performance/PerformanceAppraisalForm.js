$(window).load(function () {
  var id = document.getElementById("cycleId").value
  var date = document.getElementById("date").value
  console.log(date)
  $.get(`/GetCycleData/${id}/${date}`, function (cycleData, err) {
    if(cycleData){
      window.location.replace(`/PerformanceAppraisalTracker`)
    }
  })
})


$(document).on("click", ".addEmployee", function () {
  $("#employeeTrainingList").append(
    `
        <tr class="toolpair">
            <td>
                <textarea class="form-control" name="description" class="taskName" rows="3" required></textarea>
            </td>
            <td>
                <textarea class="form-control" name="results" class="taskOutcome" rows="3" required></textarea>
            </td>
            <td>
                <div class="col s2" style = "position: relative; top: 10px;">
                    <label for=""> &nbsp;</label>
                    <a title="Remove this row" class="btn-floating removeEmployee" onClick=><i class="material-icons">remove</i></a>
                </div>
            </td>
        </tr>
    `
  );
});

// remove the set of fields for the toolsOfTrade if user clicks on remove button
$(document).on("click", ".removeEmployee", function () {
  $(this).parent().parent().parent().remove();
});



