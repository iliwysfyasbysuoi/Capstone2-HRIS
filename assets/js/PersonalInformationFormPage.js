


$(window).load(function () {

    // initializes the modal UI
    $('.modal').modal();


});



// add/remove Children
$(document).on("click", ".removeChild", function () {
    $(this).parent().parent().remove();


})

$(document).on("click", ".addChild", function () {
    $('#childrenSection').append(
        `
            <tr class = "child-info">
                <td>
                    <input class="child_name"  name="child_name" type="text" class="validate" required>
                </td>
                <td>
                    <input class="child_birth" name="child_birth" type="date" class="validate" required>
                </td>
                <td>
                    <a class="btn-floating removeChild" style = "position: relative; left: 15px;"><i class="material-icons" >remove</i></a>
                </td>
            </tr>
        `
    )
});


//  add/remove sibling

$(document).on("click", ".removeSibling", function () {
    $(this).parent().parent().remove();
})

$(document).on("click", ".addSibling", function () {
    $('#siblingsSection').append(
        `
            <tr class="sibling-info">
                <td>
                    <input class="sibling_name" name="sibling_name" type="text" class="validate" required>
                </td>
                <td>
                    <input class="sibling_birth" name="sibling_birth" type="date" class="validate" required>
                </td>
                <td>
                    <select name="sibling_status" id="sibling_status"  name="sibling_status" required>
                        <option value="" disabled selected>Select Civil Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Separated">Separated</option>
                        <option value="Widowed">Widowed</option>
                    </select>
                </td>
                <td>
                    <a class="btn-floating removeSibling" style = "position: relative; left: 15px;"><i class="material-icons" >remove</i></a>
                <td>
            </tr>
        `
    )
});


//  add/remove EducationLevelInfo

$(document).on("click", ".removeEducationLevelInfo", function () {
    $(this).parent().parent().remove();
})

$(document).on("click", ".addEducationLevelInfo", function () {
    $('#educationalLevelInfoSection').append(
        `
        <div class="col s12 educationLevelInfo">
            <div class="form-group col s2">
                
                <select name="school_level" id="school_level"  name="school_level" required>
                    <option value="" disabled selected>Select Civil Status</option>
                    <option value="Junior High School">Junior High School</option>
                    <option value="Senior High School">Senior High School</option>
                    <option value="Bachelor">Bachelor</option>
                    <option value="Master">Master</option>
                    <option value="Doctor">Doctor</option>
                </select>
            </div>
            <div class="form-group col s2">
                <input class="school_name validate" name="school_name" type="text" placeholder="Name of School" required>
            </div>
            <div class="form-group col s2">
                <input class="school_start form-control-label" name="school_start" type="date" required>
            </div>
            <div class="form-group col s2">
                <input class="school_end form-control-label" name="school_end" type="date" required>
            </div>
            <div class="form-group col s3">
                <input class="school_degree validate" name="school_degree" type="text" placeholder="Degree/Course" required>
            </div>
            <div class="form-group col s1">
                <a class="btn-floating removeEducationLevelInfo" style = "position: relative; left: 15px;"><i class="material-icons" >remove</i></a>
            </div>
        </div>
        `
    )
});


//  add/remove examInfo

$(document).on("click", ".removeExamInfo", function () {
    $(this).parent().parent().remove();
})

$(document).on("click", ".addExamInfo", function () {
    $('#ExamsSection').append(
        `
            <div class="row examInfo">
                <div class="form-group col s3">
                    <input type="text" class="exam_name validate" name="exam_name" placeholder="Name of Examination" required>
                </div>
                <div class="form-group col s2">
                    <input type="date" class="exam_start form-control-label"  name="exam_start" required>
                </div>
                <div class="form-group col s2">
                    <input type="date" class="exam_end form-control-label"  name="exam_end" required>
                </div>
                <div class="form-group col s2">
                    <input type="text" class="exam_rate validate" name="exam_rate"  placeholder="Rating" required>
                </div>
                <div class="form-group col s2">
                    <input type="text" class="exam_rank validate" name="exam_rank"  placeholder="Rank" required>
                </div>
                <div class="form-group col s1">
                    <a class="btn-floating removeExamInfo"  style = "position: relative; left: 15px;"><i class="material-icons" >remove</i></a>
                </div>
            </div>
        

        `
    )
});


//  add/remove trainings and seminars

$(document).on("click", ".removetrainingAndSeminarsInfo", function () {
    $(this).parent().parent().remove();
})

