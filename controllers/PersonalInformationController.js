const userModel = require('../models/userModel.js');
const personalInformationsModel = require('../models/personalInformationsModel.js');
const { ObjectId } = require('bson');

// converts date string yyyy-mm-dd to Date data 
function YYYYMMDDtoDate(date) {

    var sendDate = date.getFullYear() + "-" + (date.getMonth() + 1) +
        "-" + ("0" + date.getDate()).slice(-2) +
        "T" + ("0" + date.getHours()).slice(-2) + ":" +
        ("0" + date.getMinutes()).slice(-2) + ":" +
        ("0" + date.getSeconds()).slice(-2) +
        ".000+08:00";

    console.log(sendDate);

    return sendDate;
}

function DateInputStringToDate(datestring) {

    var datestringsplit = [];
    // datestringsplit = datestring.split("-");

    // var date = new Date(datestring[0],datestring[1], datestring[2]);

    return new Date(datestring);
}

const PersonalInformationController = {

    postPersonalInformationForm: function (req, res) {
        console.log("start postPersonalInformationForm");

        userProjection = " _id email firstName middleName lastName nickName userType businessUnit department position personalEmail employmentDate"
        userModel.findOne({ _id: req.session._id }, userProjection, function (err, userData) {
            console.log(req.body.date_marriage);

            var PersonalInformationData = {
                _id: new ObjectId(),
                user: userData,

                presentAddress: req.body.present_address,
                provincialAddress: req.body.provincial_address,
                telNum: req.body.tel_num,
                mobileNum: req.body.cell_num,
                dateOfBirth: new Date(req.body.date_birth),
                placeOfBirth: req.body.place_birth,
                age: req.body.age,
                gender: req.body.gender,
                weight: req.body.weight,
                height: req.body.height,
                civilStatus: req.body.civil_status,
                citizenship: req.body.citizenship,
                religion: req.body.religion,
                bloodType: req.body.blood_type,
                SSS: req.body.sss_no,
                TIN: req.body.tin,
                HDMF: req.body.hdmf_no,
                PhilHealth: req.body.philhealth,

                spouseName: req.body.spouse_name,
                //marriageDate moved below
                spouseOccupation: req.body.spouse_work,
                spouseEmployer: req.body.spouse_emp,
                spousePresentAddress: req.body.spouse_address,
                spouseTelNum: req.body.spouse_tel_num,
                spouseMobileNum: req.body.spouse_cell_num,

                children: {
                    // updated below if more than 1 
                    name: req.body.child_name,
                    dateOfBirth: new Date(req.body.child_birth)
                },

                fatherName: req.body.father_name,
                fatherHomeAddress: req.body.father_address,
                fatherOccupation: req.body.father_occupation,
                fatherCompany: req.body.father_company,

                motherName: req.body.mother_name,
                motherHomeAddress: req.body.mother_address,
                motherOccupation: req.body.mother_occupation,
                motherCompany: req.body.mother_company,

                siblings: {
                    // updated below if more than 1 
                    name: req.body.sibling_name,
                    dateOfBirth: new Date(req.body.sibling_birth),
                    civilStatus: req.body.sibling_status,

                },

                // II. Educational Background

                schoolRecords: {
                    // updated below if more than 1 
                    level: req.body.school_level,
                    nameAddress: req.body.school_name,
                    fromDate: new Date(req.body.school_start),
                    toDate: new Date(req.body.school_end),
                    degree: req.body.school_degree
                },
                award: req.body.award,
                exams: {
                    // updated below if more than 1 
                    name: req.body.exam_name,
                    examDate: new Date(req.body.exam_start),
                    passedDate: new Date(req.body.exam_end),
                    rating: req.body.exam_rate,
                    rank: req.body.exam_rank
                },
                trainingsAndSeminarInfo: {
                    // updated below if more than 1 
                    title: req.body.train_title,
                    organizer: req.body.train_org,
                    date: new Date(req.body.train_date)
                },

                //  III. Employment Record

                employmentRecordInfo: {
                    // updated below if more than 1 
                    nameAndAddress: req.body.company_name,
                    nature: req.body.company_nature,
                    fromDate: new Date(req.body.company_start),
                    toDate: new Date(req.body.company_end),
                    position: req.body.company_position,
                    reasonForLeaving: req.body.company_leave,
                },

                // IV. Organization


                organizations: {
                    // updated below if more than 1 
                    name: req.body.org_name,
                    position: req.body.org_position,
                    inclusiveYears: req.body.org_inclusive_years
                },

                characterReferences: {
                    // updated below if more than 1 
                    name: req.body.cr_name,
                    relationship: req.body.cr_relationship,
                    occupation: req.body.cr_occupation,
                    companyNameAndAddress: req.body.cr_nameadd,
                    contactNum: req.body.cr_num

                },

                //  V. Contact Information
                contactPerson: req.body.ci_person,
                contactRelationship: req.body.ci_relationship,
                contactAddress: req.body.ci_address,
                contactNumber: req.body.ci_num

            }

            if (req.body.date_marriage.charAt(4) == "-") {
                PersonalInformationData.marriageDate = new Date(req.body.date_marriage);
                console.log(typeof req.body.date_marriage);
                console.log("req.body.date_marriage.charAt(4) " + req.body.date_marriage.charAt(4));
                console.log("marriage date " + PersonalInformationData.marriageDate);
            } else {
                console.log("marriage date empty");
                console.log("req.body.date_marriage..charAt(4) " + req.body.date_marriage.charAt(4));
            }

            /* 
                separately inputs records with varying counts
            */

            //  for children
            console.log("typeof req.body.child_birth " + typeof req.body.child_birth);
            if (typeof req.body.child_birth == 'string') {
                // do nothing bec it already saves the info on the main object
            }
            else if (Array.isArray(req.body.child_birth) == false) {
                // if not an array, empty the default dates from the array
                PersonalInformationData.children = [];
                console.log("no input");
            } else if (req.body.child_birth.length > 1) {
                // else, add the objects separately
                console.log("more than 1 input");
                var childrenInfoArr = [];
                for (i = 0; i < req.body.child_birth.length; i++) {
                    // console.log("default date: " + req.body.child_birth[i]);
                    var childrenInfo = {
                        name: req.body.child_name[i],
                        dateOfBirth: new Date(req.body.child_birth[i])
                    }
                    childrenInfoArr.push(childrenInfo);

                }
                console.log(childrenInfoArr);
                PersonalInformationData.children = childrenInfoArr;
            }




            //  for siblings
            if (typeof req.body.sibling_birth == 'string') {
                // do nothing bec it already saves the info on the main object
            }
            else if (Array.isArray(req.body.sibling_birth) == false) {
                // if not an array, empty the default dates from the array
                PersonalInformationData.siblings = [];
            }
            else {
                var siblings_dateOfBirth = [];

                for (i = 0; i < req.body.sibling_birth.length; i++) {
                    var siblingInfo = {
                        name: req.body.sibling_name[i],
                        dateOfBirth: new Date(req.body.sibling_birth[i]), // updated below if more than 1 
                        civilStatus: req.body.sibling_status[i],
                    }
                    siblings_dateOfBirth.push(siblingInfo);
                }

                PersonalInformationData.siblings = siblings_dateOfBirth;

            }



            // for schoolRecords
            if (typeof req.body.school_start == 'string') {
                // do nothing bec it already saves the info on the main object
            }
            else if (Array.isArray(req.body.school_start) == false) {
                // if not an array, empty the default dates from the array
                PersonalInformationData.schoolRecords = [];
            }
            else {
                var schoolRecordsArr = [];
                for (i = 0; i < req.body.school_start.length; i++) {
                    var schoolRecordsInfo = {
                        level: req.body.school_level[i],
                        nameAddress: req.body.school_name[i],
                        fromDate: new Date(req.body.school_start[i]), // updated below if more than 1 
                        toDate: new Date(req.body.school_endv),// updated below if more than 1 
                        degree: req.body.school_degree[i]
                    }
                    schoolRecordsArr.push(schoolRecordsInfo);
                }

                PersonalInformationData.schoolRecords = schoolRecordsArr;
            }

            // for exams
            if (typeof req.body.exam_start == 'string') {
                // do nothing bec it already saves the info on the main object
            }
            else if (Array.isArray(req.body.exam_start) == false) {
                // if not an array, empty the default dates from the array
                PersonalInformationData.exams = [];
            } else {
                var examArr = [];
                for (i = 0; i < req.body.exam_start.length; i++) {
                    var examInfo = {
                        name: req.body.exam_name[i],
                        examDate: new Date(req.body.exam_start[i]), // updated below if more than 1 
                        passedDate: new Date(req.body.exam_end[i]), // updated below if more than 1 
                        rating: req.body.exam_rate[i],
                        rank: req.body.exam_rank[i]
                    }
                    examArr.push(examInfo);
                }


                PersonalInformationData.exams = examArr;
            }

            // for trainingsAndSeminarInfo
            if (typeof req.body.train_date == 'string') {
                // do nothing bec it already saves the info on the main object
            }
            else if (Array.isArray(req.body.train_date) == false) {
                // if not an array, empty the default dates from the array
                PersonalInformationData.trainingsAndSeminarInfo = [];
            } else {
                var trainingsAndSeminarInfoArr = [];
                for (i = 0; i < req.body.train_date.length; i++) {
                    var TASinfo = {
                        title: req.body.train_title[i],
                        organizer: req.body.train_org[i],
                        date: new Date(req.body.train_date[i]) // updated below if more than 1 
                    }
                    trainingsAndSeminarInfoArr.push(TASinfo);
                }

                PersonalInformationData.trainingsAndSeminarInfo = trainingsAndSeminarInfoArr;

            }

            // for employmentRecordInfo
            if (typeof req.body.company_start == 'string') {
                // do nothing bec it already saves the info on the main object
            }
            else if (Array.isArray(req.body.company_start) == false) {
                // if not an array, empty the default dates from the array
                PersonalInformationData.employmentRecordInfo = [];
            } else {
                var employmentRecordInfoArr = [];

                for (i = 0; i < req.body.company_start.length; i++) {
                    var TASinfo = {
                        nameAndAddress: req.body.company_name[i],
                        nature: req.body.company_nature[i],
                        fromDate: new Date(req.body.company_start[i]), // updated below if more than 1 
                        toDate: new Date(req.body.company_end[i]), // updated below if more than 1 
                        position: req.body.company_position[i],
                        reasonForLeaving: req.body.company_leave[i],
                    }
                    employmentRecordInfoArr.push(TASinfo);
                }
                PersonalInformationData.employmentRecordInfo = employmentRecordInfoArr;
            }

            // for organization
            if (typeof req.body.org_name == 'string') {
                // do nothing bec it already saves the info on the main object
            }
            else if (Array.isArray(req.body.org_name) == false) {
                // if not an array, empty the default dates from the array
                PersonalInformationData.organizations = [];
            } else {
                var organizationInfoArr = [];

                for (i = 0; i < req.body.org_name.length; i++) {
                    var organizationInfo = {
                        name: req.body.org_name[i],
                        position: req.body.org_position[i],
                        inclusiveYears: req.body.org_inclusive_years[i]
                    }
                    organizationInfoArr.push(organizationInfo);
                }
                PersonalInformationData.organizations = organizationInfoArr;
            }

            // for characterReferences
            if (typeof req.body.cr_name == 'string') {
                // do nothing bec it already saves the info on the main object
            }
            else if (Array.isArray(req.body.cr_name) == false) {
                // if not an array, empty the default dates from the array
                PersonalInformationData.characterReferences = [];
            } else {
                var characterReferencesArr = [];

                for (i = 0; i < req.body.cr_name.length; i++) {
                    var characterReferencesInfo = {
                        name: req.body.cr_name[i],
                        relationship: req.body.cr_relationship[i],
                        occupation: req.body.cr_occupation[i],
                        companyNameAndAddress: req.body.cr_nameadd[i],
                        contactNum: req.body.cr_num[i]
                    }
                    characterReferencesArr.push(characterReferencesInfo);
                }
                PersonalInformationData.characterReferences = characterReferencesArr;
            }

            /**
             * this saves the whole PersonalInformation Object
             */
            var PIDObject = new personalInformationsModel(PersonalInformationData);
            PIDObject.save();
            console.log("end postPersonalInformationForm");


            res.redirect("/JobListing");
        })


    },
    getPersonalInformationData: function (req, res) {
        // returns the PIF Data using the user's _id. returns null if no PIF.
        personalInformationsModel.findOne({ 'user._id': ObjectId(req.query.user_id) }, function (err, PIFData) {
            if (PIFData != null) {
                res.send(PIFData);
            } else {
                res.send("none");
            }

        })

    },
    getPersonalInformationPage: function (req, res) {
        // returns the PIF Data using the user's _id. 
        // redirects to the Form instread, if no PIF yet
        personalInformationsModel.findOne({ 'user._id': ObjectId(req.session._id) }, function (err, PIFData) {
            if (PIFData != null) {
                // i used "applicationData" just because I took the code from Applications Page and i need to adjust hehe
                var applicationData = {
                    personalInformation: PIFData
                }
                res.render("pages/Personal_Information_Page/PersonalInformationPage", { applicationData: applicationData });
            } else {
                res.redirect("/form/PersonalInformationForm");
            }

        });
    },
    deletePersonalInformation: function (req, res) {
        personalInformationsModel.findOne({ 'user._id': ObjectId(req.session._id) }, function (err, PIFData) {
            if (PIFData != null) {
                personalInformationsModel.deleteOne({ 'user._id': ObjectId(req.session._id) }, function () {
                    res.send("Delete successful");
                })
            } else {
                res.send("No record found")
            }

        });
    },
    updatePersonalInformationForm: function (req, res) {
        console.log("start updatePersonalInformationForm");


        personalInformationsModel.findOne({ 'user._id': ObjectId(req.session._id) }, function (err, PIFData) {
            if (PIFData != null) {
                var PIF_id = PIFData._id;

                userProjection = " _id email firstName middleName lastName nickName userType businessUnit department position personalEmail employmentDate"
                userModel.findOne({ _id: req.session._id }, userProjection, function (err, userData) {
                    console.log(req.body.date_marriage);

                    var PersonalInformationData = {
                        _id: new ObjectId(PIF_id),
                        user: userData,

                        presentAddress: req.body.present_address,
                        provincialAddress: req.body.provincial_address,
                        telNum: req.body.tel_num,
                        mobileNum: req.body.cell_num,
                        dateOfBirth: new Date(req.body.date_birth),
                        placeOfBirth: req.body.place_birth,
                        age: req.body.age,
                        gender: req.body.gender,
                        weight: req.body.weight,
                        height: req.body.height,
                        civilStatus: req.body.civil_status,
                        citizenship: req.body.citizenship,
                        religion: req.body.religion,
                        bloodType: req.body.blood_type,
                        SSS: req.body.sss_no,
                        TIN: req.body.tin,
                        HDMF: req.body.hdmf_no,
                        PhilHealth: req.body.philhealth,

                        spouseName: req.body.spouse_name,
                        //marriageDate moved below
                        spouseOccupation: req.body.spouse_work,
                        spouseEmployer: req.body.spouse_emp,
                        spousePresentAddress: req.body.spouse_address,
                        spouseTelNum: req.body.spouse_tel_num,
                        spouseMobileNum: req.body.spouse_cell_num,

                        children: {
                            // updated below if more than 1 
                            name: req.body.child_name,
                            dateOfBirth: new Date(req.body.child_birth)
                        },

                        fatherName: req.body.father_name,
                        fatherHomeAddress: req.body.father_address,
                        fatherOccupation: req.body.father_occupation,
                        fatherCompany: req.body.father_company,

                        motherName: req.body.mother_name,
                        motherHomeAddress: req.body.mother_address,
                        motherOccupation: req.body.mother_occupation,
                        motherCompany: req.body.mother_company,

                        siblings: {
                            // updated below if more than 1 
                            name: req.body.sibling_name,
                            dateOfBirth: new Date(req.body.sibling_birth),
                            civilStatus: req.body.sibling_status,

                        },

                        // II. Educational Background

                        schoolRecords: {
                            // updated below if more than 1 
                            level: req.body.school_level,
                            nameAddress: req.body.school_name,
                            fromDate: new Date(req.body.school_start),
                            toDate: new Date(req.body.school_end),
                            degree: req.body.school_degree
                        },
                        award: req.body.award,
                        exams: {
                            // updated below if more than 1 
                            name: req.body.exam_name,
                            examDate: new Date(req.body.exam_start),
                            passedDate: new Date(req.body.exam_end),
                            rating: req.body.exam_rate,
                            rank: req.body.exam_rank
                        },
                        trainingsAndSeminarInfo: {
                            // updated below if more than 1 
                            title: req.body.train_title,
                            organizer: req.body.train_org,
                            date: new Date(req.body.train_date)
                        },

                        //  III. Employment Record

                        employmentRecordInfo: {
                            // updated below if more than 1 
                            nameAndAddress: req.body.company_name,
                            nature: req.body.company_nature,
                            fromDate: new Date(req.body.company_start),
                            toDate: new Date(req.body.company_end),
                            position: req.body.company_position,
                            reasonForLeaving: req.body.company_leave,
                        },

                        // IV. Organization


                        organizations: {
                            // updated below if more than 1 
                            name: req.body.org_name,
                            position: req.body.org_position,
                            inclusiveYears: req.body.org_inclusive_years
                        },

                        characterReferences: {
                            // updated below if more than 1 
                            name: req.body.cr_name,
                            relationship: req.body.cr_relationship,
                            occupation: req.body.cr_occupation,
                            companyNameAndAddress: req.body.cr_nameadd,
                            contactNum: req.body.cr_num

                        },

                        //  V. Contact Information
                        contactPerson: req.body.ci_person,
                        contactRelationship: req.body.ci_relationship,
                        contactAddress: req.body.ci_address,
                        contactNumber: req.body.ci_num

                    }

                    if (req.body.date_marriage.charAt(4) == "-") {
                        PersonalInformationData.marriageDate = new Date(req.body.date_marriage);
                        console.log(typeof req.body.date_marriage);
                        console.log("req.body.date_marriage.charAt(4) " + req.body.date_marriage.charAt(4));
                        console.log("marriage date " + PersonalInformationData.marriageDate);
                    } else {
                        console.log("marriage date empty");
                        console.log("req.body.date_marriage..charAt(4) " + req.body.date_marriage.charAt(4));
                    }

                    /* 
                        separately inputs records with varying counts
                    */

                    //  for children
                    console.log("typeof req.body.child_birth " + typeof req.body.child_birth);
                    if (typeof req.body.child_birth == 'string') {
                        // do nothing bec it already saves the info on the main object
                    }
                    else if (Array.isArray(req.body.child_birth) == false) {
                        // if not an array, empty the default dates from the array
                        PersonalInformationData.children = [];
                        console.log("no input");
                    } else if (req.body.child_birth.length > 1) {
                        // else, add the objects separately
                        console.log("more than 1 input");
                        var childrenInfoArr = [];
                        for (i = 0; i < req.body.child_birth.length; i++) {
                            // console.log("default date: " + req.body.child_birth[i]);
                            var childrenInfo = {
                                name: req.body.child_name[i],
                                dateOfBirth: new Date(req.body.child_birth[i])
                            }
                            childrenInfoArr.push(childrenInfo);

                        }
                        console.log(childrenInfoArr);
                        PersonalInformationData.children = childrenInfoArr;
                    }




                    //  for siblings
                    if (typeof req.body.sibling_birth == 'string') {
                        // do nothing bec it already saves the info on the main object
                    }
                    else if (Array.isArray(req.body.sibling_birth) == false) {
                        // if not an array, empty the default dates from the array
                        PersonalInformationData.siblings = [];
                    }
                    else {
                        var siblings_dateOfBirth = [];

                        for (i = 0; i < req.body.sibling_birth.length; i++) {
                            var siblingInfo = {
                                name: req.body.sibling_name[i],
                                dateOfBirth: new Date(req.body.sibling_birth[i]), // updated below if more than 1 
                                civilStatus: req.body.sibling_status[i],
                            }
                            siblings_dateOfBirth.push(siblingInfo);
                        }

                        PersonalInformationData.siblings = siblings_dateOfBirth;

                    }



                    // for schoolRecords
                    if (typeof req.body.school_start == 'string') {
                        // do nothing bec it already saves the info on the main object
                    }
                    else if (Array.isArray(req.body.school_start) == false) {
                        // if not an array, empty the default dates from the array
                        PersonalInformationData.schoolRecords = [];
                    }
                    else {
                        var schoolRecordsArr = [];
                        for (i = 0; i < req.body.school_start.length; i++) {
                            var schoolRecordsInfo = {
                                level: req.body.school_level[i],
                                nameAddress: req.body.school_name[i],
                                fromDate: new Date(req.body.school_start[i]), // updated below if more than 1 
                                toDate: new Date(req.body.school_endv),// updated below if more than 1 
                                degree: req.body.school_degree[i]
                            }
                            schoolRecordsArr.push(schoolRecordsInfo);
                        }

                        PersonalInformationData.schoolRecords = schoolRecordsArr;
                    }

                    // for exams
                    if (typeof req.body.exam_start == 'string') {
                        // do nothing bec it already saves the info on the main object
                    }
                    else if (Array.isArray(req.body.exam_start) == false) {
                        // if not an array, empty the default dates from the array
                        PersonalInformationData.exams = [];
                    } else {
                        var examArr = [];
                        for (i = 0; i < req.body.exam_start.length; i++) {
                            var examInfo = {
                                name: req.body.exam_name[i],
                                examDate: new Date(req.body.exam_start[i]), // updated below if more than 1 
                                passedDate: new Date(req.body.exam_end[i]), // updated below if more than 1 
                                rating: req.body.exam_rate[i],
                                rank: req.body.exam_rank[i]
                            }
                            examArr.push(examInfo);
                        }


                        PersonalInformationData.exams = examArr;
                    }

                    // for trainingsAndSeminarInfo
                    if (typeof req.body.train_date == 'string') {
                        // do nothing bec it already saves the info on the main object
                    }
                    else if (Array.isArray(req.body.train_date) == false) {
                        // if not an array, empty the default dates from the array
                        PersonalInformationData.trainingsAndSeminarInfo = [];
                    } else {
                        var trainingsAndSeminarInfoArr = [];
                        for (i = 0; i < req.body.train_date.length; i++) {
                            var TASinfo = {
                                title: req.body.train_title[i],
                                organizer: req.body.train_org[i],
                                date: new Date(req.body.train_date[i]) // updated below if more than 1 
                            }
                            trainingsAndSeminarInfoArr.push(TASinfo);
                        }

                        PersonalInformationData.trainingsAndSeminarInfo = trainingsAndSeminarInfoArr;

                    }

                    // for employmentRecordInfo
                    if (typeof req.body.company_start == 'string') {
                        // do nothing bec it already saves the info on the main object
                    }
                    else if (Array.isArray(req.body.company_start) == false) {
                        // if not an array, empty the default dates from the array
                        PersonalInformationData.employmentRecordInfo = [];
                    } else {
                        var employmentRecordInfoArr = [];

                        for (i = 0; i < req.body.company_start.length; i++) {
                            var TASinfo = {
                                nameAndAddress: req.body.company_name[i],
                                nature: req.body.company_nature[i],
                                fromDate: new Date(req.body.company_start[i]), // updated below if more than 1 
                                toDate: new Date(req.body.company_end[i]), // updated below if more than 1 
                                position: req.body.company_position[i],
                                reasonForLeaving: req.body.company_leave[i],
                            }
                            employmentRecordInfoArr.push(TASinfo);
                        }
                        PersonalInformationData.employmentRecordInfo = employmentRecordInfoArr;
                    }

                    // for organization
                    if (typeof req.body.org_name == 'string') {
                        // do nothing bec it already saves the info on the main object
                    }
                    else if (Array.isArray(req.body.org_name) == false) {
                        // if not an array, empty the default dates from the array
                        PersonalInformationData.organizations = [];
                    } else {
                        var organizationInfoArr = [];

                        for (i = 0; i < req.body.org_name.length; i++) {
                            var organizationInfo = {
                                name: req.body.org_name[i],
                                position: req.body.org_position[i],
                                inclusiveYears: req.body.org_inclusive_years[i]
                            }
                            organizationInfoArr.push(organizationInfo);
                        }
                        PersonalInformationData.organizations = organizationInfoArr;
                    }

                    // for characterReferences
                    if (typeof req.body.cr_name == 'string') {
                        // do nothing bec it already saves the info on the main object
                    }
                    else if (Array.isArray(req.body.cr_name) == false) {
                        // if not an array, empty the default dates from the array
                        PersonalInformationData.characterReferences = [];
                    } else {
                        var characterReferencesArr = [];

                        for (i = 0; i < req.body.cr_name.length; i++) {
                            var characterReferencesInfo = {
                                name: req.body.cr_name[i],
                                relationship: req.body.cr_relationship[i],
                                occupation: req.body.cr_occupation[i],
                                companyNameAndAddress: req.body.cr_nameadd[i],
                                contactNum: req.body.cr_num[i]
                            }
                            characterReferencesArr.push(characterReferencesInfo);
                        }
                        PersonalInformationData.characterReferences = characterReferencesArr;
                    }

                    var PIDObject = new personalInformationsModel(PersonalInformationData);

                    personalInformationsModel.updateOne({_id: PIF_id}, PersonalInformationData, function(){
                        console.log("end updatePersonalInformationForm");
                        res.redirect("/PersonalInformationPage");
                    })


                })
            }
        })



    }

}

module.exports = PersonalInformationController;