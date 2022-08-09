


$(window).load(function () {

    // initializes the modal UI
    $('.modal').modal();


    let params = new URLSearchParams(location.search);
    let mode = params.get('mode');

    if (mode == "update") {

        $("#submit_PIF").addClass("d-none");
        $("#save_PIF").removeClass("d-none");
        $("#cancel_PIF").removeClass("d-none");

        $("#form_PIF").attr("action", "/updatePersonalInformationForm");

        $.get("/getSessionDetails", function (sessionData, err) {
            let user_id = sessionData._id;
            $.get("/getPersonalInformationData", { user_id: user_id }, function (PIFData, err) {
                if (PIFData != "none") {
                    FillUpPIF(PIFData);
                }
            });
        });
    }



});

function FillUpPIF(data) {

    // Part 1
    $("#present_address").val(data.presentAddress);
    $("#tel_num").val(format_TelNum(data.telNum));

    $("#provincial_address").val(data.provincialAddress);
    $("#cell_num").val(format_CellNum(data.mobileNum));

    $("#place_birth").val(data.placeOfBirth);
    $("#date_birth").val(data.dateOfBirth.slice(0, 10));
    $("#age_text").val(data.age);
    $("#age").val(data.age);
    $("#gender").val((data.gender == "gender-female") 
                        ? "Female" : (data.gender == "gender-male") 
                                        ? "Male": data.gender);

    $("#weight").val(data.weight);
    $("#height").val(data.height);
    $("#civil_status").val(data.civilStatus);
    $("#citizenship").val(data.citizenship);
    $("#religion").val((data.religion=="Christian" ? "Christianity":data.religion));
    $("#blood_type").val(data.bloodType);

    $("#sss_no").val(format_SSS(data.SSS));
    $("#tin").val(format_tin(data.TIN));
    $("#hdmf_no").val(format_4x4(data.HDMF));
    $("#philhealth").val(format_4x4(data.PhilHealth));

    //part 2
    // alert(data.marriageDate.slice(0, 10))
    $("#spouse_name").val(data.spouseName);
    var marriageDate = "" ;

    if(data.marriageDate !== undefined)
        marriageDate = data.marriageDate;

    $("#date_marriage").val((marriageDate != "") ? data.marriageDate.slice(0, 10): "");

    $("#spouse_work").val(data.spouseOccupation);
    $("#spouse_emp").val(data.spouseEmployer);
    $("#spouse_address").val(data.spousePresentAddress);
    $("#spouse_tel_num").val((data.spouseTelNum != "" && data.spouseTelNum != undefined) ? format_TelNum(data.spouseTelNum):"");
    $("#spouse_cell_num").val((data.spouseMobileNum != "" && data.spouseMobileNum != undefined) ? format_CellNum(data.spouseMobileNum):"");

    data.children.forEach(c => {
        $('#childrenSection').append(children_field_component(c.name, c.dateOfBirth));
    })
    
    $("#father_name").val(data.fatherName);
    $("#mother_name").val(data.motherName);

    $("#father_address").val(data.fatherHomeAddress);
    $("#mother_address").val(data.motherHomeAddress);

    $("#father_occupation").val(data.fatherOccupation);
    $("#mother_occupation").val(data.motherOccupation);

    $("#father_company").val(data.fatherCompany);
    $("#mother_company").val(data.motherCompany);

    data.siblings.forEach(s => {
        $('#siblingsSection').append(sibling_field_component(s.name, s.dateOfBirth, s.civilStatus));
    })

    // part 3 

    data.schoolRecords.forEach(v =>{
        $('#educationalLevelInfoSection').append(educ_field_component(v.level, v.nameAddress, v.fromDate, v.toDate, v.degree));
    })
    $("#award").val(data.award);

    data.exams.forEach(v =>{
        $('#ExamsSection').append(exam_field_component(v.name, v.examDate, v.passedDate, v.rating, v.rank));
    })

    data.trainingsAndSeminarInfo.forEach(v =>{
        $('#trainingsAndSeminarsSection').append(training_field_component(v.title, v.organizer, v.date));
    })

    // part 4 

    data.employmentRecordInfo.forEach(v =>{
        $('#employmentRecordSection').append(employment_field_component(v.nameAndAddress, v.nature, v.fromDate, v.toDate, v.position, v.reasonForLeaving));
    })

    // part 5

    data.organizations.forEach((v, index) =>{
        $('#organizationsSection').append(organizations_field_component(v.name, v.position, v.inclusiveYears));
    })


    $(".characterReferencesInfo").remove();
    for(let i = 0; i < data.characterReferences.length; i++){
        let v = data.characterReferences[i];
        $('#characterReferencesSection').append(character_field_component(v.name, v.relationship, v.occupation, v.companyNameAndAddress, v.contactNum, i));
    }

    // part 6
    $("#ci_person").val(data.contactPerson);
    $("#ci_relationship").val(data.contactRelationship);
    $("#ci_address").val(data.contactAddress);
    $("#ci_num").val(format_CellNum(data.contactNumber));



}