$(document).on("click", ".addtrainingAndSeminarsInfo", function () {
    $('#trainingsAndSeminarsSection').append(
        `
        <div class="row trainingAndSeminarsInfo">
            <div class="form-group col s5">
                <input type="text" class="train_title validate" name="train_title"  placeholder="Title of Seminar" required>
            </div>
            <div class="form-group col s4">
                <input type="text" class="train_org validate"  name="train_org" placeholder="Organizer" required>
            </div>
            <div class="form-group col s2">
                <input type="date" class="train_date form-control-label"  name="train_date" required>
            </div>
            <div class="form-group col s1">
                <a class="btn-floating removetrainingAndSeminarsInfo" ><i class="material-icons" >remove</i></a>
            </div>
        </div>

        `
    )
});

//  add/remove employement record

$(document).on("click", ".removeEmploymentRecordInfo", function () {
    $(this).parent().parent().remove();
})

$(document).on("click", ".addEmploymentRecordInfo", function () {
    $('#employmentRecordSection').append(
        `
            <div class="row employmentRecordInfo">
                <div class="form-group col s4">
                    <input type="text" class="company_name validate" name="company_name" placeholder="Name & Address of Company" required>
                </div>
                <div class="form-group col s2">
                    <input type="text" class="company_nature validate"  name="company_nature" placeholder="Nature of Business" required>
                </div>
                <div class="form-group col s1">
                    <input type="date" class="company_start form-control-label"  name="company_start" required>
                </div>
                <div class="form-group col s1">
                    <input type="date" class="company_end form-control-label"  name="company_end" required>
                </div>
                <div class="form-group col s2">
                    <input type="text" class="company_position validate"  name="company_position" placeholder="Position Held" required>
                </div>
                <div class="form-group col s1">
                    <input type="text" class="company_leave validate"  name="company_leave" placeholder="Reason" required>
                </div>
                <div class="form-group col s1">
                    <a class="btn-floating removeEmploymentRecordInfo" ><i class="material-icons" >remove</i></a>
                </div>
            </div>
        
        `
    )
});

//  add/remove organization

$(document).on("click", ".removeOrganizationInfo", function () {
    $(this).parent().parent().remove();
})

$(document).on("click", ".addOrganizationInfo", function () {
    $('#organizationsSection').append(
        `
            <div class="row organizationInfo">
                <div class="form-group col s4">
                    <input type="text" class="org_name validate" name="org_name" placeholder="Organization Name" required>
                </div>
                <div class="form-group col s4">
                    <input type="text" class="org_position validate"  name="org_position" placeholder="Position" required>
                </div>
                <div class="form-group col s3">
                    <input type="text" class="org_inclusive_years validate"  name="org_inclusive_years" placeholder="Years" required>
                </div>
                <div class="form-group col s1">
                    <a class="btn-floating removeOrganizationInfo"><i class="material-icons">remove</i></a>
                </div>

            </div>

        `
    )
});

//  add/remove character references

$(document).on("click", ".removeCharacterReferencesInfo", function () {
    $(this).parent().parent().remove();
})

$(document).on("click", ".addCharacterReferencesInfo", function () {
    $('#characterReferencesSection').append(
        `
            <div class="row characterReferencesInfo">
                <div class="form-group col s3">
                    <input type="text" class="cr_name validate" name="cr_name" placeholder="Name" required>
                </div>
                <div class="form-group col s2">
                    <input type="text" class="cr_relationship validate"  name="cr_relationship" placeholder="Relationship" required>
                </div>
                <div class="form-group col s2">
                    <input type="text" class="cr_occupation validate"  name="cr_occupation" placeholder="Occupation" required>
                </div>
                <div class="form-group col s3">
                    <input type="text" class="cr_nameadd validate"  name="cr_nameadd" placeholder="Company Name & Address" required>
                </div>
                <div class="form-group col s1">
                    <input type="text" class="cr_num format_cell_num validate"  name="cr_num" onkeypress="return isNumberKey(event)" placeholder="Mobile No." required>
                </div>
                <div class="form-group col s1">
                    <a class="btn-floating removeCharacterReferencesInfo"><i class="material-icons">remove</i></a>
                </div>

            </div>

        `
    )
});


$(document).on("change", "#date_birth", function () {
   var date_birth = $("#date_birth").val();
   var dob = new Date(date_birth);

   //calculate month difference from current date in time  
   var month_diff = Date.now() - dob.getTime();  
      
   //convert the calculated difference in date format  
   var age_dt = new Date(month_diff);   
     
   //extract year from date      
   var year = age_dt.getUTCFullYear();  
     
   //now calculate the age of the user  
   var age = Math.abs(year - 1970);  

   $("#age_text").val(age);
   $("#age").val(age);

});

/**
 * auto adds hypen on cellnum inputs 
 * returns xxxx-xxxx-xxx format
 */
