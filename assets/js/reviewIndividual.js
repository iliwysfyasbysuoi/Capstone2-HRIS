$(window).load(function () {
    var id = document.getElementById("appraisalId").value
    $.get(`/GetAppraisalData/${id}`, function (appraisalData, err) {
        if (appraisalData.data) {
            console.log("werawerfasd", appraisalData.data)
            window.location.replace(`/PerformanceReviewIndividualPage/${appraisalData.id}`)
        }
    })
})