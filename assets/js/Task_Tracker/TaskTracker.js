

/**
 * Returns a promise of all notifications of the user 
 * @returns {Promise} 
 */
async function getUserNotifications(){
    return new Promise((resolve, reject) => {
        ajax.get("/getMyNotifications", function (notificationsData, err) {
            resolve(notificationsData);
        });
    });
}

/**
 *     Groups notifications by referenceType
 *     @params  {unfilteredNotifs} all notifs in 1 array
 * 
 *     @returns {notifs} object containing objects with arrays of notifs.
 *                  eg. 
 *                  NotifsByType.application = notifs with "application" as the referenceType
 *                  NotifsByType.PRF = notifs with "PRF" as the referenceType
 */
async function filterNotifsByType(unfilteredNotifs){
    return new Promise((resolve, reject) => {

        /**
         * Initialize objects to return/resolve
         *  add for all that needs to be filtered.
        */
        var notifs = new Object();
        notifs.application = [];
        notifs.prf = [];
        notifs.offboarding = [];

        for(let i=0; i  <= unfilteredNotifs.length; i++){
            console.log(i)
            if(i == unfilteredNotifs.length){
                
                resolve(notifs);
                
            }else{

                let referenceType = unfilteredNotifs[i].referenceType;
                switch(referenceType){
                    case "application": 

                        notifs.application.push(unfilteredNotifs[i]);
                        break;
                    case "PRF": 

                        notifs.prf.push(unfilteredNotifs[i]);
                        break;
                    case "offboarding": 

                        notifs.offboarding.push(unfilteredNotifs[i]);
                        break;
                }
                
            }
        }
    });
}


async function process_PRF(arrNotif){
    return new Promise((resolve, reject) => {
        // code here
        
        var tasks_PRF = [];
        console.log(arrNotif);

        var userID, position, requisitionID, task;

        for(let i=0; i <= arrNotif.length; i++){
            if(i==arrNotif.length){
                resolve(tasks_PRF);
            }else{


                userID = arrNotif[i].receiver._id;
                position = arrNotif[i].receiver.position;
                requisitionID = arrNotif[i].reference.requisitionID;
                task = arrNotif[i].task;

                console.log(`${userID} - ${position} - ${requisitionID} - ${task}`);

                PRFModel.find( { requisition : { $in : [] } } );
                



            }
        }

    })
}

async function process_offboarding(arrNotif){
    return new Promise((resolve, reject) => {
        // code here
        setTimeout(()=>{resolve("process_offboarding resolve");}, 2000)
        // resolve("process_offboarding resolve");
    })
}

async function process_exitsurvey(arrNotif){
    return new Promise((resolve, reject) => {
        // code here

        setTimeout(()=>{ resolve("process_exitsurvey resolve");}, 2000)
        // resolve("process_exitsurvey resolve");
    })
}

/**
 * returns all task info based on the categorized notifs array
 * 
 * @param {*} NotifsByType 
 * @returns {prf, offboarding, exitsurvey} processed tasks data
 */
async function ProcessNotifsByTypeToTask(NotifsByType){
    
    // define per type then assign with the fucntion that processes that type
    const get_prf = process_PRF(NotifsByType.prf);
    const get_offboarding = process_offboarding(NotifsByType.offboarding);
    const get_exitsurvey = process_offboarding(NotifsByType.exitsurvey);

    // returns after all promises are fulfilled
    return {
        prf: await get_prf,
        offboarding: await get_offboarding,
        exitsurvey: await get_exitsurvey,
    }
}


$(window).load(async function () {
    try {

        //waits to get all user notifications
        let unfilteredUserNotifications = await getUserNotifications();
        console.log("unfilteredUserNotifications");
        console.log(unfilteredUserNotifications);

        // waits to get the filtered notifications by referenceType
        let NotifsByType = await filterNotifsByType(unfilteredUserNotifications);
        console.log("NotifsByType");
        console.log(NotifsByType);

        let Processed_NotifsByTypeToTask = await ProcessNotifsByTypeToTask(NotifsByType);
        console.log("Processed_NotifsByTypeToTask");
        console.log(Processed_NotifsByTypeToTask);




       
    } catch(e) {
        console.log(e);
    }
    


})