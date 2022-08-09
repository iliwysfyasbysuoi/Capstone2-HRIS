$(window).load(function () {
    let id = document.getElementById("surveyId").value;
    $.get(`/getIndividualExitSurvey/${id}`, function (data, err) {
        data.reasonLeave.map(reason => {
            $(".reason").append(
                `
                <div class="form-group col s3">
                    <input type="checkbox" id="exit-1" name="reasonLeave" disabled checked/>
                    <label for="exit-1">${reason}</label>
                </div>
                `
            )
        })
    });
});