let positions = []
$(window).load(function () {
    $.get(`/GetAllAppraisalData`, function (userData, err) {
        userData.map(
            user => {
                if (!positions.includes(user.position)) {
                    positions.push(user.position)
                }
            }
        )

        positions.map(pos => {
            $('.filter-table').append(
                `
                    <option value="${pos}">${pos}</option>
                `
            )
        })
    })
    $.get('/getSessionDetails', function (session, err) {
        if (session.position !== "Department Head" && session.position !== "HR Assistant Manager") {
            $('.tableCard').remove()
        }
    })
})