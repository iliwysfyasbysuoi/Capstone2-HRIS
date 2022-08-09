$(window).load(function () {

    // if from termination, select termination and disable the others
    if($(".employeeName").val() != ""){
        $("#confirm_employment").prop("disabled", true);
        $("#transfer").prop("disabled", true);
        $("#termination").prop("checked", true);

    }

})

$(document).on("change", ".recommendAction", function () {
    
    var radios = document.getElementsByName('recommendAction');

    // if transfer
    if (radios[2].checked) {
        $(".otherInput").html(`
            <div class="form-group col s2"></div>
            <div class="table-responsive table-bordered col s8">
                <table class="table">
                <thead>
                <tr>
                    <th></th>
                    <th>From</th>
                    <th>To</th>
                </tr>
                    </thead>
                <tbody>
                <tr>
                    <td>Department</td>
                    <td><input id="transfer_old_department" class="validate" placeholder=""type="text" name="transfer_old_department" required></td>
                    <td><input id="transfer_new_department" class="validate" placeholder=""type="text" name="transfer_new_department" required></td>
                </tr>
                <tr>
                    <td>Position Title</td>
                    <td><input id="transfer_old_position" class="validate" placeholder=""type="text" name="transfer_old_position" required></td>
                    <td><input id="transfer_new_position" class="validate" placeholder=""type="text" name="transfer_new_position" required></td>
                </tr>
                </tbody>
                </table>
        </div>
        `)
    }
    // if confirm hiring, secondment, or termination
    else if (radios[1].checked || radios[0].checked || radios[3].checked) {
        $(".otherInput").html(`
            <div class="form-group col s2"></div>
            <div class="table-responsive table-bordered col s8">
            <label for="justification">Reason</label>
            <textarea class="form-control" id="reason" class="reason" rows="3" name="terminationReason" required></textarea>
        </div>
        `)
    }
    else {
        $(".otherInput").html('')
    }
})

// var date = new Date().toISOString().slice(0,10);
// $('#effective_date').attr('min', date);