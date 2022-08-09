$(window).load(function () {
    // initializes modal
    $('.modal').modal();

    var id = document.getElementById("id").value
    $.get(`/GetAccountability/${id}`, function (offboarding, err) {
        $.get('/getSessionDetails', function (session, err) {

            if (session.name === offboarding.name) {
                $('.approvalDiv').remove()
            }

            if (session.position === "Department Head") {
                $('.approvalDiv').remove()
            }

            const { approvalHR, approvalCHRODDirector, approvalBUHead, status } = offboarding
            let validPositions = ["HR Supervisor", "Business Unit Head", "Department Director", "HR Assistant Manager"]
            let isValidPosition;
            let { position } = session

            validPositions.map(pos => {
                if (position === pos) {
                    isValidPosition = true
                }
            })

            $(".modal-text").html(
                `
                <input type="text" value="${offboarding._id}"  hidden name="id" />
                <input type="text" value="${session._id}"  hidden name="sess_id" />
                <input type="text" value="${position}"  hidden name="position" />
                <textarea type="text" name="disapprovalReason" id="disapprovalReason" class="disapprovalReason materialize-textarea"></textarea>
                `
            )
           

            if (status === "Completed") {
                if (position === "HR Supervisor") {
                    $(".action-button").html(`
                    <div> 
                    <form action="/SubmitActionForm/${id}"  method="GET">
                        <button class="waves-effect waves-light btn" id="sendNotif"
                        type="submit">Submit Action Form</button>
                    </form>
                    </div>
                    `)
                }
                else {
                    $(".action-button").html(`
                    <div> 
                        Clearance Form Completed!
                    </div>
                    `)
                }

            }
            else if(status === "Recorded"){
                $(".action-button").html(`
                    <div> 
                        Clearance Form Recorded!
                    </div>
                    `)

            }
            else if (status !== "Closed") {
                if (isValidPosition) {

                    if (offboarding.allDeptHeadSubmitted) {
                        // check if approved ng hr, buhead, and chrod director
                        if (approvalHR.approval !== "Pending" && position === "HR Supervisor") {
                            $(".action-button").html(``)
                            $(".action-button").html(`
                                <div>${approvalHR.approval}</div>
                            `)
                        }
                        //check if kompleto na approvals 
                        if ((approvalHR && approvalHR.approval === "Approved") && (approvalCHRODDirector && approvalCHRODDirector.approval === "Approved") && (approvalBUHead && approvalBUHead.approval === "Approved")) {
                            $(".action-button").html('')
                            // check naset na interview schedule
                            if (offboarding && offboarding.interview && offboarding.interview.status ) {
                                //check position
                                if (position === "HR Assistant Manager") {
                                    // if pending, display complete button
                                    if (offboarding.interview.status === "Pending") {
                                        $(".action-button").html(`
                                        <div> 
                                        <form action="/CompleteInterview/${id}"  method="POST">
                                            <button class="waves-effect waves-light btn" id="sendNotif"
                                            type="submit">Interview Completed</button>
                                        </form>
                                        </div>
                                    `)
                                    }
                                    // if done, display done
                                    else {
                                        $(".action-button").html(`
                                        <div>DONE</div>
                                        `)
                                    }
                                }
                                else {
                                    //if di pa HR asst mngr, show schedule lang
                                    $(".action-button").html(`
                                    <div>Interview Schedule ${formatDate(offboarding.interview.date)}</div>
                                `)
                                }
                            }
                            else {
                                // if wla pang sched and hr supervisor, set schedule

                                if (position === "HR Supervisor" ) {
                                    $(".action-button").html(`
                                    <form action="/ScheduleInterview/${id}" method="POST">
                                        <div class="row">
                                            <input type="datetime-local" name="schedule" />
                                            <button class="waves-effect waves-light btn" id="sendNotif"
                                                type="submit">Schedule Interview</button>
                                        </div>
                                    </form>
                                    `)
                                }
                            }
                        }
                        else {
                            if (approvalHR.approval !== "Pending" && position === "HR Supervisor" ) {
                                $(".action-button").html(``)
                                $(".action-button").html(`
                                    <div>${approvalHR.approval}</div>
                                `)
                            }
                            else {
                                if( offboarding.status != "Closed"){
                                    $(".action-button").html(
                                        `
                                            <form action="/ApproveClearanceAccountability" method="POST">
                                                <div class="row">
                                                    <input type="text" value="${offboarding._id}" hidden name="id" />
                                                    <input type="text" value="${session._id}" hidden name="sess_id" />
                                                    <input type="text" value="${position}" hidden name="position" />
                                                    <button class="waves-effect waves-light btn" id="sendNotif" name="approval" value="approve"
                                                        type="submit">Approve</button>
                                                        <br><br>
                                                        <a class="waves-effect waves-light btn modal-trigger" href="#disapproveModal"  id="sendNotif" name="approvalButton" value="Disapprove"
                                                        >Disapprove</a>
                                                </div>
                                            </form>
            
                                            `
                                    )
                                }
                                // <button class="waves-effect waves-light btn" name="approval" value="disapprove" id="sendNotif"
                                //                     type="submit">Disapprove</button>

                                
                            }

                        }


                        if (approvalBUHead.approval !== "Pending" && position === "Business Unit Head") {
                            $(".action-button").html(`
                                <div>${approvalBUHead.approval}</div>
                            `)
                        }
                        if (approvalCHRODDirector.approval !== "Pending" && position === "Department Director") {
                            $(".action-button").html(`
                                <div>${approvalCHRODDirector.approval}</div>
                            `)
                        }

                    }
                    // return notify department head button
                    else {
                        if (offboarding.clearanceApproval ) {
                            if (offboarding.notifStatus && offboarding.notifStatus === "Notified") {
                                $(".action-button").html(
                                    `
                                <div class="listingButtonArea center center-align" >
                                <p class="center">Department Heads have been notified!</p>
                            </div>
                                `
                                )
                            }
                            else {
                                $(".action-button").html(
                                    `
                                    <form action="/SendNotifToDeptHead/${offboarding._id}" method="POST" >
                                        <div class="row">
                                        <input type="text" value="${offboarding._id}" hidden />
                                        <button class="waves-effect waves-light btn" id="sendNotif"
                                                type="submit">Notify Department Heads</button>
                                        </div>
                                    </form >
                                `
                                )
                            }
                        }
                        else {
                            
                            if( offboarding.status != "Closed"){
                                $(".action-button").html(
                                    `
                                    <form action="/SendNotifToDeptHead/${offboarding._id}" method="POST" >
                                        <div class="row">
                                        <input type="text" value="${offboarding._id}" hidden />
                                        <input type="text" value="${session._id}" hidden name="sess_id" />
                                        <input type="text" value="${position}" hidden name="position" />
                                        <button class="waves-effect waves-light btn" id="sendNotif" name="approvalButton" value="Approve"
                                                type="submit">Approve</button>
                                                <br><br>
                                        <a class="waves-effect waves-light btn modal-trigger" href="#disapproveModal"  id="sendNotif" name="approvalButton" value="Disapprove"
                                                >Disapprove</a>
                                        </div>
                                    </form >
                                `
                                )


                            }
                            

                            // <button class="waves-effect waves-light btn" id="sendNotif" name="approvalButton" value="Disapprove"
                            //                 type="submit">Disapprove</button>
                        }

                    }
                }
                else {
                    console.log("di pasok")
                }
            }

            // else {
            //     $(".action-button").html(`
            //     <div> 
            //         Clearance Form Closed!
            //     </div>
            //     `)
            // }


            console.log("Ito", session.name === offboarding.name)
            if (session.name !== offboarding.name) {
                offboarding.accountabilities.map(acc => {
                    acc.accountabilityList.map(list => {
                        if (acc.submitted === "Submitted") {
                            $(".tableInfo").append(
                                `
                            <tr>
                                    <td>${acc.departmentName}</td>
                                    <td>${list.name}</td>
                                    <td>${list.status}</td>
                                    <td>${acc.approver}</td>
                                    <td>${formatDate(acc.dateSigned)}</td>
        
                                </tr>
        
                            `
                            )
                           
                        }
                    })

                }
                )

                if($('.tableInfo tr').length == 0){
                    $(".tableInfo").append(
                        `
                            <tr>
                                <td colspan="5"  style= "text-align: center;">No accountabilities records yet.</td>
                            </tr>
                        `
                    )
                }
            }
            else {
                offboarding.accountabilities.map(acc => {
                    acc.accountabilityList.map(list => {

                        $(".userTableInfo").append(
                            `
                                <tr>
                                        <td>${acc.departmentName}</td>
                                        <td>${list.name}</td>
                                        <td>${list.status}</td>
                                        <td>${acc.approver}</td>
                                        <td>${formatDate(acc.dateSigned)}</td>
            
                                    </tr>
            
                                `
                        )
                       

                    })

                }
                )
                
                if($('.userTableInfo tr').length == 0){
                    $(".userTableInfo").append(
                        `
                            <tr >
                                <td colspan="5" style= "text-align: center;">No accountabilities records yet.</td>
                            </tr>
                        `
                    )
                }
            }
        })



    })
})

let options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
};

let formatDate = (string) => {
    const date = new Date(string)
    if (string === "") {
        return "-";
    } else {
        return date.toLocaleString(options)
    }
}