function format_CellNum(value) {
    var cell_num = value;
    if(cell_num.slice(0, 2) == 63){
        return `0${cell_num.slice(2, 5)}-${cell_num.slice(5, 9)}-${cell_num.slice(9, 12)}`;

    }else{
        cell_num = cell_num.split('-').join('');    // Remove dash (-) if mistakenly entered.
        first4 = cell_num.slice(0, 4);
        if (Array.from(cell_num).length > 7) {
            first3 = cell_num.slice(4, 7);
            sec4 = cell_num.slice(7, 11);
            return first4 + "-" + first3 + "-" + sec4;
        }else if (Array.from(cell_num).length > 4) {
            first3 = cell_num.slice(4, 7);
            return first4 + "-" + first3;
        } else {
            return first4;
        }
    }
}

function format_TelNum(value){
    var tel_num = value;
    tel_num = tel_num.split('-').join('');    // Remove dash (-) if mistakenly entered.
    
    var first4, sec3;
    if(tel_num.slice(0,2).toString() == "02"){
        $(this).attr("maxlength", "12");
        tel_num = tel_num.split('-').join('');    // Remove dash (-) if mistakenly entered.
        firsttwo = tel_num.slice(0,2);
        first4 = tel_num.slice(6,10);

        if(Array.from(tel_num).length>6){
            var sec4 = tel_num.slice(6,10);
            return firsttwo+"-"+first4+"-" +sec4;
        }
    }
    else if(tel_num.slice(0,2).toString() == "03"){
        $(this).attr("maxlength", "12");
        tel_num = tel_num.split('-').join('');    // Remove dash (-) if mistakenly entered.
        first3 = tel_num.slice(0,3);
        sec3 = tel_num.slice(3,6);
        if(Array.from(tel_num).length>6){
            first4 = tel_num.slice(6,10);
            return first3+"-"+sec3+"-" +first4;
        }
    }else{
        $(this).attr("maxlength", "9");
        tel_num = tel_num.split('-').join('');    // Remove dash (-) if mistakenly entered.
        first4 = tel_num.slice(0,4);
        if(Array.from(tel_num).length>4){
            var sec4 = tel_num.slice(4,8);
            return first4+"-"+sec4;
        }
    }
    
}

function format_SSS(value){
    var sss = value;
    sss = sss.split('-').join('');    // Remove dash (-) if mistakenly entered.
    
    first = sss.slice(0,2);

    if(Array.from(sss).length>9){
        second = sss.slice(2,9);
        third = sss.slice(9,10);

        return first+"-"+second+"-" +third;
    }if(Array.from(sss).length>2){
        second = sss.slice(2,9);

        return first+"-"+second;
    }else{
        return first;
    }
}

function format_tin(value){
    var tin = value;
    tin = tin.split('-').join('');    // Remove dash (-) if mistakenly entered.
    tin = tin.match(/.{1,3}/g).join('-');

    return tin;
}

function format_4x4(value){
    var hdmf = value;
    hdmf = hdmf.split('-').join('');    // Remove dash (-) if mistakenly entered.
    hdmf = hdmf.match(/.{1,4}/g).join('-');

    return hdmf;
}

/**
 * 
 * @param {*} str string
 * @param {*} index where to add the additional string within the str
 * @param {*} stringToAdd string to add
 * @returns the string with the additional string placed at the index
 */
function addStringInMiddle(str, index, stringToAdd){
    return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
}

