

// $(window).load(function () {
//     display(null)
// })


// let formatDate = (string) => {
//     if (string === "") {
//         return "-";
//     } else {
//         let date = new Date(string);
//         var month = date.toLocaleString("default", { month: "short" });
//         return month + ". " + date.getDate() + ", " + date.getFullYear();
//     }
// }


// let display = (filter) => {
//     $.get(`/getAllOffboardingData`, function (offboarding, err) {
//         if (filter === 'none') {
//             window.location.href = "/OffboardingTracker"
//         }
//         if (filter === null) {
//             offboarding.map(data => {
//                 $(".dataInfo").append(`
//                 <tr onclick="window.location.href = '/OffboardingTracker/${data._id}';">
//                     <td>${data.offboardingID}</td>
//                     <td>${data.name}</td>
//                     <td>${data.position}</td>
//                     <td>${data.businessUnit}</td>
//                     <td>${data.department}</td>
//                     <td>${formatDate(data.requestDate)}</td>
//                     <td>${data.status}</td>
//                     <td>${formatDate(data.updatedDate)}</td>
//                 </tr>
//         `)
//             })
//         }
//         else {
//             offboarding.map(data => {
//                 if (filter === data.status)
//                     $(".dataInfo").append(`
//                 <tr onclick="window.location.href = '/OffboardingTracker/${data._id}';">
//                     <td>${data.offboardingID}</td>
//                     <td>${data.name}</td>
//                     <td>${data.position}</td>
//                     <td>${data.businessUnit}</td>
//                     <td>${data.department}</td>
//                     <td>${data.requestDate}</td>
//                     <td>${data.status}</td>
//                     <td>${formatDate(data.updatedDate)}</td>
//                 </tr>
//         `)
//             })
//         }
// }
