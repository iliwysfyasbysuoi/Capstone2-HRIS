$(window).load(function () {
            
});

$(document).on("click", ".J1", function () {
    $.get("/Test-agenda-js/test", {description: "werk"}, function(data, result){
        // alert(data);
    })
});

$(document).on("click", ".J2", function () {
    $.get("/Test-agenda-js/delete_applicants_data_after_6_months", {requisitionID: 1}, function(data, result){
        // alert(data);
    })
});

$(document).on("click", ".J3", function () {
    $.get("/Test-agenda-js/TEST_data_deletion_for_offboarding_employee", function(data, result){
        // alert(data);
    })
});