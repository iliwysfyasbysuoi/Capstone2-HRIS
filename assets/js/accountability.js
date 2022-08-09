let accountability = []
let statusId = 0;
let num = 0;

$(window).load(function () {

    var id = document.getElementById("id").value
    $.get(`/GetAccountability/${id}`, function (offboarding, err) {
        $.get('/getSessionDetails', function (session, err) {
            let list = offboarding.accountabilities.find(ls => ls.departmentName === session.department)
            let sub = offboarding.accountabilities.find(res => res.approver === session.name)
            list && $(".selectInput").html('')
            if (sub.submitted !== 'Submitted') {
                list && list.accountabilityList.map((ac, idx) => {
                    if (ac.status === "Pending") {
                        $('.submit').attr('disabled', true);
                    }
                    accountability.push(
                        {
                            name: statusId,
                            status: ac.status
                        }
                    )
                    if (list.approver === session.name) {
                        $(".inputForm").append(
                            `   
                                <div class="row">
                                <div class="form-group col s5">
                                    <label for="Name"></label>
                                    <input placeholder="Name" id="Name" type="text" name="Name" value="${ac.name.toString()}" required>
                                </div>
                                <div class="form-group col s3">
                                    <label for="position_title">Status</label>
                                    <select id="status${idx}" name="status" class="status" required>
                                    ${ac.status === 'Pending' ? '<option value="Pending" selected>Pending</option><option value="Cleared">Cleared</option>' : '<option value="Pending">Pending</option><option value="Cleared" selected>Cleared</option>'}
                                    </select >
                                </div >
                                    <div class="form-group col s3 registrationRequirements">
                                    <a class="btn-floating removeAccountability" onClick=><i class="material-icons">remove</i></a>
                                    </div >
                                </div >
                        `
                        )
                        addAccountability(statusId)
                        statusId++

                    }

                })
            }
            else {
                window.location.replace(`/OffboardingTracker/${id}`)
            }

        })
    })




});




$(document).on("click", ".addAccountability", function () {
    $(".inputForm").append(
        `
        <div class= "row">
            <div class="form-group col s5">
                <label for="Name">Name</label>
                <input placeholder="Name" id="Name" type="text" class="validate" name="Name" required>
            </div>
            <div class="form-group col s3">
                <label for="status">Status</label>
                <select id="status${statusId}" name="status" class="status" required>
                    <option selected disabled>-</option>
                    <option value="Pending">Pending</option>
                    <option value="Cleared">Cleared</option>
                </select>
            </div>
            <div class="form-group col s3 registrationRequirements">
            <a class="btn-floating removeAccountability" onClick=><i class="material-icons">remove</i></a>
            </div >
        </div >
        `
    )
    addAccountability(statusId)
    statusId++
    console.log('ito')

}
);

const addAccountability = (statusId) => {
    // alert("id", statusId)
    $(`#status${statusId}`).on('change', function () {

        if (accountability.find(ac => ac.name === statusId)) {
            let indx = accountability.findIndex(ac => ac.name === statusId)
            accountability[indx].status = this.value
        }
        else {
            accountability.push({
                name: statusId,
                status: this.value
            })
        }

        if (accountability.find(ac => ac.status === "Pending")) {
            $('.submit').attr('disabled', true);
        }
        else {
            $('.submit').attr('disabled', false);

        }
    })
}

$(document).on("click", ".removeAccountability", function () {
    let el = $(this).parent().parent().children()[1]
    let idx = el.getElementsByTagName('select')[0].id
    console.log(idx)
    accountability = accountability.filter(acc => `status${acc.name}` !== idx)
    console.log(accountability)
    $(this).parent().parent().remove();
    //tanggalin rin sa acc list
})

// $('.status').on('change', function () {
//     alert(this.value)
// })


