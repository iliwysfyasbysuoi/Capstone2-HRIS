
// window.onload = function () {

//     // $.get('/getNextRequisitionID', function (requisitionID, err){
//     //     // $(".requisitionID").text(requisitionID);
//     //     alert();
//     // })
//     alert();

// }
 function changeOptions_position(businessUnit, department){
    
    $.post("/postRetrieveListOfPositions", {businessUnit: businessUnit, department: department}, function(data, status){
        var optionsArray = data;

        var $positionTitleSelect = $("#positionTitle");
        $positionTitleSelect.empty(); // remove old options

        for(let i = 0; i<optionsArray.length; i++){
            $positionTitleSelect.append(optionsArray[i]);

            if(i == optionsArray.length){
                return "ok";
            }
        }
    })
}

function getPositionInfo(businessUnit, department, position){
    $.post("/postRetrievePositionDetails", {businessUnit: businessUnit, department: department, position:position},
            function(positionDetails, result){

                $("#positionLevel").val(positionDetails.positionLevel);
                $("#jobCode").attr("disabled", false);
                changeJobCodeLevelOptions(positionDetails.positionLevel)
                $("#jobCode").val(positionDetails.jobCode);
                $("#billToCompany").val(positionDetails.billToCompany);
                $("#location").val(positionDetails.location);
                $("#jobDescription").val(positionDetails.jobDescription);
                $("#positionRequirements").val(positionDetails.positionRequirements);

                $("#skills_input_div").html(`<label for="skillName" class="form-control-label">Required Skills </label>`);
                $(".skills_required").html(``);
                if(positionDetails.skills.length != 0){
                    for(let i = 0; i<positionDetails.skills.length; i++){
                        let skill_input, skill, removeBtn = "";
                        
                        if(i!=0){
                            removeBtn = 
                            `
                                <div class="col s2" style = "position: relative; top: 10px;">
                                    <label for=""> &nbsp;</label>
                                    <a class="btn-floating removeSkill" onClick=><i class="material-icons">remove</i></a>
                                </div>
                            `;
                        }
                        skill = positionDetails.skills[i];

                        skill_input = 
                            `
                                <div class=" col s12">
                                    <div class="form-group col s6">
                                    <input placeholder="Name of Skill" id="skillName" type="text" name="skillName" class="skillName validate"  value="${skill}" required>
                                    </div>
                                    ${removeBtn}
                                </div>
                            `;

                        $(".skills_required").append(skill_input);

                        

                    }
                }else{
                    let skill_input = 
                    `
                        <div class=" col s12">
                            <div class="form-group col s6">
                            <input placeholder="Name of Skill" id="skillName" type="text" name="skillName" class="skillName validate" value="" required>
                            </div>
                            ${removeBtn}
                        </div>
                        
                    `;
                    $(".skills_required").append(skill_input);
                }

                $('#jobDescription').trigger('autoresize'); 
                $('#positionRequirements').trigger('autoresize'); 
                // $("#endSection").prop("hidden", false);
                

            }
        )
}

$(window).load( function () {
    $.get('/getNextRequisitionID', function (requisitionID, err){
        $(".requisitionID").text(requisitionID);
    })

    
    var pathSplit = window.location.pathname.split('/');
    
    // if may params -> for auto generated PRF
    if(pathSplit.length == 6){
        var businessUnit = pathSplit[3].replace(/%20/g, " ");
        var department = pathSplit[4].replace(/%20/g, " ");
        var position = pathSplit[5].replace(/%20/g, " ");

        

        $("#midSection").removeClass("d-none");
       

        $("select.purposeOfRequest").val("Replacement");
        onChange_purposeOfRequest("Replacement");
        $("select.businessUnit").val(businessUnit);
        changeOptions_businessUnit(businessUnit);
        $("select.department").val(department);
        changeOptions_position(businessUnit, department);

        setTimeout(function(){
            $("select.positionTitle").val(position);
            $("#endSection").removeClass("d-none");
            getPositionInfo(businessUnit, department, position);
        }, 350);
        

        $(":input").prop("disabled", false);
        
        console.log(`${businessUnit} ${department} ${position}`);

        
    }else{
        
    }
});

