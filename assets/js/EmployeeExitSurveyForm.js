
$(window).load(function () {
    var offboardingId = document.getElementsByName("offboardingId")[0].defaultValue
    console.log(offboardingId)
    $.get(`/GetExitSurvey/${offboardingId}`, function (data, err) {
        console.log(data)
        if (data.data === true) {
            console.log(data)
            window.location.replace(`/ExitSurveyTracker/${data.id}`)
        }
    })

})

$(document).on("change", "#exit-10", function () {


    var checkSelected = document.getElementById('exit-10');
    if (checkSelected.checked) {
        $(".otherInput").html(`
            <div class="form-group col s4">
                <input placeholder="Other Reason" id="reasonLeave" class="validate" type="text" name="reasonLeave" id="reasonLeave">
            </div>
        `)
    }
    else {
        $(".otherInput").html('')
    }
})


