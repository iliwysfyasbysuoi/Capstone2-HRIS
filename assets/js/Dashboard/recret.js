// applications
const recstartDate = document.getElementById("recstartDate");
const recendDate = document.getElementById("recendDate");
// real date value holders
const recrealStartDate = document.getElementById("realStartDate");
const recrealEndDate = document.getElementById("realEndDate");
// canvas
const recSucRate = document.getElementById("rec-suc").getContext("2d");
const recProgRate = document.getElementById("rec-prog").getContext("2d");
let recSucRateChart;
let recProgRateChart;
// submission data holders
// suc rate
const applicationApprovedForForm = document.getElementById(
  "applicationApproved"
);
const applicationRejectedForForm = document.getElementById(
  "applicationRejected"
);
const applicationOthersForForm = document.getElementById("applicationOthers");
const applicationTotalForForm = document.getElementById("applicationTotal");
// prog rate
const appCurrPendingAssHRManagerForForm = document.getElementById(
  "appCurrPendingAssHRManager"
);
const appCurrPendingInterviewAssHRManagerForForm = document.getElementById(
  "appCurrPendingInterviewAssHRManager"
);
const appCurrPendingHRPartnerForForm = document.getElementById(
  "appCurrPendingHRPartner"
);
const appCurrPendingInterviewHRPartnerForForm = document.getElementById(
  "appCurrPendingInterviewHRPartner"
);
const appCurrPendingDHeadForForm = document.getElementById(
  "appCurrPendingDHead"
);
const appCurrPendingInterviewDHeadForForm = document.getElementById(
  "appCurrPendingInterviewDHead"
);
const appCurrPendingBUHeadForForm = document.getElementById(
  "appCurrPendingBUHead"
);

// offboarding
// canvas
const attrition = document.getElementById("attrition").getContext("2d");
let attrChart;
// form data holders
const resignationForForm = document.getElementById("resignation");
const terminationForForm = document.getElementById("terminator");
const retirementForForm = document.getElementById("retirement");

// exit survey
// canvas
const exitInt = document.getElementById("exit-int").getContext("2d");
let exitIntChart;
//form data holders
const betterPayelsewhereForForm = document.getElementById("betterPayelsewhere");
const betterBenefitselsewhereForForm = document.getElementById(
  "betterBenefitselsewhere"
);
const betterJobOpportunitieselsewhereForForm = document.getElementById(
  "betterJobOpportunitieselsewhere"
);
const commuteForForm = document.getElementById("commute");
const conflictwithotherEmployeesForForm = document.getElementById(
  "conflictwithotherEmployees"
);
const familyandPersonalReasonsForForm = document.getElementById(
  "familyandPersonalReasons"
);
const relocationMoveForForm = document.getElementById("relocationMove");
const companyInstabilityForForm = document.getElementById("companyInstability");
const othersForForm = document.getElementById("others");
const totalExitSurveysForForm = document.getElementById("totalExitSurveys");