//remove set of fields for Required Skills
$(document).on("click", ".removeSkill", function () {
    $(this).parent().parent().remove();
})

$(document).on("click", ".addSkill", function () {
    $('#skillsRequired').append(
        `
        <div class=" col s12">
            <div class="form-group col s6">
            <input placeholder="Name of Skill" id="skillName" type="text"
            name="skillName" class="skillName validate" value="">
            </div>

            <div class="col s2" style = "position: relative; top: 10px;">
                <label for=""> &nbsp;</label>
                <a class="btn-floating removeSkill" onClick=><i class="material-icons">remove</i></a>
            </div>
        </div>
        `
    )
});

// remove the set of fields for the toolsOfTrade if user clicks on remove button
$(document).on("click", ".removeTool", function () {
    $(this).parent().parent().remove();
})

$(document).on("click", ".addTool", function () {
    $('#tools').append(
        `
        <div class="toolpair col s12">
            <div class="form-group col s6">
                <label for="tool" class="form-control-label">  &nbsp;</label>
                <input placeholder="" id="tool" type="text"
                    name="tool" class="tool validate">
            </div>
            <div class="col s4">
                <label for="availability"> &nbsp;</label>
                <select class="availability" id="availability" name="availability">
                    <option value="Available" selected> Available</option>
                    <option value="Unavailable">Unavailable</option>
                </select>
            </div>
            <div class="col s2" style = "position: relative; top: 10px;">
                <label for=""> &nbsp;</label>
                <a class="btn-floating removeTool" onClick=><i class="material-icons">remove</i></a>
            </div>
        </div>
        `
    )
});

// changes the options for Job Code/Level depending on the Position Level
function changeJobCodeLevelOptions(positionLevel){
    $("#jobCode").prop("disabled", false)

    var professionalOptions = {
        "Level 1": "Level 1",
        "Level 2": "Level 2",
        "Level 3": "Level 3",
        "Level 4": "Level 4",
        "Level 5": "Level 5"
    };

    var operationalOptions = {
        "Level 1": "Level 1",
        "Level 2": "Level 2",
        "Level 3": "Level 3"
    };

    var supervisoryOptions = {
        "Level 1": "Level 1",
        "Level 2": "Level 2",
    };

    switch(positionLevel){
        case "Professional": 
            newOptions = professionalOptions;
            break;
        case "Operational/Technical": 
            newOptions = operationalOptions;
            break;
        case "Supervisory/Management": 
            newOptions = supervisoryOptions;
            break;
        
    }

    var $el = $("#jobCode");
    $el.empty(); // remove old options

    $.each(newOptions, function(key,value) {
        $el.append($("<option></option>")
        .attr("value", value).text(key));
    });
}

function changeOptions_businessUnit(businessUnit){
    var CCI_options = {
        "Select Department": "",
        "CHROD": "Corporate Human Resource & Organization Department",
        "Finance & Treasury": "Finance & Treasury",
        "ICT": "ICT",
        "Accounting and Finance": "Accounting and Finance",
        "Supply Chain and Administration": "Supply Chain and Administration"
    };

    var LNL_options = {
        "Select Department": "",
        "Environment & Safety": "Environment & Safety",
        "Functional Materials": "Functional Materials"
    };

    var LeonioLand_options = {
        "Select Department": "",
        "Real Estate Development": "Real Estate Development",
        "General Contracting": "General Contracting",
    };

    var petrolift_options = {
        "Select Department": "",
        "Technical": "Technical",
        "Quality, Safety & Environmental": "Quality, Safety & Environmental",
    };

    switch(businessUnit){
        case "Circle Corporation Inc.":
            newOptions = CCI_options;
            break;
        case "LNL Archipelago Minerals":
            newOptions = LNL_options;
            break;
        case "Leonio Land":
            newOptions = LeonioLand_options;
            break;
        case "Petrolift":
            newOptions = petrolift_options;
            break;
    }
    
    var $el = $("#department");
    $el.empty(); // remove old options

    $.each(newOptions, function(key,value) {
        if(value ==""){
            $el.append($("<option></option>").attr("value", value).prop("disabled", true).prop("selected", true).text(key));
        }else{
            $el.append($("<option></option>").attr("value", value).text(key));
        }
        
    });
}
function onChange_purposeOfRequest(purpose){
    if(purpose == "Additional" || purpose == "Replacement"){
        // $("#midSection").prop("hidden", false);
        // $("#endSection").prop("hidden", true);

        $("#midSection").removeClass("d-none");
        $("#endSection").addClass("d-none");

        $(".div_position").html(
            `
            <label for="positionTitle">Position Title</label>
            <select class="positionTitle" name="positionTitle" id="positionTitle" required disabled>
                <option value="" selected disabled> Select Position</option>
            </select>
            `
        )


    }else{

        $("#midSection").removeClass("d-none");
        $("#endSection").removeClass("d-none");

        $(".div_position").html(
            `
            <label for="positionTitle">Position Title</label>
            <input placeholder="" id="positionTitle" name="positionTitle" type="text" class="validate" value="" required>
            `
        )
        // empties entries that are autoamtically entered whe additional/replacement
        $("#positionLevel").val("");
        $("#jobCode").val("");
        $("#billToCompany").val("");
        $("#location").val(" ");
        $("#jobDescription").val(" ");
        $("#positionRequirements").val(" ");
    }
}