$(document).on("keyup", ".format_cell_num", function(){
    var cell_num = $(this).val();
    cell_num = cell_num.split('-').join('');    // Remove dash (-) if mistakenly entered.
    first4 = cell_num.slice(0,4);
    if(Array.from(cell_num).length>4){
            first3 = cell_num.slice(4,7);
        $(this).val(first4+"-"+first3);
        if(Array.from(cell_num).length>7){
                sec4 = cell_num.slice(7,11);
            $(this).val(first4+"-"+first3+"-" +sec4);
        }
    }else{
        $(this).val(first4);
    }
})

/**
 * auto adds hypen on telnum inputs 
 * returns 00-0000-0000 OR 0000-0000 format
 */
 $(document).on("keyup", ".format_tel_num", function(){
    var tel_num = $(this).val();
    tel_num = tel_num.split('-').join('');    // Remove dash (-) if mistakenly entered.
    
    console.log(tel_num.slice(0,2).toString());

    if(tel_num.slice(0,2).toString() == "02"){
        $(this).attr("maxlength", "12");
        tel_num = tel_num.split('-').join('');    // Remove dash (-) if mistakenly entered.
        firsttwo = tel_num.slice(0,2);
        if(Array.from(tel_num).length>2){
            var first4 = tel_num.slice(2,6);
            $(this).val(firsttwo+"-"+first4);
            if(Array.from(tel_num).length>6){
                var sec4 = tel_num.slice(6,10);
                $(this).val(firsttwo+"-"+first4+"-" +sec4);
            }
        }else{
            $(this).val(firsttwo);
        }
    }
    else if(tel_num.slice(0,2).toString() == "03"){
        $(this).attr("maxlength", "12");
        tel_num = tel_num.split('-').join('');    // Remove dash (-) if mistakenly entered.
        first3 = tel_num.slice(0,3);
        if(Array.from(tel_num).length>3){
            var sec3 = tel_num.slice(3,6);
            $(this).val(first3+"-"+sec3);
            if(Array.from(tel_num).length>6){
                var first4 = tel_num.slice(6,10);
                $(this).val(first3+"-"+sec3+"-" +first4);
            }
        }else{
            $(this).val(first3);
        }
    }else{
        $(this).attr("maxlength", "9");
        tel_num = tel_num.split('-').join('');    // Remove dash (-) if mistakenly entered.
        first4 = tel_num.slice(0,4);
        if(Array.from(tel_num).length>4){
            var sec4 = tel_num.slice(4,8);
            $(this).val(first4+"-"+sec4);
        }
        else{
            $(this).val(first4);
        }
    }
    
})

/**
 * auto adds hypen on SSS inputs 
 * returns xx-xxxxxx7-x format
 */
 $(document).on("keyup", ".format_sss", function(){
    var sss = $(this).val();
    sss = sss.split('-').join('');    // Remove dash (-) if mistakenly entered.
    
    first = sss.slice(0,2);

    if(Array.from(sss).length>2){
        second = sss.slice(2,9);
        $(this).val(first+"-"+second);

        if(Array.from(sss).length>9){
            third = sss.slice(9,10);
            $(this).val(first+"-"+second+"-" +third);
        }
    }else{
        $(this).val(first);
    }
})

/**
 * auto adds hypen on tin inputs 
 * returns xxx-xxx-xxx-xxx format
 */
 $(document).on("keyup", ".format_tin", function(){
    var sss = $(this).val();
    sss = sss.split('-').join('');    // Remove dash (-) if mistakenly entered.
    sss = sss.match(/.{1,3}/g).join('-');

    $(this).val(sss);
    
   
})

/**
 * auto adds hypen on hdmf inputs 
 * returns xxxx-xxxx-xxxxformat
 */
 $(document).on("keyup", ".format_hdmf", function(){
    var hdmf = $(this).val();
    hdmf = hdmf.split('-').join('');    // Remove dash (-) if mistakenly entered.
    hdmf = hdmf.match(/.{1,4}/g).join('-');

    $(this).val(hdmf);
    
   
})

/**
 * auto adds hypen on philhealth inputs 
 * returns xxxx-xxxx-xxxx format
 */
 $(document).on("keyup", ".format_philhealth", function(){
    var hdmf = $(this).val();
    hdmf = hdmf.split('-').join('');    // Remove dash (-) if mistakenly entered.
    hdmf = hdmf.match(/.{1,4}/g).join('-');

    $(this).val(hdmf);
    
   
})

function verifyConsent(){
    var TAC_consent = $("#TAC_consent").is(':checked'); 
    var DP_consent = $("#DP_consent").is(':checked'); 

    if(TAC_consent == true && DP_consent == true){
        $("#submit_PIF").prop("disabled", false);
        $("#save_PIF").prop("disabled", false);
    }else{
        $("#submit_PIF").prop("disabled", true);
        $("#save_PIF").prop("disabled", true);
    }
    
}

function isNumberKey(evt){
    // ensures number only
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57) ){
        return false;
    }else{
        return true;
    }
}






