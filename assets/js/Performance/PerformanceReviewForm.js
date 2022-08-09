$(document).on("click", ".addEmployee", function () {
  $("#employeeTrainingList").append(
    `
      <tr class="toolpair">
          <td>
          <textarea class="form-control" name="competencyName" class="competencyName" rows="3" required></textarea>
          </td>
          <td>
          <textarea class="form-control" name="competencyIncident" class="competencyIncident" rows="3" required></textarea>
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