// changes the options for Job Code/Level depending on the Position Level
$(document).on("change", ".positionLevel", function () {
    var positionLevel = $(".positionLevel").val();
    $("#jobCode").prop("disabled", false)

    changeJobCodeLevelOptions(positionLevel);



});

$(document).on("change", ".employmentType", function () {

    if($(".employmentType").val() != "Full Time"){
        $(".div_lengthOfAssessment").html(
            `
                <div class="col s6">
                    <label for="lengthOfAssignment">Length of Assignment</label>
                    <select class="lengthOfAssignmentYear" id="lengthOfAssignmentYear"
                        name="lengthOfAssignmentYear" required>
                        <option value="" selected disabled> Select</option>
                        <option value="0" > 0 Year</option>
                        <option value="1" >1 Year</option>
                        <option value="2">2 Years</option>
                        <option value="3">3 Years</option>
                        <option value="4">4 Years</option>
                        <option value="5">5 Years</option>
                    </select>
                </div>
        
        
                <div class="col s6">
                    <label for="lengthOfAssignment"> &nbsp;</label>
                    <select class="lengthOfAssignmentMonth" id="lengthOfAssignmentMonth"
                        name="lengthOfAssignmentMonth" required>
                        <option value="" selected disabled> Select</option>
                        <option value="0" > 0 Month</option>
                        <option value="1" >1 Month</option>
                        <option value="2">2 Months</option>
                        <option value="3">3 Months</option>
                        <option value="4">4 Months</option>
                        <option value="5">5 Months</option>
                        <option value="6">6 Months</option>
                        <option value="7">7 Months</option>
                        <option value="8">8 Months</option>
                        <option value="9">9 Months</option>
                        <option value="10">10 Months</option>
                        <option value="11">11 Months</option>
                    </select>
                </div>
            `
        )
    }else{
        $(".div_lengthOfAssessment").empty();
    }
})

$(document).on("change", ".businessUnit", function () {
    var businessUnit = $(".businessUnit").val();
    $("#department").prop("disabled", false)

    changeOptions_businessUnit(businessUnit);

    

});


$(document).on("change", "#purposeOfRequest", function () {

    var purpose = $("#purposeOfRequest").val();

    /**
     * 
     * if Additional/Replacement, position already exists in the db
     * query db using Business Unit, Department to get the list of positions.
     *  */ 
    onChange_purposeOfRequest(purpose);
    
    
});

$(document).on("change", "#department", function () {

    $("#positionTitle").prop("disabled", false);

    var businessUnit = $("#businessUnit").val();
    var department = $("#department").val();

    
    changeOptions_position(businessUnit, department);
    
})

/**
 * TODO:    IF purpose is Additional/Replacement 
 *              Once position is changed,
 */
 $(document).on("change", "#positionTitle", function () {
    var businessUnit = $("#businessUnit").val();
    var department = $("#department").val();
    var position = $("#positionTitle").val();
    var purposeOfRequest = $("#purposeOfRequest").val();

    $("#endSection").removeClass("d-none");
    if(purposeOfRequest != "New Position"){

        getPositionInfo(businessUnit, department, position);
    }
    

 })