// date input validation
$(document).on("change", "#recstartDate", function () {
  recendDate.min = recstartDate.value;
});
$(document).on("change", "#recendDate", function () {
  recstartDate.max = recendDate.value;
});
/**date range filter for applications */
$(document).on("click", "#recDateRange", function () {
  const startRange = recstartDate.value;
  const endRange = recendDate.value;
  //store date
  recrealStartDate.value = startRange;
  recrealEndDate.value = endRange;
  $.get(
    `/get-chart-data/recruitment-retention/applications/${startRange}/${endRange}`,
    function (data, err) {
      if (err != "success") return console.error(err);
      // console.log(data);

      // format and inject data to charts
      const {
        applicationApproved,
        applicationRejected,
        applicationOthers,
        applicationTotal,
        appCurrPendingAssHRManager,
        appCurrPendingInterviewAssHRManager,
        appCurrPendingHRPartner,
        appCurrPendingInterviewHRPartner,
        appCurrPendingDHead,
        appCurrPendingInterviewDHead,
        appCurrPendingBUHead,
      } = data;
      // console.log("data applications ", data);
      // set data for form submission
      // store form data
      applicationApprovedForForm.value = applicationApproved;
      applicationRejectedForForm.value = applicationRejected;
      applicationOthersForForm.value = applicationOthers;
      applicationTotalForForm.value = applicationTotal;

      appCurrPendingAssHRManagerForForm.value = appCurrPendingAssHRManager;
      appCurrPendingInterviewAssHRManagerForForm.value =
        appCurrPendingInterviewAssHRManager;
      appCurrPendingHRPartnerForForm.value = appCurrPendingHRPartner;
      appCurrPendingInterviewHRPartnerForForm.value =
        appCurrPendingInterviewHRPartner;
      appCurrPendingDHeadForForm.value = appCurrPendingDHead;
      appCurrPendingInterviewDHeadForForm.value = appCurrPendingInterviewDHead;
      appCurrPendingBUHeadForForm.value = appCurrPendingBUHead;
      // chart
      const recSucRateConfig = chart(
        [
          "Accepted Applicants",
          "Rejected Applicants",
          "Other Applicants",
          "Total Applicants",
        ],
        1,
        [``],
        [
          [
            applicationApproved,
            applicationRejected,
            applicationOthers,
            applicationTotal,
          ],
        ],
        pieBGC,
        pieBorC,
        [4],
        "polarArea",
        {}
      );
      const recProgRateConfig = chart(
        ["Current Progress"],
        7,
        [
          "Pending (Assistant HR Manager)",
          "Pending Inverview (Assistant HR Manager)",
          "Pending (HR Partner)",
          "Pending Inverview (HR Partner)",
          "Pending (Department Head)",
          "Pending Inverview (Department Head)",
          "Pending (Business Unit Head)",
        ],
        [
          [appCurrPendingAssHRManager],
          [appCurrPendingInterviewAssHRManager],
          [appCurrPendingHRPartner],
          [appCurrPendingInterviewHRPartner],
          [appCurrPendingDHead],
          [appCurrPendingInterviewDHead],
          [appCurrPendingBUHead],
        ],
        barBGC,
        barBorC,
        [4],
        "bar",
        {}
      );
      // chart
      recSucRateChart.destroy();
      recSucRateChart = new Chart(recSucRate, recSucRateConfig);
      recProgRateChart.destroy();
      recProgRateChart = new Chart(recProgRate, recProgRateConfig);
    }
  );
});
$(window).load(function () {
  $("#dashboard-report").addClass("active-menu");
  // recuritment success rate
  // Recruitment Progress Rate
  $.get(
    `/get-chart-data/recruitment-retention/applications`,
    function (data, err) {
      if (err != "success") return console.error(err);
      // setup date range
      const dateNow = new Date();
      const dateNowStr = dateNow.toISOString().substring(0, 10);
      recendDate.value = dateNowStr;
      const date1YrAgo = new Date(
        dateNow.setFullYear(dateNow.getFullYear() - 1)
      )
        .toISOString()
        .substring(0, 10);
      recstartDate.value = date1YrAgo;
      // store date
      recrealEndDate.value = dateNowStr;
      recrealStartDate.value = date1YrAgo;
      // console.log(data);
      // format and inject data to charts
      const {
        applicationApproved,
        applicationRejected,
        applicationOthers,
        applicationTotal,
        appCurrPendingAssHRManager,
        appCurrPendingInterviewAssHRManager,
        appCurrPendingHRPartner,
        appCurrPendingInterviewHRPartner,
        appCurrPendingDHead,
        appCurrPendingInterviewDHead,
        appCurrPendingBUHead,
      } = data;
      // set data for form submission
      applicationApprovedForForm.value = applicationApproved;
      applicationRejectedForForm.value = applicationRejected;
      applicationOthersForForm.value = applicationOthers;
      applicationTotalForForm.value = applicationTotal;

      appCurrPendingAssHRManagerForForm.value = appCurrPendingAssHRManager;
      appCurrPendingInterviewAssHRManagerForForm.value =
        appCurrPendingInterviewAssHRManager;
      appCurrPendingHRPartnerForForm.value = appCurrPendingHRPartner;
      appCurrPendingInterviewHRPartnerForForm.value =
        appCurrPendingInterviewHRPartner;
      appCurrPendingDHeadForForm.value = appCurrPendingDHead;
      appCurrPendingInterviewDHeadForForm.value = appCurrPendingInterviewDHead;
      appCurrPendingBUHeadForForm.value = appCurrPendingBUHead;
      // chart
      const recSucRateConfig = chart(
        [
          "Accepted Applicants",
          "Rejected Applicants",
          "Other Applicants",
          "Total Applicants",
        ],
        1,
        [``],
        [
          [
            applicationApproved,
            applicationRejected,
            applicationOthers,
            applicationTotal,
          ],
        ],
        pieBGC,
        pieBorC,
        [4],
        "polarArea",
        {}
      );
      const recProgRateConfig = chart(
        ["Current Progress"],
        7,
        [
          "Pending (Assistant HR Manager)",
          "Pending Inverview (Assistant HR Manager)",
          "Pending (HR Partner)",
          "Pending Inverview (HR Partner)",
          "Pending (Department Head)",
          "Pending Inverview (Department Head)",
          "Pending (Business Unit Head)",
        ],
        [
          [appCurrPendingAssHRManager],
          [appCurrPendingInterviewAssHRManager],
          [appCurrPendingHRPartner],
          [appCurrPendingInterviewHRPartner],
          [appCurrPendingDHead],
          [appCurrPendingInterviewDHead],
          [appCurrPendingBUHead],
        ],
        barBGC,
        barBorC,
        [4],
        "bar",
        {}
      );
      // chart
      recSucRateChart = new Chart(recSucRate, recSucRateConfig);
      recProgRateChart = new Chart(recProgRate, recProgRateConfig);
    }
  );
  // attrition rate
  $.get(
    `/get-chart-data/recruitment-retention/offboarding`,
    function (data, err) {
      if (err != "success") return console.error(err);
      const { resignations, terminator, retirements } = data;
      // console.log(data);
      // form data set
      resignationForForm.value = resignations;
      terminationForForm.value = terminator;
      retirementForForm.value = retirements;
      // chart
      const attrConfig = chart(
        ["Last 30 days"],
        3,
        ["Resignations", "Terminations", "Retirement"],
        [[resignations], [terminator], [retirements]],
        barBGC,
        barBorC,
        [4],
        "bar",
        {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }
      );
      attrChart = new Chart(attrition, attrConfig);
    }
  );
  // exit interview feed
  $.get(
    `/get-chart-data/recruitment-retention/exit-survey`,
    function (data, err) {
      if (err != "success") return console.error(err);
      const {
        betterPayelsewhere,
        betterBenefitselsewhere,
        betterJobOpportunitieselsewhere,
        commute,
        conflictwithotherEmployees,
        familyandPersonalReasons,
        relocationMove,
        companyInstability,
        others,
        totalExitSurveys,
      } = data;
      // form data
      betterPayelsewhereForForm.value = betterPayelsewhere;
      betterBenefitselsewhereForForm.value = betterBenefitselsewhere;
      betterJobOpportunitieselsewhereForForm.value =
        betterJobOpportunitieselsewhere;
      commuteForForm.value = commute;
      conflictwithotherEmployeesForForm.value = conflictwithotherEmployees;
      familyandPersonalReasonsForForm.value = familyandPersonalReasons;
      relocationMoveForForm.value = relocationMove;
      companyInstabilityForForm.value = companyInstability;
      othersForForm.value = others;
      totalExitSurveysForForm.value = totalExitSurveys;
      // chart
      const exitIntConfig = chart(
        [`${totalExitSurveys} Exit Surveys in Total`],
        9,
        [
          "Better Pay elsewhere",
          "Better Benefits elsewhere",
          "Better Job Opportunities elsewhere",
          "Commute",
          "Conflict with other Employees",
          "Family and Personal Reasons",
          "Relocation/Move",
          "Company Instability",
          "Others",
          // "Others1",
          // "Others2",
          // "Others3",
          // "Others4",
          // "Others5",
          // "Others6",
          // "Others7",
          // "Others8",
          // "Others9",
          // "Others0",
          // "Others-",
          // "Others=",
          // "Othersj",
          // "Othersh",
          // "Otherss",
        ],
        [
          [betterPayelsewhere],
          [betterBenefitselsewhere],
          [betterJobOpportunitieselsewhere],
          [commute],
          [conflictwithotherEmployees],
          [familyandPersonalReasons],
          [relocationMove],
          [companyInstability],
          [others],
          // [1],
          // [1],
          // [1],
          // [1],
          // [1],
          // [1],
          // [1],
          // [1],
          // [1],
          // [1],
          // [1],
          // [1],
          // [1],
          // [1],
          // [1],
          // [1],
          // [1],
          // [1],
          // [1],
          // [1],
          // [1],
          // [1],
          // [1],
          // [1],
        ],
        barBGC,
        barBorC,
        [4],
        "bar",
        {}
      );
      exitIntChart = new Chart(exitInt, exitIntConfig);
    }
  );
});
