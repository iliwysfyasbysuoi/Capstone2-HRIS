$(window).load(function () {

    $.get(`/ClearanceAccountabilityTracker/getAll`, function (offboarding, err) {
        $.get('/getSessionDetails', function (session, err) {

            offboarding.map((data, idx) => {
                let sub = data.accountabilities.find(res => res.approver === session.name)
                if (data.notifStatus === "Notified" && sub.submitted === 'Pending') {
                    $(".dataInfo").append(`
                        <tr onclick="window.location.href = '/ClearanceAccountabilityForm/${data._id}';">
                            <td>${data.offboardingID}</td>
                            <td>${data.name}</td>
                            <td>${data.position}</td>
                            <td>${data.businessUnit}</td>
                            <td>${data.department}</td>
                            <td>${formatDateAndTime(data.requestDate)}</td>
                            <td>${formatDateAndTime(data.updatedDate)}</td>
                        </tr>
                `)
                }
            })

        })
    })
})

let options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
};

const formatDateAndTime = (string) => {

        const date = new Date(string)
        if (string === "") {
            return "-";
        } else {
            return date.toLocaleString(options)
        }
}