function sibling_field_component(name, dateOfBirth, civilStatus){
    var html= `
    <tr class="sibling-info">
        <td>
            <input class="sibling_name" name="sibling_name" type="text" class="validate" value= "${name}" required>
        </td>
        <td>
            <input class="sibling_birth" name="sibling_birth" type="date" class="validate" value= "${dateOfBirth.slice(0, 10)}"  required>
        </td>
        <td>
            <select name="sibling_status" id="sibling_status"  name="sibling_status"  required>
                <option value="" disabled >Select Civil Status</option>
                <option value="Single" >Single</option>
                <option value="Married" >Married</option>
                <option value="Divorced" >Divorced</option>
                <option value="Separated" >Separated</option>
                <option value="Widowed" >Widowed</option>
            </select>
        </td>
        <td>
            <a class="btn-floating removeSibling" style = "position: relative; left: 15px;"><i class="material-icons" >remove</i></a>
        <td>
    </tr>
    `;

    return addStringInMiddle(html, html.indexOf(civilStatus) + civilStatus.length+1, " selected ")
    
    ;
    
}

function children_field_component(name, dateOfBirth){
    return `
        <tr class = "child-info">
            <td>
                <input class="child_name"  name="child_name" type="text" class="validate" value = "${name}" required>
            </td>
            <td>
                <input class="child_birth" name="child_birth" type="date" class="validate" value = "${dateOfBirth.slice(0, 10)}"  required>
            </td>
            <td>
                <a class="btn-floating removeChild" style = "position: relative; left: 15px;"><i class="material-icons" >remove</i></a>
            </td>
        </tr>
    `;
}

function educ_field_component(level, nameAddress, fromDate, toDate, degree){
    var html= `
        <div class="col s12 educationLevelInfo">
            <div class="form-group col s2">
                
                <select name="school_level" id="school_level"  name="school_level" required>
                    <option value="" disabled >Select Civil Status</option>
                    <option value="Junior High School">Junior High School</option>
                    <option value="Senior High School">Senior High School</option>
                    <option value="Bachelor">Bachelor</option>
                    <option value="Master">Master</option>
                    <option value="Doctor">Doctor</option>
                </select>
            </div>
            <div class="form-group col s2">
                <input class="school_name validate" name="school_name" type="text" placeholder="Name of School" value = "${nameAddress}"  required>
            </div>
            <div class="form-group col s2">
                <input class="school_start form-control-label" name="school_start" type="date"  value = "${fromDate.slice(0, 10)}"  required>
            </div>
            <div class="form-group col s2">
                <input class="school_end form-control-label" name="school_end" type="date" value = "${toDate.slice(0, 10)}"  required>
            </div>
            <div class="form-group col s3">
                <input class="school_degree validate" name="school_degree" type="text" placeholder="Degree/Course" value = "${degree}"  required>
            </div>
            <div class="form-group col s1">
                <a class="btn-floating removeEducationLevelInfo" style = "position: relative; left: 15px;"><i class="material-icons" >remove</i></a>
            </div>
        </div>
    `;
    return addStringInMiddle(html, html.indexOf(level) + level.length+1, " selected ");

}

function exam_field_component(name, examDate, passedDate, rating, rank){

    return `
        <div class="row examInfo">
            <div class="form-group col s3">
                <input type="text" class="exam_name validate" name="exam_name" placeholder="Name of Examination" value = "${name}"   required>
            </div>
            <div class="form-group col s2">
                <input type="date" class="exam_start form-control-label"  name="exam_start" value = "${examDate.slice(0, 10)}"   required>
            </div>
            <div class="form-group col s2">
                <input type="date" class="exam_end form-control-label"  name="exam_end" value = "${passedDate.slice(0, 10)}"required>
            </div>
            <div class="form-group col s2">
                <input type="text" class="exam_rate validate" name="exam_rate"  placeholder="Rating" value = "${rating}"   required>
            </div>
            <div class="form-group col s2">
                <input type="text" class="exam_rank validate" name="exam_rank"  placeholder="Rank" value = "${rank}"   required>
            </div>
            <div class="form-group col s1">
                <a class="btn-floating removeExamInfo"  style = "position: relative; left: 15px;"><i class="material-icons" >remove</i></a>
            </div>
        </div>
    `;
}

