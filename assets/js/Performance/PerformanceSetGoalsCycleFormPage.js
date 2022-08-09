// const modDate = require("../js/utils/custom-date");
let options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

$(window).load(function () {
  // $.get("/PerformanceSetGoalsCycleForm")
  // $.get("/get-employees-with-same-department", function (employees, err) {
  //   [
  //     ...new Set(
  //       employees.map(({ position }) => {
  //         if (
  //           position !== "Department Head" &&
  //           position !== "Department Director"
  //         )
  //           return position;
  //       })
  //     ),
  //   ].map((pos) => {
  //     if (pos)
  //       $(".positions").append(`<option value="${pos}" label="${pos}"/>`);
  //   });
  // });
  //   $.get("/performance-cycle-list", function (cycleData, err) {
  //     // if (cycleData) console.log(cycleData);
  //     if (cycleData.length > 0) {
  //       cycleData.map((cycle, i) => {
  //         $(".cycleList").append(`
  //           <tr onclick="window.location.href = '/performance-cycle-list/${
  //             cycle._id
  //           }';">
  //               <td>
  //                 ${i + 1}
  //               </td>
  //               <td>${cycle.position}</td>
  //               <td>${cycle.reviewCycle}</td>
  //               <td>${cycle.cyclesLeft}</td>
  //               <td>${cycle.startDate.substring(0, 10)}</td>
  //               <td>${cycle.notifyDate.substring(0, 10)}</td>
  //           </tr>
  //         `);
  //       });
  //       $(".noCycles").attr("style", "display:none");
  //     }
  //   });
  });

  $(document).on("click", ".addEmployee", function () {
    $("#employeeTrainingList").append(
      `
        <tr class="toolpair">
            <td>
                <textarea class="form-control"   class="KPI" rows="3" required name="KPI"></textarea>
            </td>
            <td>
                <textarea class="form-control"   class="description" rows="3" required name="description"></textarea>
            </td>
            <td>
                <textarea class="form-control"  class="performanceIndicator" rows="3" required name="performanceIndicator"></textarea>
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

// $('.positionFilter').on('change', function(){
//   window.location.replace(`/PerformanceSetGoalsCycleForm/${this.value}`)
// })

  //Date
  var date = new Date().toISOString().slice(0, 10);
  $('.startDate').attr('min', date);


  $(document).on("change", ".positions", function () {
      if($(".positions").val() != "" && $("#startDate").val() != "" ){
        checkExistingGoalsCycleNotice();
      }
  });

  $(document).on("change", "#startDate", function () {
    if($(".positions").val() != "" && $("#startDate").val() != "" ){
      checkExistingGoalsCycleNotice();
    }
});


  /**
 *  checks if may existing active Skill Setup na.
 *  i compared the startDate input with the expireDate records for the specific position
 *  if the startDate is BEFORE the expireDate, then meron pang active. 
 * 
 * if may active, i show the notice and button to redirect to the active skill setup page
 * */ 

function checkExistingGoalsCycleNotice(){
  // var businessUnit = $(".skillBusinessUnit").val();
  // var department = $(".skillDepartment").val();
  var position = $(".positions").val();
  var startDateString = $("#startDate").val();

  $.post("/getExistingActiveGoalsCycle", {position: position, startDateString: startDateString}, function(data, result){
    if(data.showNotice == true){

        console.log(JSON.stringify(data.goalCycleData));

        var link = "/PerformanceIndividualGoalsCycle/"+data.goalCycleData._id;

            //  $("#view_active_goals_cycle_btn").attr("href", "/SkillSetUpTracker/"+data.goalCycleData._id);
             $("#alert_div").prop("hidden", false);
             $("#submitBtn").prop("disabled", true);
             $("#alert_div").append(
               `
               <a class=" modal-trigger dark btn" id="view_active_goal_cycle_btn"  href="${link}" target="_blank">View Active Goals Cycle</a>
               `
             )

             var endDate = new Date(data.goalCycleData.dates[data.goalCycleData.dates.length-1]);
    
            //  var expireDate = new Date(data.goalCycleData.expireDate);
    
             $("#alert_text").text(
                 `
                  There is already an active Goals Cycle that ends on ${endDate.toDateString()} for the position ${position}. 
                 `
             );
    
         }else{
          $("#alert_div").prop("hidden", true);
          $("#submitBtn").prop("disabled", false);
    
         }

  })

}