function training_field_component(title, organizer, date){

    return `
        <div class="row trainingAndSeminarsInfo">
            <div class="form-group col s5">
                <input type="text" class="train_title validate" name="train_title"  placeholder="Title of Seminar" value = "${title}"  required>
            </div>
            <div class="form-group col s4">
                <input type="text" class="train_org validate"  name="train_org" placeholder="Organizer" value = "${organizer}"  required>
            </div>
            <div class="form-group col s2">
                <input type="date" class="train_date form-control-label"  name="train_date" value = "${date.slice(0, 10)}"  required>
            </div>
            <div class="form-group col s1">
                <a class="btn-floating removetrainingAndSeminarsInfo" ><i class="material-icons" >remove</i></a>
            </div>
        </div>
        `;

}

function employment_field_component(nameAndAddress, nature, fromDate, toDate, position, reasonForLeaving){
    return   `
            <div class="row employmentRecordInfo">
                <div class="form-group col s4">
                    <input type="text" class="company_name validate" name="company_name" placeholder="Name & Address of Company" value = "${nameAndAddress}"  required>
                </div>
                <div class="form-group col s2">
                    <input type="text" class="company_nature validate"  name="company_nature" placeholder="Nature of Business" value = "${nature}"  required>
                </div>
                <div class="form-group col s1">
                    <input type="date" class="company_start form-control-label"  name="company_start" value = "${fromDate.slice(0, 10)}"  required>
                </div>
                <div class="form-group col s1">
                    <input type="date" class="company_end form-control-label"  name="company_end" value = "${toDate.slice(0, 10)}"  required>
                </div>
                <div class="form-group col s2">
                    <input type="text" class="company_position validate"  name="company_position" placeholder="Position Held" value = "${position}"  required>
                </div>
                <div class="form-group col s1">
                    <input type="text" class="company_leave validate"  name="company_leave" placeholder="Reason" value = "${reasonForLeaving}"  required>
                </div>
                <div class="form-group col s1">
                    <a class="btn-floating removeEmploymentRecordInfo" ><i class="material-icons" >remove</i></a>
                </div>
            </div>
        `;
}

function organizations_field_component(name, position, inclusiveYears){
    return `
            <div class="row organizationInfo">
                <div class="form-group col s4">
                    <input type="text" class="org_name validate" name="org_name" placeholder="Organization Name"  value = "${name}" required>
                </div>
                <div class="form-group col s4">
                    <input type="text" class="org_position validate"  name="org_position" placeholder="Position"  value = "${position}" required>
                </div>
                <div class="form-group col s3">
                    <input type="text" class="org_inclusive_years validate"  name="org_inclusive_years" placeholder="Years"  value = "${inclusiveYears}" required>
                </div>
                <div class="form-group col s1">
                    <a class="btn-floating removeOrganizationInfo"><i class="material-icons">remove</i></a>
                </div>
            </div>
        `;
}

function character_field_component(name, relationship, occupation, companyNameAndAddress, contactNum, index){

    let removeHTML = ``;
    
    if(index >= 5){
        removeHTML= `  
            <div class="form-group col s1">
                <a class="btn-floating removeCharacterReferencesInfo"><i class="material-icons">remove</i></a>
            </div>
            `;
    }


    return         `
        <div class="row characterReferencesInfo">
            <div class="form-group col s3">
                <input type="text" class="cr_name validate" name="cr_name" placeholder="Name"  value = "${name}" required>
            </div>
            <div class="form-group col s2">
                <input type="text" class="cr_relationship validate"  name="cr_relationship" placeholder="Relationship"  value = "${relationship}" required>
            </div>
            <div class="form-group col s2">
                <input type="text" class="cr_occupation validate"  name="cr_occupation" placeholder="Occupation"  value = "${occupation}" required>
            </div>
            <div class="form-group col s3">
                <input type="text" class="cr_nameadd validate"  name="cr_nameadd" placeholder="Company Name & Address"  value = "${companyNameAndAddress}" required>
            </div>
            <div class="form-group col s1">
                <input type="text" class="cr_num format_cell_num validate"  name="cr_num" onkeypress="return isNumberKey(event)" placeholder="Mobile No."  value = "${contactNum}" required>
            </div>
            ${removeHTML}

        </div>
    `
}