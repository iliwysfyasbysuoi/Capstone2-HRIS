const mongodb = require('./models/mongodb.js');

const ObjectId = require('mongodb').ObjectID;
// import ObjectId ;


var users = [

    // <index> <company> <department, if applicable> 
    {
        // 0  CCI BU
        _id: ObjectId(),
        email: "jay.sampson@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Jay",
        middleName: "Santos",
        lastName: "Sampson",
        nickName: "Jay",

        businessUnit: "Circle Corporation Inc.",
        department: "Board of Directors",
        position: "Business Unit Head",

        userType: "Employee",
        employmentType: "Full Time",


        employmentDate: new Date("2021-1-05T10:13:19.873+00:00"),
        /*
        personalEmail: "",
        */
    },
    {
        //  1  CCI CHROD Head
        _id: ObjectId(),
        email: "eddie.wood@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Eddie",
        middleName: "Cruz",
        lastName: "Wood",
        nickName: "Eddie",

        businessUnit: "Circle Corporation Inc.",
        department: "Corporate Human Resource & Organization Department",
        position: "Department Head",

        userType: "Employee",
        employmentType: "Full Time",

        employmentDate: new Date("2021-1-05T10:13:19.873+00:00"),
        /*
        personalEmail: "",
        */
    },
    {
        //   2 CCI CHROD Director
        _id: ObjectId(),
        email: "courtney.matthews@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Courtney",
        middleName: "Martin",
        lastName: "Matthews",
        nickName: "Courtney",

        businessUnit: "Circle Corporation Inc.",
        department: "Corporate Human Resource & Organization Department",
        position: "Department Director",

        userType: "Employee",
        employmentType: "Full Time",

        employmentDate: new Date("2021-1-05T10:13:19.873+00:00"),
        /*
        
        personalEmail: "",
        */
    },
    {
        //    3 CCI CHROD HR Assistant Manager
        _id: ObjectId(),
        email: "philippe.stan@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Philippe",
        middleName: "Gregor",
        lastName: "Stan",
        nickName: "Philippe",

        businessUnit: "Circle Corporation Inc.",
        department: "Corporate Human Resource & Organization Department",
        position: "HR Assistant Manager",

        userType: "Employee",
        employmentType: "Full Time",

        employmentDate: new Date("2021-1-05T10:13:19.873+00:00"),
        /*
 
        contactNum: "",
        personalEmail: "",
        address: "",
        other necessary details, dami
        */
    },
    {
        //   4 CCI CHROD HR Officer
        _id: ObjectId(),
        email: "clay.hurst@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Clay",
        middleName: "Ho",
        lastName: "Hurst",
        nickName: "Clay",

        businessUnit: "Circle Corporation Inc.",
        department: "Corporate Human Resource & Organization Department",
        position: "HR Officer",

        userType: "Employee",
        employmentType: "Full Time",

        employmentDate: new Date("2021-1-05T10:13:19.873+00:00"),
        /*
        contactNum: "",
        personalEmail: "",
        address: "",
        other necessary details, dami
        */
    },

    {
        //   5 CCI CHROD HR Supervisor
        _id: ObjectId(),
        email: "melina.grimes@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Melina",
        middleName: "Elon",
        lastName: "Grimes",
        nickName: "Melina",

        businessUnit: "Circle Corporation Inc.",
        department: "Corporate Human Resource & Organization Department",
        position: "HR Supervisor",

        userType: "Employee",
        employmentType: "Full Time",

        employmentDate: new Date("2021-1-05T10:13:19.873+00:00"),
        /*
        contactNum: "",
        personalEmail: "",
        address: "",
        other necessary details, dami
        */
    },

    {
        //   6 CCI CHROD HR Specialist
        _id: ObjectId(),
        email: "paris.borman@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Paris",
        middleName: "Hilton",
        lastName: "Borman",
        nickName: "Paris",

        businessUnit: "Circle Corporation Inc.",
        department: "Corporate Human Resource & Organization Department",
        position: "HR Specialist",

        userType: "Employee",
        employmentType: "Full Time",

        employmentDate: new Date("2021-1-05T10:13:19.873+00:00"),
        /*
        contactNum: "",
        personalEmail: "",
        address: "",
        other necessary details, dami
        */
    },
    {
        //  7  CCI CHROD HR Officer
        _id: ObjectId(),
        email: "tommy.mccoy@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Tommy",
        middleName: "James",
        lastName: "McCoy",
        nickName: "Tommy",

        businessUnit: "Circle Corporation Inc.",
        department: "Corporate Human Resource & Organization Department",
        position: "HR Officer",

        userType: "Employee",
        employmentType: "Full Time",

        employmentDate: new Date("2021-1-05T10:13:19.873+00:00"),
        /*
        contactNum: "",
        personalEmail: "",
        address: "",
        other necessary details, dami
        */
    },

    {
        //  8  CCI - Finance & Treasury - Department Head
        _id: ObjectId(),
        email: "jesse.james@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Jesse",
        middleName: "McCartney",
        lastName: "James",
        nickName: "Jesse",

        businessUnit: "Circle Corporation Inc.",
        department: "Finance & Treasury",
        position: "Department Head",

        userType: "Employee",
        employmentType: "Full Time",

        employmentDate: new Date("2021-1-05T10:13:19.873+00:00"),
        /*
        contactNum: "",
        personalEmail: "",
        address: "",
        other necessary details, dami
        */
    },
    {
        //  9  CCI - Finance & Treasury - Department Director
        _id: ObjectId(),
        email: "kelly.uy@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Kelly",
        middleName: "Ong",
        lastName: "Uy",
        nickName: "Kelly",

        businessUnit: "Circle Corporation Inc.",
        department: "Finance & Treasury",
        position: "Department Director",

        userType: "Employee",
        employmentType: "Full Time",

        employmentDate: new Date("2021-1-05T10:13:19.873+00:00"),
        /*
        contactNum: "",
        personalEmail: "",
        address: "",
        other necessary details, dami
        */
    },
    {
        //  10  CCI - Finance & Treasury - 
        _id: ObjectId(),
        email: "ashley.riley@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Ashley",
        middleName: "Dale",
        lastName: "Riley",
        nickName: "Ashley",

        businessUnit: "Circle Corporation Inc.",
        department: "Finance & Treasury",
        position: "Financial Analyst",

        userType: "Employee",
        employmentType: "Full Time",

        employmentDate: new Date("2021-1-05T10:13:19.873+00:00"),
        /*
        contactNum: "",
        personalEmail: "",
        address: "",
        other necessary details, dami
        */
    },
    {
        //  11  CCI - Finance & Treasury - 
        _id: ObjectId(),
        email: "ray.garner@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Ray",
        middleName: "Ban",
        lastName: "Garner",
        nickName: "Ray",

        businessUnit: "Circle Corporation Inc.",
        department: "Finance & Treasury",
        position: "Credit Analyst",

        userType: "Employee",
        employmentType: "Full Time",

        employmentDate: new Date("2021-1-05T10:13:19.873+00:00"),
        /*
        contactNum: "",
        personalEmail: "",
        address: "",
        other necessary details, dami
        */
    },
    {
        //  12  CCI - Finance & Treasury - 
        _id: ObjectId(),
        email: "esteban.dulay@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Esteban",
        middleName: "Santiago",
        lastName: "Dulay",
        nickName: "Esteban",

        businessUnit: "Circle Corporation Inc.",
        department: "Finance & Treasury",
        position: "Risk Analyst",

        userType: "Employee",
        employmentType: "Full Time",

        employmentDate: new Date("2021-1-05T10:13:19.873+00:00"),
        /*
        contactNum: "",
        personalEmail: "",
        address: "",
        other necessary details, dami
        */
    },
    {
        //  13  CCI - Finance & Treasury - 
        _id: ObjectId(),
        email: "peter.manaloto@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Peter",
        middleName: "Pepito",
        lastName: "Manaloto",
        nickName: "Peter",

        businessUnit: "Circle Corporation Inc.",
        department: "Finance & Treasury",
        position: "Treasurer",

        userType: "Employee",
        employmentType: "Full Time",

        employmentDate: new Date("2021-1-05T10:13:19.873+00:00"),
        /*
        contactNum: "",
        personalEmail: "",
        address: "",
        other necessary details, dami
        */
    },
    {
        //  14  CCI - Finance & Treasury - 
        _id: ObjectId(),
        email: "roberto.estolas@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Roberto",
        middleName: "Ong",
        lastName: "Estolas",
        nickName: "Roberto",

        businessUnit: "Circle Corporation Inc.",
        department: "Finance & Treasury",
        position: "Underwriter",

        userType: "Employee",
        employmentType: "Full Time",

        employmentDate: new Date("2021-1-05T10:13:19.873+00:00"),
        /*
        contactNum: "",
        personalEmail: "",
        address: "",
        other necessary details, dami
        */
    },
    {
        //  15  LNL - BU Head 
        _id: ObjectId(),
        email: "roger.ellis@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Roger",
        middleName: "Rabbit",
        lastName: "Ellis",
        nickName: "Roger",

        businessUnit: "LNL Archipelago Minerals",
        department: "Board of Directors",
        position: "Business Unit Head",

        userType: "Employee",
        employmentType: "Full Time",

        employmentDate: new Date("2021-1-05T10:13:19.873+00:00"),
        /*
        contactNum: "",
        personalEmail: "",
        address: "",
        other necessary details, dami
        */
    },
    {
        //  16  LNL - Environment & Safety 
        _id: ObjectId(),
        email: "spencer.fritz@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Spencer",
        middleName: "Mart",
        lastName: "Fritz",
        nickName: "Spencer",

        businessUnit: "LNL Archipelago Minerals",
        department: "Environment & Safety",
        position: "Department Head",

        userType: "Employee",
        employmentType: "Full Time",

        employmentDate: new Date("2021-1-05T10:13:19.873+00:00"),
        /*
        contactNum: "",
        personalEmail: "",
        address: "",
        other necessary details, dami
        */
    },
    {
        //  17  LNL - Environment & Safety 
        _id: ObjectId(),
        email: "Aida.Fuller@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Aida",
        middleName: "Mary",
        lastName: "Fuller",
        nickName: "Aida",

        businessUnit: "LNL Archipelago Minerals",
        department: "Environment & Safety",
        position: "Department Director",

        userType: "Employee",
        employmentType: "Full Time",

        employmentDate: new Date("2021-1-05T10:13:19.873+00:00"),
        /*
        contactNum: "",
        personalEmail: "",
        address: "",
        other necessary details, dami
        */
    },
    {
        //  18  LNL - Environment & Safety 
        _id: ObjectId(),
        email: "alberto.cruz@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Alberto",
        middleName: "Oligardo",
        lastName: "Cruz",
        nickName: "Albert",

        businessUnit: "LNL Archipelago Minerals",
        department: "Environment & Safety",
        position: "Safety Compliance Officer",

        userType: "Employee",
        employmentType: "Full Time",

        employmentDate: new Date("2021-1-05T10:13:19.873+00:00"),
        /*
        contactNum: "",
        personalEmail: "",
        address: "",
        other necessary details, dami
        */
    },
    {
        //  19  LNL - Environment & Safety 
        _id: ObjectId(),
        email: "nestor.arboleda@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Nestor",
        middleName: "Deo",
        lastName: "Arboleda",
        nickName: "Nestor",

        businessUnit: "LNL Archipelago Minerals",
        department: "Environment & Safety",
        position: "Hazard Control Specialist",

        userType: "Employee",
        employmentType: "Full Time",

        employmentDate: new Date("2021-1-05T10:13:19.873+00:00"),
        /*
        contactNum: "",
        personalEmail: "",
        address: "",
        other necessary details, dami
        */
    },
    {
        //  20  LNL - Environment & Safety 
        _id: ObjectId(),
        email: "baby.dagohoy@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Baby",
        middleName: "Dios",
        lastName: "Dagohot",
        nickName: "Baby",

        businessUnit: "LNL Archipelago Minerals",
        department: "Environment & Safety",
        position: "Safety Engineer",

        userType: "Employee",
        employmentType: "Full Time",

        employmentDate: new Date("2021-1-05T10:13:19.873+00:00"),
        /*
        contactNum: "",
        personalEmail: "",
        address: "",
        other necessary details, dami
        */
    },
    {
        //  21  LNL - Environment & Safety 
        _id: ObjectId(),
        email: "natasha.malano@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Natasha",
        middleName: "Grey",
        lastName: "Malano",
        nickName: "Nat",

        userType: "Employee",
        employmentType: "Full Time",

        businessUnit: "LNL Archipelago Minerals",
        department: "Environment & Safety",
        position: "Environmental Engineer",

        employmentDate: new Date("2021-1-05T10:13:19.873+00:00"),
        /*
        contactNum: "",
        personalEmail: "",
        address: "",
        other necessary details, dami
        */
    },
    {
        //  22  LNL - Environment & Safety 
        _id: ObjectId(),
        email: "shania.zarate@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Shania",
        middleName: "Anita",
        lastName: "Zarate",
        nickName: "Shan",

        businessUnit: "LNL Archipelago Minerals",
        department: "Environment & Safety",
        position: "Risk Control Specialist",

        userType: "Employee",
        employmentType: "Full Time",

        employmentDate: new Date("2021-1-05T10:13:19.873+00:00"),
        /*
        employmentDate: ,
        contactNum: "",
        personalEmail: "",
        address: "",
        other necessary details, dami
        */
    },
    {
        // 23 Applicant
        _id: ObjectId(),
        personalEmail: "jarod.pilapil@gmail.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName:"Lucio Jarod",
        middleName:"Dofitas",
        lastName:"Pilapil",
        nickName:"Jarod",

        userType:"Applicant",
    },
    {
        // 24 Applicant
        _id: ObjectId(),
        personalEmail: "trev.liwag@gmail.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName:"Conrado Trevin",
        middleName:"Ifugao",
        lastName:"Liwag",
        nickName:"Trev",

        userType:"Applicant"
    },
    {
        // 25 Applicant
        _id: ObjectId(),
        personalEmail: "will.villaroman@gmail.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName:"William Delmar",
        middleName:"Nasser",
        lastName:"Villaroman",
        nickName:"Will",

        userType:"Applicant"
    },
    {
        // 26 Applicant
        _id: ObjectId(),
        personalEmail: "ramon.montero@gmail.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName:"Ramon Nikolas",
        middleName:"Cox",
        lastName:"Montero",
        nickName:"Ramon",

        userType:"Applicant"
    },
    {
        // 27 Applicant
        _id: ObjectId(),
        personalEmail: "blaise.moreno@gmail.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName:"Blaise",
        middleName:"Silvino",
        lastName:"Moreno",
        nickName:"Blaise",

        userType:"Applicant"
    },
    {
        // 28 Applicant
        _id: ObjectId(),
        personalEmail: "selena_sicat@gmail.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName:"Selena Brionna",
        middleName:"Aliguyon",
        lastName:"Sicat",
        nickName:"Selena",

        userType:"Applicant"
    },
    {
        // 29 Applicant
        _id: ObjectId(),
        personalEmail: "ari_dagohoy@gmail.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName:"Arianna",
        middleName:"Simpao",
        lastName:"Dagohoy",
        nickName:"Ari",

        userType:"Applicant"
    },
    {
        // 30 Applicant
        _id: ObjectId(),
        personalEmail: "mariam_santiago@gmail.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName:"Mariam",
        middleName:"Amer",
        lastName:"Santiago",
        nickName:"Mariam",

        userType:"Applicant"
    },
    {
        // 31 Applicant
        _id: ObjectId(),
        personalEmail: "rosa_roxas@gmail.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName:"Rosamaria",
        middleName:"Capati",
        lastName:"Roxas",
        nickName:"Rosa",

        userType:"Applicant"
    },
    {
        // 32 Applicant
        _id: ObjectId(),
        personalEmail: "ria_reyes@gmail.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName:"Ria Catherine",
        middleName:"Ampaso",
        lastName:"Reyes",
        nickName:"Ria",

        userType:"Applicant"
    },

]



mongodb.insertMany('users', users);



var PRFData = [

    {
        // index 0; 

        _id: new ObjectId("618fa3489394d6f946b02f2a"),
        requisitionID: 1,
        createdBy: {
            email: users[15].email,
            _id: users[15]._id,
            businessUnit: users[15].businessUnit,
            department: users[15].department,
            position: users[15].position,
            name: users[15].firstName + users[15].lastName
        },
        successCount:0,

        createdDate: new Date("2021-11-13T00:00:00.000+00:00"),

        positionTitle: 'Miner',
        targetStartDate: new Date("2021-12-06T00:00:00.000+00:00"),
        inTO: 'Yes',
        positionLevel: 'Level 1',
        jobCode: 'Job Code 2',
        headcount: 4,
        businessUnit: 'LNL Archipelago Minerals',
        department: 'Environment & Safety',
        directSupervisor: 'someone',
        billToCompany: 'LNL Archipelago Minerals',
        location: 'Makati City',



        employmentType: 'Contractual',
        assessmentLength: { years: 1, months: 0 },
        purpose: ' Additional',
        details: 'some details here.',

        jobDescription: 'Mining engineers design and create systems that are used to locate, extract, and transport natural resources. They develop and design new mining equipment and make sure that the mining procedures used are safe and efficient. Increasingly, mining engineers focus their attention on creating mining equipment and techniques that are as friendly to the environment as possible.',
        positionRequirements: "Mining engineers need at least a bachelor's degree to find a job, and many research positions require a master's degree or doctorate. Some courses that students need to take cover geology, mining operation, mine design, metallurgy and environmental reclamation, among others.\r\n" +
            '\r\n' +
            'Any mining engineer who works in the public sector must have a state license. Requirements vary by state, but typically include a combination of education and experience, and a series of tests.\r\n' +
            '\r\n' +
            'Mining engineers must have a strong background in math and science, good organizational skills and strong problem-solving abilities. Creativity and the ability to communicate effectively are also needed.\r\n' +
            '\r\n',

        toolsOfTrade: [
            //  ["tool", "availability"]
            ["Personal Protective Equipment (PPE)", "Available"]
        ],

        approvalDHead: {
            approver: {
                _id: users[16]._id,
                email: users[16].email,
                firstName: users[16].firstName,
                lastName: users[16].lastName,
                businessUnit: users[16].businessUnit,
                department: users[16].department,
                position: users[16].position
            },
            approval: 'Approved'
        },

        approvalHRPartner: {
            approver: {
                _id: users[6]._id,
                email: users[6].email,
                firstName: users[6].firstName,
                lastName: users[6].lastName,
                businessUnit: users[6].businessUnit,
                department: users[6].department,
                position: users[6].position
            },
            approval: 'Approved'
        },
        approvalBUHead: {
            approver: {
                _id: users[15]._id,
                email: users[15].email,
                firstName: users[15].firstName,
                lastName: users[15].lastName,
                businessUnit: users[15].businessUnit,
                department: users[15].department,
                position: users[15].position
            },
            approval: 'Approved'
        },
        approvalCHRODDirector: {
            approver: {
                _id: users[2]._id,
                email: users[2].email,
                firstName: users[2].firstName,
                lastName: users[2].lastName,
                businessUnit: users[2].businessUnit,
                department: users[2].department,
                position: users[2].position
            },
            approval: 'Approved'
        },
        approvalCHRODHead: {
            approver: {
                _id: users[1]._id,
                email: users[1].email,
                firstName: users[1].firstName,
                lastName: users[1].lastName,
                businessUnit: users[1].businessUnit,
                department: users[1].department,
                position: users[1].position
            },
            approval: 'Approved'
        },

        approvedDate: new Date("2021-11-13T00:00:00.000Z"),
        listDate: new Date("2021-11-13T00:00:00.000Z"),
        status: 'Open',
        __v: 0
    },

    {
        // index 1; 
        
        _id: new ObjectId("618fa4b89394d6f946b02f37"),
        requisitionID: 2,
        createdBy: {
            email: users[8].email,
            _id: users[8]._id,
            businessUnit: users[8].businessUnit,
            department: users[8].department,
            position: users[8].position,
            name: users[8].firstName + users[8].lastName
        },

        successCount:0,

        createdDate: new Date("2021-11-13T00:00:00.000+00:00"),

        positionTitle: 'Financial Analyst',
        targetStartDate: new Date("2021-12-30T00:00:00.000+00:00"),
        inTO: 'Yes',
        positionLevel: 'Level 3',
        jobCode: 'Job Code 3',
        headcount: 1,
        businessUnit: 'Circle Corporation Inc.',
        department: 'Finance & Treasury',
        directSupervisor: 'someone',
        billToCompany: 'Circle Corporation Inc.',
        location: 'Paranaque City',



        employmentType: 'Full Time',
        assessmentLength: { years: 5, months: 1 },
        purpose: ' Additional',
        details: 'some details here.',

        jobDescription: 'Perform financial forecasting, reporting, and operational metrics tracking. Analyze financial data and create financial models for decision support. Report on financial performance and prepare for regular leadership reviews. Analyze past results, perform variance analysis, identify trends, and make recommendations for improvements. Work closely with the accounting team to ensure accurate financial reporting. Evaluate financial performance by comparing and analyzing actual results with plans and forecasts.Guide the cost analysis process by establishing and enforcing policies and procedures. Provide analysis of trends and forecasts and recommend actions for optimization. Recommend actions by analyzing and interpreting data and making comparative analyses; study proposed changes in methods and materials. Identify and drive process improvements, including the creation of standard and ad-hoc reports, tools, and Excel dashboards.',
        positionRequirements: "0-3+ years of business finance or other relevant experience.\r\n" +
            'High proficiency in financial modeling techniques. \r\n' +
            'Strong fluency with Excel formulas and functions.\r\n' +
            ' BA, BS, or B.Com degree required (Bachelor’s Degree in Accounting/Finance/Economics).  \r\n' +
            'Strong analytical and data gathering skills. Good business acumen. \r\n' +
            '\r\n',

        toolsOfTrade: [
            //  ["tool", "availability"]
            ["Capsule Space", "Available"],
            ["Computer Unit", "Available"],

        ],

        approvalDHead: {
            approver: {
                _id: users[8]._id,
                email: users[8].email,
                firstName: users[8].firstName,
                lastName: users[8].lastName,
                businessUnit: users[8].businessUnit,
                department: users[8].department,
                position: users[8].position
            },
            approval: 'Approved'
        },

        approvalHRPartner: {
            approver: {
                _id: users[4]._id,
                email: users[4].email,
                firstName: users[4].firstName,
                lastName: users[4].lastName,
                businessUnit: users[4].businessUnit,
                department: users[4].department,
                position: users[4].position
            },
            approval: 'Pending'
        },
        approvalBUHead: {
            approver: {
                _id: users[0]._id,
                email: users[0].email,
                firstName: users[0].firstName,
                lastName: users[0].lastName,
                businessUnit: users[0].businessUnit,
                department: users[0].department,
                position: users[0].position
            },
            approval: 'Pending'
        },
        approvalCHRODDirector: {
            approver: {
                _id: users[2]._id,
                email: users[2].email,
                firstName: users[2].firstName,
                lastName: users[2].lastName,
                businessUnit: users[2].businessUnit,
                department: users[2].department,
                position: users[2].position
            },
            approval: 'Pending'
        },
        approvalCHRODHead: {
            approver: {
                _id: users[1]._id,
                email: users[1].email,
                firstName: users[1].firstName,
                lastName: users[1].lastName,
                businessUnit: users[1].businessUnit,
                department: users[1].department,
                position: users[1].position
            },
            approval: 'Pending'
        },

        status: 'For Approval',
        __v: 0
    },

    {
        // index 2; 
        
        _id: new ObjectId("618fa6fe2f8c210943d649b6"),
        requisitionID: 3,
        createdBy: {
            email: users[15].email,
            _id: users[15]._id,
            businessUnit: users[15].businessUnit,
            department: users[15].department,
            position: users[15].position,
            name: users[15].firstName + users[15].lastName
        },

        successCount:0,
        
        createdDate: new Date("2021-11-13T00:00:00.000+00:00"),

        positionTitle: 'Flowback Operator',
        targetStartDate: new Date("2022-01-15T00:00:00.000+00:00"),
        inTO: 'Yes',
        positionLevel: 'Level 1',
        jobCode: 'Job Code 1',
        headcount: 1,
        businessUnit: 'LNL Archipelago Minerals',
        department: 'Environment & Safety',
        directSupervisor: 'someone',
        billToCompany: 'LNL Archipelago Minerals',
        location: 'Pampanga City',



        employmentType: 'Project Based',
        assessmentLength: { years: 1, months: 0 },
        purpose: 'New Position',
        details: 'some details here.',

        jobDescription: 'We are seeking experienced flowback operators for work on the front range and western slope. At least one year of experience preferred. Must have a valid drivers license, good background and be drug free. We offer competitive pay and benefits.',
        positionRequirements: "High school graduate or equivalent. Driver's License. English language\r\n" ,

        toolsOfTrade: [
            //  ["tool", "availability"]
            ["Truck", "Available"]
        ],

        approvalDHead: {
            approver: {
                _id: users[16]._id,
                email: users[16].email,
                firstName: users[16].firstName,
                lastName: users[16].lastName,
                businessUnit: users[16].businessUnit,
                department: users[16].department,
                position: users[16].position
            },
            approval: 'Approved'
        },

        approvalHRPartner: {
            approver: {
                _id: users[6]._id,
                email: users[6].email,
                firstName: users[6].firstName,
                lastName: users[6].lastName,
                businessUnit: users[6].businessUnit,
                department: users[6].department,
                position: users[6].position
            },
            approval: 'Pending'
        },
        approvalBUHead: {
            approver: {
                _id: users[15]._id,
                email: users[15].email,
                firstName: users[15].firstName,
                lastName: users[15].lastName,
                businessUnit: users[15].businessUnit,
                department: users[15].department,
                position: users[15].position
            },
            approval: 'Pending'
        },
        approvalCHRODDirector: {
            approver: {
                _id: users[2]._id,
                email: users[2].email,
                firstName: users[2].firstName,
                lastName: users[2].lastName,
                businessUnit: users[2].businessUnit,
                department: users[2].department,
                position: users[2].position
            },
            approval: 'Pending'
        },
        approvalCHRODHead: {
            approver: {
                _id: users[1]._id,
                email: users[1].email,
                firstName: users[1].firstName,
                lastName: users[1].lastName,
                businessUnit: users[1].businessUnit,
                department: users[1].department,
                position: users[1].position
            },
            approval: 'Pending'
        },

        status: 'For Approval',
        __v: 0
    }

]

mongodb.insertMany('personnelrequisitionforms', PRFData);


var PIFData = [
    {
        // 0 rosa_roxas@gmail.com
        _id: ObjectId(),
        user: {
            _id: users[31]._id,
            personalEmail: users[31].personalEmail,
            firstName: users[31].firstName,
            middleName: users[31].middleName,
            lastName: users[31].lastName,
            nickName: users[31].nickName,
            userType: users[31].userType,
        },
        presentAddress: "2437 Syquia Corner Havana StreetsSta. Ana 1000",
        provincialAddress: "2437 Syquia Corner Havana StreetsSta. Ana 1000",
        telNum: 5634110,
        mobileNum: 639453229921,
        dateOfBirth: new Date("1995-4-27"),
        placeOfBirth: "Quezon City",
        age: 26,
        gender: "gender-female",
        weight: 82,
        height: 171,
        civilStatus: "Married",
        citizenship: "Filipino",
        religion: "Catholic",
        bloodType: "type-b",
        SSS: "0407514490",
        TIN: "380645290705",
        HDMF: "438741411167",
        PhilHealth: "555615443955",
        spouseName: "Kim Mingyu",
        marriageDate: new Date("2020-10-17"),
        spouseOccupation: "Singer",
        spouseEmployer: "Pledis Ent.",
        spousePresentAddress: "Ansan, KOR",
        spouseTelNum: "7899999",
        spouseMobileNum: "8262756571",
        children: [
            {
                name: "Dylan",
                dateOfBirth: new Date("2021-02-14")
            },
            {
                name:"Bruno",
                dateOfBirth: new Date("2021-05-17")
            }
        ],
        fatherName: "Kim Namjoon",
        fatherHomeAddress: "2437 Syquia Corner Havana StreetsSta. Ana 1000",
        fatherOccupation: "Author",
        fatherCompany: "HYBE",
        motherName: "Bae Ju Hyun",
        motherHomeAddress: "2437 Syquia Corner Havana StreetsSta. Ana 1000",
        motherOccupation: "Model",
        motherCompany: "SM",
        siblings: [
            {
                name: "Kali",
                dateOfBirth: new Date("1997-10-01"),
                civilStatus:"Married"
            },

            {
                name: "Cale",
                dateOfBirth: new Date("2000-09-23"),
                civilStatus:"Single"
            }
        ],
        schoolRecords: [
            {
                level: "GS",
                nameAddress: "SSC-MNL",
                fromDate: new Date("2006-6-13"),
                toDate: new Date("2012-3-15"),
                degree: "GS Diploma"
            },

            {
                level: "JHS",
                nameAddress: "SSC-MNL",
                fromDate: new Date("2012-6-14"),
                toDate: new Date("2016-3-21"),
                degree: "JHS Diploma"
            },
            {
                level: "SHS",
                nameAddress: "DLSU",
                fromDate: new Date("2016-6-1"),
                toDate: new Date("2018-6-2"),
                degree: "SHS Diploma"
            },
            {
                level: "College",
                nameAddress: "DLSU",
                fromDate: new Date("2018-9-18"),
                toDate: new Date("2022-9-21"),
                degree: "BSINSYS"
            }
        ],
        award: "Conduct Awardee",
        exams: [
            {
                name: "Board Exam",
                examDate: new Date("2020-6-30"),
                passedDate: new Date("2021-3-21"),
                rating: 81,
                rank: 100
            }
        ],
        trainingsAndSeminarInfo: [
            {
                title: "Marketing Masters",
                organizer: "P&G",
                date: new Date("2021-2-22")
            },
            {
                title: "P&G Next",
                organizer: "P&G",
                date: new Date("2022-1-17")}
        ],
        employmentRecordInfo: [
            { 
                nameAddress: "HYBE Labels",
                nature: "Entertainment",
                fromDate: new Date("2017-5-16"),
                toDate: new Date("2019-7-19"),
                position: "Crew",
                reasonForLeaving: "Fatigue"
            },
            {
                nameAddress: "SM Entertainment",
                nature: "Entertainment", 
                fromDate: new Date("2019-9-30"),
                toDate: new Date("2020-6-26"),
                position: "Crew",
                reasonForLeaving: "Fatigue"
            }
        ],
        organizations: [
            { 
                name:"Band PH", 
                position: "Drummer", 
                inclusiveYears: "2017-2019"
            }
        ],
        characterReferences: [
            {
                name: "Yeonjun", 
                relationship: "Coworker", 
                occupation: "Singer", 
                companyNameAndAddress: "HYBE",
                contactNum: 5118439
            },
            { 
                name: "Soobin",
                relationship: "Brother",
                occupation: "Singer",
                companyNameAndAddress: "HYBE",
                contactNum: 5118439
            },
            {
                name: "Beomgyu",
                relationship: "Uncle",
                occupation: "Singer",
                companyNameAndAddress: "HYBE",
                contactNum: 5118439
            },
            {
                name: "Taehyun",
                relationship: "Boss",
                occupation: "Singer",
                companyNameAndAddress: "HYBE",
                contactNum:  5118439
            },
            {
                name: "Kai",
                relationship: "Friend",
                occupation: "Singer",
                companyNameAndAddress: "HYBE",
                contactNum: 5118439
            }
        ],
        contactPerson: "Lee Seokmin",
        contactRelationship: "Brother",
        contactAddress: "Seoul, KOR",
        contactNumber: 8212365803
    },
    {
        // 1 selena_sicat@gmail.com
        _id: ObjectId(),
        user: {
            _id: users[28]._id,
            personalEmail: users[28].personalEmail,
            firstName: users[28].firstName,
            middleName: users[28].middleName,
            lastName: users[28].lastName,
            nickName: users[28].nickName,
            userType: users[28].userType,
        },
        presentAddress: "947 Aurora Boulevard 1100",
        provincialAddress: "947 Aurora Boulevard 1100",
        telNum: 5634077,
        mobileNum: 639450553572,
        dateOfBirth: new Date("1996-12-02"),
        placeOfBirth: "Manila City",
        age: 25,
        gender: "gender-female",
        weight: 64,
        height: 162,
        civilStatus: "Single",
        citizenship: "Filipino",
        religion: "Catholic",
        bloodType: "type-ab",
        SSS: "0525622382",
        TIN: "895534358164",
        HDMF: "855022688339",
        PhilHealth: "612143311650",
        fatherName: "Kim Seokjin",
        fatherHomeAddress: "Seoul, KOR",
        fatherOccupation: "Actor",
        fatherCompany: "HYBE",
        motherName: "Kang Seul Gi ",
        motherHomeAddress: "Seoul, KOR",
        motherOccupation: "Architect",
        motherCompany: "SM",
        siblings: [
            {
                name: "Heinz",
                dateOFBirth: new Date("1996-02-28"),
                civilStatus: "Single"
            },
            {
                name: "Tessa",
                dateOfBirth: new Date("1998-02-18"),
                civilStatus: "Married"
            }
        ],
        schoolRecords: [
            {
                level: "GS",
                nameAddress: "SSC-MNL",
                fromDate: new Date("2006-6-13"),
                toDate: new Date("2012-3-15"),
                degree: "GS Diploma"
            },

            {
                level: "JHS",
                nameAddress: "SSC-MNL",
                fromDate: new Date("2012-6-14"),
                toDate: new Date("2016-3-21"),
                degree: "JHS Diploma"
            },
            {
                level: "SHS",
                nameAddress: "DLSU",
                fromDate: new Date("2016-6-1"),
                toDate: new Date("2018-6-2"),
                degree: "SHS Diploma"
            },
            {
                level: "College",
                nameAddress: "DLSU",
                fromDate: new Date("2018-9-18"),
                toDate: new Date("2022-9-21"),
                degree: "BSINSYS"
            }
        ],
        award: "Perfect Attendance",
        employmentRecordInfo: [
            { 
                nameAddress: "HYBE Labels",
                nature: "Entertainment",
                fromDate: new Date("2017-5-16"),
                toDate: new Date("2019-7-19"),
                position: "Crew",
                reasonForLeaving: "Fatigue"
            },
            {
                nameAddress: "SM Entertainment",
                nature: "Entertainment", 
                fromDate: new Date("2019-9-30"),
                toDate: new Date("2020-6-26"),
                position: "Crew",
                reasonForLeaving: "Fatigue"
            }
        ],
        organizations: [
            //  [0: name, 1: position, 2: inclusiveYears]
            { 
                name: "Band PH",
                position: "Pianist",
                inclusiveYears:  "2017-2019"
            },
            {
                name: "Music Geeks",
                position: "President",
                inclusiveYears: "2016-2017"
            }
        ],
        characterReferences: [
            {
                name: "Yeji",
                relationship: "Coworker",
                occupation: "Singer",
                companyNameAndAddress:  "JYP",
                contactNum: 5118439
            },
            {
                name: "Lia",
                relationship: "Sister",
                occupation: "Singer",
                companyNameAndAddress: "JYP",
                contactNum: 5118439
            },
            {
                name: "Ryujin",
                relationship: "Teacher",
                occupation: "Singer",
                companyNameAndAddress: "JYP",
                contactNum: 5118439
            },
            {
                name: "Chaeryong",
                relationship: "Aunt",
                occupation: "Singer",
                companyNameAndAddress: "JYP",
                contactNum: 5118439
            },
            {
                name: "Yuna",
                relationship: "Friend",
                occupation: "Singer",
                companyNameAndAddress: "JYP",
                contactNum: 5118439
            }
        ],
        contactPerson: "Lee Jihoon",
        contactRelationship: "Brother",
        contactAddress: "Seoul, KOR",
        contactNumber: 8287956101
    },
    {
        // 2 ari_dagohoy@gmail.com
        _id: ObjectId(),
        user: {
            _id: users[29]._id,
            personalEmail: users[29].personalEmail,
            firstName: users[29].firstName,
            middleName: users[29].middleName,
            lastName: users[29].lastName,
            nickName: users[29].nickName,
            userType: users[29].userType,
        },
        presentAddress: "64 Manga Road, Cubao",
        provincialAddress: "64 Manga Road, Cubao",
        telNum: 8925937,
        mobileNum: 63456199463,
        dateOfBirth: new Date("1995-03-15"),
        placeOfBirth: "Vancouver",
        age: 26,
        gender: "gender-female",
        weight: 57,
        height: 157,
        civilStatus: "Married",
        citizenship: "Filipino",
        religion: "Catholic",
        bloodType: "type-ab",
        SSS: "4000308494",
        TIN: "682110853415",
        HDMF: "473676936752",
        PhilHealth: "529208973275",
        spouseName: "Choi Seungcheol",
        marriageDate: new Date("2021-01-26"),
        spouseOccupation: "Dancer",
        spouseEmployer: "SM Ent.",
        spousePresentAddress: "Daegu, KOR",
        spouseMobileNum: "8296996118",
        fatherName: "Kim Taehyung",
        fatherHomeAddress: "Seoul, KOR",
        fatherOccupation: "Painter",
        fatherCompany: "HYBE",
        motherName: "Wendy Son",
        motherHomeAddress: "Toronto, CAN",
        motherOccupation: "Singer",
        motherCompany: "SM",
        siblings: [
            {
                name: "Kurt",
                dateOfBirth: new Date("1998-02-18"),
                civilStatus: "Married"
            },
            {
                name: "Jun",
                dateOfBirth: new Date("1999-01-24"),
                civilStatus: "Single"
            },
            {
                name: "Scott",
                dateOfBirth: new Date("2001-05-07"),
                civilStatus: "Single"
            }
        ],
        schoolRecords: [
            {
                level: "GS",
                nameAddress: "SSC-MNL",
                fromDate: new Date("2006-6-13"),
                toDate: new Date("2012-3-15"),
                degree: "GS Diploma"
            },
            {
                level: "JHS",
                nameAddress: "SSC-MNL",
                fromDate: new Date("2012-6-14"),
                toDate: new Date("2016-3-21"),
                degree: "JHS Diploma"
            },
            {
                level: "SHS",
                nameAddress: "DLSU",
                fromDate: new Date("2016-6-1"),
                toDate: new Date("2018-6-2"),
                degree: "SHS Diploma"
            },
            {
                level: "College",
                nameAddress: "DLSU",
                fromDate: new Date("2018-9-18"),
                toDate: new Date("2022-9-21"),
                degree: "BSINSYS"
            }
        ],
        trainingsAndSeminarInfo: [
            // [0: title, 1: organizer, 2: date]
            {
                title: "Marketing Masters",
                organizer: "P&G",
                date: new Date("2021-2-22")
            }
        ],
        employmentRecordInfo: [
            { 
                nameAddress: "HYBE Labels",
                nature: "Entertainment",
                fromDate: new Date("2017-5-16"),
                toDate: new Date("2019-7-19"),
                position: "Crew",
                reasonForLeaving: "Fatigue"
            },
            {
                nameAddress: "SM Entertainment",
                nature: "Entertainment", 
                fromDate: new Date("2019-9-30"),
                toDate: new Date("2020-6-26"),
                position: "Crew",
                reasonForLeaving: "Fatigue"
            },
            {
                nameAddress: "Starbucks",
                nature: "Food & Beverage",
                fromDate: new Date("2016-9-30"),
                toDate: new Date("2017-6-26"),
                position: "Crew",
                reasonForLeaving: "Fatigue"
            }
        ],
        characterReferences: [
            {
                name: "Yeonjun", 
                relationship: "Coworker", 
                occupation: "Singer", 
                companyNameAndAddress: "HYBE",
                contactNum: 5118439
            },
            { 
                name: "Soobin",
                relationship: "Brother",
                occupation: "Singer",
                companyNameAndAddress: "HYBE",
                contactNum: 5118439
            },
            {
                name: "Beomgyu",
                relationship: "Uncle",
                occupation: "Singer",
                companyNameAndAddress: "HYBE",
                contactNum: 5118439
            },
            {
                name: "Taehyun",
                relationship: "Boss",
                occupation: "Singer",
                companyNameAndAddress: "HYBE",
                contactNum:  5118439
            },
            {
                name: "Kai",
                relationship: "Friend",
                occupation: "Singer",
                companyNameAndAddress: "HYBE",
                contactNum: 5118439
            }
        ],
        contactPerson: "Lee Chan",
        contactRelationship: "Brother",
        contactAddress: "Seoul, KOR",
        contactNumber: 8260660222
    },
    {
        // 3 mariam_santiago@gmail.com
        _id: ObjectId(),
        user: {
            _id: users[30]._id,
            personalEmail: users[30].personalEmail,
            firstName: users[30].firstName,
            middleName: users[30].middleName,
            lastName: users[30].lastName,
            nickName: users[30].nickName,
            userType: users[30].userType,
        },
        presentAddress: "489-B Regina Building, Escolta Street",
        provincialAddress: "489-B Regina Building, Escolta Street",
        telNum: 9112625,
        mobileNum: 63456898138,
        dateOfBirth: new Date("1997-06-26"),
        placeOfBirth: "Pasay City",
        age: 24,
        gender: "gender-female",
        weight: 80,
        height: 180,
        civilStatus: "Married",
        citizenship: "Filipino",
        religion: "Christian",
        bloodType: "type-a",
        SSS: "8090099109",
        TIN: "566865706922",
        HDMF: "644076433161",
        PhilHealth: "143501008635",
        spouseName: "Jeon Jungkook",
        marriageDate: new Date("2020-12-18"),
        spouseOccupation: "Singer",
        spouseEmployer: "Cube Ent.",
        spousePresentAddress: "Busan, KOR",
        spouseMobileNum: "8263514206",
        fatherName: "Min Yoongi",
        fatherHomeAddress: "Daegu, KOR",
        fatherOccupation: "Producer",
        fatherCompany: "HYBE",
        motherName: "Park Soo Young",
        motherHomeAddress: "Seoul, KOR",
        motherOccupation: "Model",
        motherCompany: "SM",
        siblings: [
            {
                name: "Nayeon",
                dateOfBirth: new Date("1996-10-01"),
                civilStatus: "Single"
            }
        ],
        schoolRecords: [
            {
                level: "GS",
                nameAddress: "SSC-MNL",
                fromDate: new Date("2006-6-13"),
                toDate: new Date("2012-3-15"),
                degree: "GS Diploma"
            },

            {
                level: "JHS",
                nameAddress: "SSC-MNL",
                fromDate: new Date("2012-6-14"),
                toDate: new Date("2016-3-21"),
                degree: "JHS Diploma"
            },
            {
                level: "SHS",
                nameAddress: "DLSU",
                fromDate: new Date("2016-6-1"),
                toDate: new Date("2018-6-2"),
                degree: "SHS Diploma"
            },
            {
                level: "College",
                nameAddress: "DLSU",
                fromDate: new Date("2018-9-18"),
                toDate: new Date("2022-9-21"),
                degree: "BSINSYS"
            }
        ],
        exams: [
            {
                name: "Board Exam",
                examDate: new Date("2020-6-30"),
                passedDae: new Date("2021-3-21"),
                rating: 81,
                rank: 100
            },
            {
                name: "Board Exam 2",
                examDate: new Date("2020-10-30"),
                passedDate: new Date("2021-5-21"),
                rating: 71,
                rank: 120
            }
        ],
        trainingsAndSeminarInfo: [
            {
                title: "F&A 360",
                organizer: "P&G",
                date: new Date("2022-2-22")
            },
            {
                title: "P&G Next",
                organizer: "P&G",
                date: new Date("2022-1-17")
            }
        ],
        employmentRecordInfo: [
            { 
                nameAddress: "HYBE Labels",
                nature: "Entertainment",
                fromDate: new Date("2017-5-16"),
                toDate: new Date("2019-7-19"),
                position: "Crew",
                reasonForLeaving: "Fatigue"
            },
            {
                nameAddress: "SM Entertainment",
                nature: "Entertainment", 
                fromDate: new Date("2019-9-30"),
                toDate: new Date("2020-6-26"),
                position: "Crew",
                reasonForLeaving: "Fatigue"
            }
        ],
        characterReferences: [
            {
                name: "Yeji",
                relationship: "Coworker",
                occupation: "Singer",
                companyNameAndAddress:  "JYP",
                contactNum: 5118439
            },
            {
                name: "Lia",
                relationship: "Sister",
                occupation: "Singer",
                companyNameAndAddress: "JYP",
                contactNum: 5118439
            },
            {
                name: "Ryujin",
                relationship: "Teacher",
                occupation: "Singer",
                companyNameAndAddress: "JYP",
                contactNum: 5118439
            },
            {
                name: "Chaeryong",
                relationship: "Aunt",
                occupation: "Singer",
                companyNameAndAddress: "JYP",
                contactNum: 5118439
            },
            {
                name: "Yuna",
                relationship: "Friend",
                occupation: "Singer",
                companyNameAndAddress: "JYP",
                contactNum: 5118439
            }
        ],
        contactPerson: "Choi Hansol",
        contactRelationship: "Uncle",
        contactAddress: "Seoul, KOR",
        contactNumber: 8294030711
    },
    {
        // 4 ria_reyes@gmail.com
        _id: ObjectId(),
        user: {
            _id: users[32]._id,
            personalEmail: users[32].personalEmail,
            firstName: users[32].firstName,
            middleName: users[32].middleName,
            lastName: users[32].lastName,
            nickName: users[32].nickName,
            userType: users[32].userType,
        },
        presentAddress: "The Professional Tower 37 Edsa Cor. Boni Avenue 1588",
        provincialAddress: "The Professional Tower 37 Edsa Cor. Boni Avenue 1588",
        telNum: 9122173,
        mobileNum: 63456749848,
        dateOfBirth: new Date("1999-02-28"),
        placeOfBirth: "Muntinlupa City",
        age: 22,
        gender: "gender-female",
        weight: 72,
        height: 163,
        civilStatus: "Single",
        citizenship: "Filipino",
        religion: "Christian",
        bloodType: "type-o",
        SSS: "0217045655",
        TIN: "701359543962",
        HDMF: "528153403352",
        PhilHealth: "60227026856",
        fatherName: "Yoon Jeonghan",
        fatherHomeAddress: "The Professional Tower 37 Edsa Cor. Boni Avenue 1588",
        fatherOccupation: "Manager",
        fatherCompany: "HYBE",
        motherName: "Kim Ye Rim",
        motherHomeAddress: "The Professional Tower 37 Edsa Cor. Boni Avenue 1588",
        motherOccupation: "Dancer",
        motherCompany: "SM",
        schoolRecords: [
            {
                level: "GS",
                nameAddress: "SSC-MNL",
                fromDate: new Date("2006-6-13"),
                toDate: new Date("2012-3-15"),
                degree: "GS Diploma"
            },

            {
                level: "JHS",
                nameAddress: "SSC-MNL",
                fromDate: new Date("2012-6-14"),
                toDate: new Date("2016-3-21"),
                degree: "JHS Diploma"
            },
            {
                level: "SHS",
                nameAddress: "DLSU",
                fromDate: new Date("2016-6-1"),
                toDate: new Date("2018-6-2"),
                degree: "SHS Diploma"
            },
            {
                level: "College",
                nameAddress: "DLSU",
                fromDate: new Date("2018-9-18"),
                toDate: new Date("2022-9-21"),
                degree: "BSINSYS"
            }
        ],
        characterReferences: [
            { 
                nameAddress: "HYBE Labels",
                nature: "Entertainment",
                fromDate: new Date("2017-5-16"),
                toDate: new Date("2019-7-19"),
                position: "Crew",
                reasonForLeaving: "Fatigue"
            },
            {
                nameAddress: "SM Entertainment",
                nature: "Entertainment", 
                fromDate: new Date("2019-9-30"),
                toDate: new Date("2020-6-26"),
                position: "Crew",
                reasonForLeaving: "Fatigue"
            }
        ],
        characterReferences: [
            {
                name: "Yeji",
                relationship: "Coworker",
                occupation: "Singer",
                companyNameAndAddress:  "JYP",
                contactNum: 5118439
            },
            {
                name: "Lia",
                relationship: "Sister",
                occupation: "Singer",
                companyNameAndAddress: "JYP",
                contactNum: 5118439
            },
            {
                name: "Ryujin",
                relationship: "Teacher",
                occupation: "Singer",
                companyNameAndAddress: "JYP",
                contactNum: 5118439
            },
            {
                name: "Chaeryong",
                relationship: "Aunt",
                occupation: "Singer",
                companyNameAndAddress: "JYP",
                contactNum: 5118439
            },
            {
                name: "Yuna",
                relationship: "Friend",
                occupation: "Singer",
                companyNameAndAddress: "JYP",
                contactNum: 5118439
            }
        ],
        contactPerson: "Boo Seungkwan",
        contactRelationship: "Uncle",
        contactAddress: "Seoul, KOR",
        contactNumber: 8215956109
    }
]
mongodb.insertMany('personalinformations', PIFData);



/**
 * Users Data for Circle Corporation, ICT department
 * <index> <company> <department, if applicable> 
 */
var users_CCI_ICT = [
    {
        // 0  CCI ICT Department Head
        _id: ObjectId(),
        email: "john.cena@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "John",
        middleName: "Nova",
        lastName: "Cena",
        nickName: "John",

        businessUnit: "Circle Corporation Inc.",
        department: "ICT",
        position: "Department Head",

        userType: "Employee",
        employmentType: "Full Time",


    }, 

    {
        // 1  CCI ICT Department Director
        _id: ObjectId(),
        email: "nikki.minaj@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Nikki",
        middleName: "Barbie",
        lastName: "Minah",
        nickName: "Nikki",

        businessUnit: "Circle Corporation Inc.",
        department: "ICT",
        position: "Department Director",

        userType: "Employee",
        employmentType: "Full Time",


    }, 

    {
        // 2  CCI ICT Hardware Technician
        _id: ObjectId(),
        email: "stefano.madrid@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Stefano",
        middleName: "Jao",
        lastName: "Madrid",
        nickName: "Stefano",

        businessUnit: "Circle Corporation Inc.",
        department: "ICT",
        position: "Hardware Technician",

        userType: "Employee",
        employmentType: "Full Time",


    }, 
    {
        // 3  CCI ICT Network Engineer
        _id: ObjectId(),
        email: "romeo.paloma@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Romeo",
        middleName: "Jack",
        lastName: "Paloma",
        nickName: "Rome",

        businessUnit: "Circle Corporation Inc.",
        department: "ICT",
        position: "Network Engineer",

        userType: "Employee",
        employmentType: "Full Time",


    }, 
    {
        // 4  CCI ICT 
        _id: ObjectId(),
        email: "irene.acebedo@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Irene",
        middleName: "Mon",
        lastName: "Acebedo",
        nickName: "Irene",

        businessUnit: "Circle Corporation Inc.",
        department: "ICT",
        position: "Systems Engineer",

        userType: "Employee",
        employmentType: "Full Time",


    }, 
    {
        // 5  CCI ICT 
        _id: ObjectId(),
        email: "paulina.javier@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Paulina",
        middleName: "Monique",
        lastName: "Javier",
        nickName: "Pau",

        businessUnit: "Circle Corporation Inc.",
        department: "ICT",
        position: "Database Analyst",

        userType: "Employee",
        employmentType: "Full Time",


    }, 
    {
        // 6  CCI ICT 
        _id: ObjectId(),
        email: "karlie.encela@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Karlie",
        middleName: "Ewan",
        lastName: "Encela",
        nickName: "Karl",

        businessUnit: "Circle Corporation Inc.",
        department: "ICT",
        position: "Quality Assurance Analyst",

        userType: "Employee",
        employmentType: "Full Time",


    } 
]
mongodb.insertMany('users', users_CCI_ICT);


/**
 * Users Data for Circle Corporation, Accounting and Finance department
 * <index> <company> <department, if applicable> 
 */
var users_CCI_Accounting = [
    {
        // 0  CCI Accounting Department Head
        _id: ObjectId(),
        email: "sofia.santos@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Sofia",
        middleName: "Mae",
        lastName: "Santos",
        nickName: "Sofia",

        businessUnit: "Circle Corporation Inc.",
        department: "Accounting and Finance",
        position: "Department Head",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 1  CCI Accounting Department Director
        _id: ObjectId(),
        email: "kelly.martinez@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Kelly",
        middleName: "Domingo",
        lastName: "Martinez",
        nickName: "Kelly",

        businessUnit: "Circle Corporation Inc.",
        department: "Accounting and Finance",
        position: "Department Director",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 2  CCI Accounting Junior Accountant
        _id: ObjectId(),
        email: "rudy.bernardo@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Rudy",
        middleName: "Mae",
        lastName: "Bernardo",
        nickName: "Rudy",

        businessUnit: "Circle Corporation Inc.",
        department: "Accounting and Finance",
        position: "Junior Accountant",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 3  CCI Accounting Senior Accountant
        _id: ObjectId(),
        email: "jarod.zafra@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Jarod",
        middleName: "John",
        lastName: "Zafra",
        nickName: "Jarod",

        businessUnit: "Circle Corporation Inc.",
        department: "Accounting and Finance",
        position: "Senior Accountant",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 4  CCI Accounting Bookkeeping
        _id: ObjectId(),
        email: "collin.valdez@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Collin",
        middleName: "Cruz",
        lastName: "Valdez",
        nickName: "Collin",

        businessUnit: "Circle Corporation Inc.",
        department: "Accounting and Finance",
        position: "Bookkeeping",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 5  CCI Accounting Cost Analysis
        _id: ObjectId(),
        email: "clare.fazon@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Clare",
        middleName: "Jen",
        lastName: "Fazon",
        nickName: "Clare",

        businessUnit: "Circle Corporation Inc.",
        department: "Accounting and Finance",
        position: "Cost Analysis",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 6  CCI Accounting Cost Analysis
        _id: ObjectId(),
        email: "lena.abayan@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Lena",
        middleName: "Mae",
        lastName: "Abayan",
        nickName: "Lena",

        businessUnit: "Circle Corporation Inc.",
        department: "Accounting and Finance",
        position: "Billing Administrator",

        userType: "Employee",
        employmentType: "Full Time",
    }

]
mongodb.insertMany('users', users_CCI_Accounting);


/**
 * Users Data for Circle Corporation, Supply Chain and Administration department
 * <index> <company> <department, if applicable> 
 */
 var users_CCI_SupplyChain = [
    {
        // 0  CCI Supply Chain and Administration Department Head
        _id: ObjectId(),
        email: "joan.hidalgo@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Joan",
        middleName: "Cruz",
        lastName: "Hidalgo",
        nickName: "Joan",

        businessUnit: "Circle Corporation Inc.",
        department: "Supply Chain and Administration",
        position: "Department Head",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 1  CCI Supply Chain and Administration Department Director
        _id: ObjectId(),
        email: "chris.aquino@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Chris",
        middleName: "Yap",
        lastName: "Aquino",
        nickName: "Chris",

        businessUnit: "Circle Corporation Inc.",
        department: "Supply Chain and Administration",
        position: "Department Director",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 2  CCI Supply Chain and Administration Supply Chain Specialist
        _id: ObjectId(),
        email: "miranda.bush@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Miranda",
        middleName: "Sings",
        lastName: "Bush",
        nickName: "Miranda",

        businessUnit: "Circle Corporation Inc.",
        department: "Supply Chain and Administration",
        position: "Supply Chain Specialist",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 3  CCI Supply Chain and Administration Inventory Associate
        _id: ObjectId(),
        email: "alden.ricardo@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Alden",
        middleName: "Rich",
        lastName: "Ricardo",
        nickName: "Alden",

        businessUnit: "Circle Corporation Inc.",
        department: "Supply Chain and Administration",
        position: "Inventory Associate",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 4  CCI Supply Chain and Administration Procurement Specialist
        _id: ObjectId(),
        email: "cory.urbina@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Cory",
        middleName: "Aqui",
        lastName: "Urbina",
        nickName: "Cory",

        businessUnit: "Circle Corporation Inc.",
        department: "Supply Chain and Administration",
        position: "Procurement Specialist",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 5  CCI Supply Chain and Administration Sourcing Specialist
        _id: ObjectId(),
        email: "henry.cayabyab@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Henry",
        middleName: "Sy",
        lastName: "Cayabyab",
        nickName: "Henry",

        businessUnit: "Circle Corporation Inc.",
        department: "Supply Chain and Administration",
        position: "Sourcing Specialist",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 6  CCI Supply Chain and Administration Fulfillment Associate
        _id: ObjectId(),
        email: "rosa.laurel@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Rosa",
        middleName: "Mae",
        lastName: "Laurel",
        nickName: "Rosa",

        businessUnit: "Circle Corporation Inc.",
        department: "Supply Chain and Administration",
        position: "Fulfillment Associate",

        userType: "Employee",
        employmentType: "Full Time",
    }
 
]
mongodb.insertMany('users', users_CCI_SupplyChain);

/**
 * Users Data 
 * for LNL Archipelago Minerals, Functional Materials department
 * <index> <company> <department, if applicable> 
 */
 var users_LNL_FunctionalMaterials = [
    {
        // 0  LNL Functional Materials Department Head
        _id: ObjectId(),
        email: "mark.sanchez@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Mark",
        middleName: "Cruz",
        lastName: "Sanchez",
        nickName: "Mark",

        businessUnit: "LNL Archipelago Minerals",
        department: "Functional Materials",
        position: "Department Head",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 1  LNL Functional Materials Department Director
        _id: ObjectId(),
        email: "rue.bennett@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Rue",
        middleName: "Queen",
        lastName: "Bennett",
        nickName: "Rue",

        businessUnit: "LNL Archipelago Minerals",
        department: "Functional Materials",
        position: "Department Director",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 2  LNL Functional Materials Materials Engineer
        _id: ObjectId(),
        email: "lia.roces@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Lia",
        middleName: "Chino",
        lastName: "Roces",
        nickName: "Lia",

        businessUnit: "LNL Archipelago Minerals",
        department: "Functional Materials",
        position: "Materials Engineer",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 3  LNL Functional Materials Plant Technician
        _id: ObjectId(),
        email: "hugh.cueva@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Hugh",
        middleName: "Aldrich",
        lastName: "Cueva",
        nickName: "Hugh",

        businessUnit: "LNL Archipelago Minerals",
        department: "Functional Materials",
        position: "Plant Technician",

        userType: "Employee",
        employmentType: "Contractual",

        assessmentLength: {
            years: 5,
            months: 0
        }
    },
    {
        // 4  LNL Functional Materials Materials Associate
        _id: ObjectId(),
        email: "reese.ello@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Reese",
        middleName: "Choco",
        lastName: "Ello",
        nickName: "Reese",

        businessUnit: "LNL Archipelago Minerals",
        department: "Functional Materials",
        position: "Materials Associate",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 5  LNL Functional Materials Research Scientist
        _id: ObjectId(),
        email: "harley.king@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Harley",
        middleName: "Vi",
        lastName: "King",
        nickName: "Harley",

        businessUnit: "LNL Archipelago Minerals",
        department: "Functional Materials",
        position: "Research Scientist",

        userType: "Employee",
        employmentType: "Project Based",

        assessmentLength: {
            years: 5,
            months: 0
        }
    },
    {
        // 6  LNL Functional Materials
        _id: ObjectId(),
        email: "macario.uy@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Macario",
        middleName: "Dy",
        lastName: "Uy",
        nickName: "Mac",

        businessUnit: "LNL Archipelago Minerals",
        department: "Functional Materials",
        position: "Plant Materials Coordinator",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 7  LNL Functional Materials
        _id: ObjectId(),
        email: "mike.jacinto@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Mike",
        middleName: "Cruz",
        lastName: "Jacinto",
        nickName: "Mike",

        businessUnit: "LNL Archipelago Minerals",
        department: "Functional Materials",
        position: "Materials Analyst",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 8  LNL Functional Materials
        _id: ObjectId(),
        email: "eli.solivio@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Eli",
        middleName: "John",
        lastName: "Solivio",
        nickName: "Eli",

        businessUnit: "LNL Archipelago Minerals",
        department: "Functional Materials",
        position: "Field Engineer",

        userType: "Employee",
        employmentType: "Contractual",

        assessmentLength: {
            years: 5,
            months: 0
        }
    },
    {
        // 9  LNL Functional Materials
        _id: ObjectId(),
        email: "dia.buenos@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Dia",
        middleName: "Pe",
        lastName: "Buenos",
        nickName: "Dia",

        businessUnit: "LNL Archipelago Minerals",
        department: "Functional Materials",
        position: "Materials Compliance Specialist",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 10  LNL Functional Materials
        _id: ObjectId(),
        email: "dona.orante@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Dona",
        middleName: "Mary",
        lastName: "Orante",
        nickName: "Dona",

        businessUnit: "LNL Archipelago Minerals",
        department: "Functional Materials",
        position: "Materials Planning Analyst",

        userType: "Employee",
        employmentType: "Project Based",

        assessmentLength: {
            years: 4,
            months: 0
        }
    },
    {
        // 11  LNL Functional Materials
        _id: ObjectId(),
        email: "chris.parker@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Chris",
        middleName: "Prat",
        lastName: "Parker",
        nickName: "Chris",

        businessUnit: "LNL Archipelago Minerals",
        department: "Functional Materials",
        position: "Experimentalist",

        userType: "Employee",
        employmentType: "Contractual",

        assessmentLength: {
            years: 3,
            months: 0
        }
    },
    {
        // 12  LNL Functional Materials Plant Technician
        _id: ObjectId(),
        email: "julian.aquino@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Julian",
        middleName: "Aldrich",
        lastName: "Aquino",
        nickName: "Julian",

        businessUnit: "LNL Archipelago Minerals",
        department: "Functional Materials",
        position: "Plant Technician",

        userType: "Employee",
        employmentType: "Contractual",

        assessmentLength: {
            years: 5,
            months: 0
        }
    },
    {
        // 13  LNL Functional Materials Plant Technician
        _id: ObjectId(),
        email: "marites.dario@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Marites",
        middleName: "Aldrich",
        lastName: "Dario",
        nickName: "Marites",

        businessUnit: "LNL Archipelago Minerals",
        department: "Functional Materials",
        position: "Plant Technician",

        userType: "Employee",
        employmentType: "Contractual",

        assessmentLength: {
            years: 5,
            months: 0
        }
    }
]
mongodb.insertMany('users', users_LNL_FunctionalMaterials);

/**
 * Users Data for the 
 * Business Unit Head 
 * Leonio Land
 * Board of Directors
 * <index> <company> <department, if applicable> 
 */
 var users_LL_Board = [
    {
        // 0  LL RED Business Unit Head
        _id: ObjectId(),
        email: "jarret.waters@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Jaret",
        middleName: "King",
        lastName: "Waters",
        nickName: "Jaret",

        businessUnit: "Leonio Land",
        department: "Board of Directors",
        position: "Business Unit Head",

        userType: "Employee",
        employmentType: "Full Time",
    }
]
mongodb.insertMany('users', users_LL_Board);

/**
 * Users Data for the 
 * Leonio Land
 * Real Estate Development
 * <index> <company> <department, if applicable> 
 */
 var users_LL_RED= [
    {
        // 0  LL RED Department Head
        _id: ObjectId(),
        email: "donnie.gilber@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Donnie",
        middleName: "King",
        lastName: "Gilber",
        nickName: "Don",

        businessUnit: "Leonio Land",
        department: "Real Estate Development",
        position: "Department Head",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 1  LL RED Department Director
        _id: ObjectId(),
        email: "chelsey.edwards@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Chelsey",
        middleName: "Sy",
        lastName: "Edwards",
        nickName: "Chelsey",

        businessUnit: "Leonio Land",
        department: "Real Estate Development",
        position: "Department Director",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 2  LL RED Department External Affairs Coordinator
        _id: ObjectId(),
        email: "eliseo.agustin@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Eliseo",
        middleName: "Sy",
        lastName: "Agustin",
        nickName: "Eliseo",

        businessUnit: "Leonio Land",
        department: "Real Estate Development",
        position: "External Affairs Coordinator",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 3  LL RED 
        _id: ObjectId(),
        email: "rico.buan@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Rico",
        middleName: "Sy",
        lastName: "Buan",
        nickName: "Rico",

        businessUnit: "Leonio Land",
        department: "Real Estate Development",
        position: "Project Development Specialist",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 4  LL RED 
        _id: ObjectId(),
        email: "kali.gil@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Kali",
        middleName: "Sy",
        lastName: "Gil",
        nickName: "Kali",

        businessUnit: "Leonio Land",
        department: "Real Estate Development",
        position: "Sales Operations Associate",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 5  LL RED 
        _id: ObjectId(),
        email: "daniella.arce@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Daniella",
        middleName: "Sy",
        lastName: "Arce",
        nickName: "Danie",

        businessUnit: "Leonio Land",
        department: "Real Estate Development",
        position: "Copywriter",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 6  LL RED 
        _id: ObjectId(),
        email: "ali.capili@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Ali",
        middleName: "Sy",
        lastName: "Capili",
        nickName: "Ali",

        businessUnit: "Leonio Land",
        department: "Real Estate Development",
        position: "Property Specialist",

        userType: "Employee",
        employmentType: "Full Time",
    }

]
mongodb.insertMany('users', users_LL_RED);


/**
 * Users Data for the 
 * Leonio Land
 * General Contracting
 * <index> <company> <department, if applicable> 
 */
 var users_LL_GC= [
    {
        // 0  LL General Contracting Department Head
        _id: ObjectId(),
        email: "michael.lewis@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Michael",
        middleName: "King",
        lastName: "Lewis",
        nickName: "Michael",

        businessUnit: "Leonio Land",
        department: "General Contracting",
        position: "Department Head",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 1  LL General Contracting Department Director
        _id: ObjectId(),
        email: "jeremy.williams@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Jeremy",
        middleName: "Sy",
        lastName: "Williams",
        nickName: "Jeremy",

        businessUnit: "Leonio Land",
        department: "General Contracting",
        position: "Department Director",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 2  LL General Contracting Department External Affairs Coordinator
        _id: ObjectId(),
        email: "dolores.manabat@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Dolores",
        middleName: "Sy",
        lastName: "Manabat",
        nickName: "Dolor",

        businessUnit: "Leonio Land",
        department: "General Contracting",
        position: "Contract Management Officer",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 3  LL General Contracting 
        _id: ObjectId(),
        email: "emily.dantes@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Emily",
        middleName: "Sy",
        lastName: "Dantes",
        nickName: "Emily",

        businessUnit: "Leonio Land",
        department: "General Contracting",
        position: "Contracts Administrator",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 4  LL General Contracting 
        _id: ObjectId(),
        email: "jimmy.madrid@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Jimmy",
        middleName: "Sy",
        lastName: "Madrid",
        nickName: "Jim",

        businessUnit: "Leonio Land",
        department: "General Contracting",
        position: "Documentation Staff",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 5  LL General Contracting 
        _id: ObjectId(),
        email: "randy.santiago@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Randy",
        middleName: "Sy",
        lastName: "Santiago",
        nickName: "Danie",

        businessUnit: "Leonio Land",
        department: "General Contracting",
        position: "Data Entry Encoder",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 6  LL General Contracting 
        _id: ObjectId(),
        email: "herber.balbuena@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Herber",
        middleName: "Sy",
        lastName: "Balbuena",
        nickName: "Ali",

        businessUnit: "Leonio Land",
        department: "General Contracting",
        position: "Settlement Analyst",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 7  LL General Contracting 
        _id: ObjectId(),
        email: "karl.alba@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Karl",
        middleName: "Sy",
        lastName: "Alba",
        nickName: "Karl",

        businessUnit: "Leonio Land",
        department: "General Contracting",
        position: "Fiscal Compliance Associate",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 8  LL General Contracting 
        _id: ObjectId(),
        email: "riley.cueva@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Riley",
        middleName: "Sy",
        lastName: "Alba",
        nickName: "Cueva",

        businessUnit: "Leonio Land",
        department: "General Contracting",
        position: "Subject Area Coordinator",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 9  LL General Contracting 
        _id: ObjectId(),
        email: "shea.hermano@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Shea",
        middleName: "Sy",
        lastName: "Hermano",
        nickName: "Cueva",

        businessUnit: "Leonio Land",
        department: "General Contracting",
        position: "Junior Contracting Officer",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 10  LL General Contracting 
        _id: ObjectId(),
        email: "maria.bituin@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Maria",
        middleName: "Sy",
        lastName: "Bituin",
        nickName: "Cueva",

        businessUnit: "Leonio Land",
        department: "General Contracting",
        position: "Senior Contracting Officer",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 11  LL General Contracting 
        _id: ObjectId(),
        email: "lenora.tayag@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Lenora",
        middleName: "Sy",
        lastName: "Tayag",
        nickName: "Cueva",

        businessUnit: "Leonio Land",
        department: "General Contracting",
        position: "Contracting Agent",

        userType: "Employee",
        employmentType: "Full Time",
    }

]
mongodb.insertMany('users', users_LL_GC);


/**
 * Users Data for the 
 * Business Unit Head 
 * Petrolift
 * Board of Directors
 * <index> <company> <department, if applicable> 
 */
 var users_Petrolift_Board = [
    {
        // 0   Petrolift Business Unit Head
        _id: ObjectId(),
        email: "dwight.steele@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Dwight",
        middleName: "Mary",
        lastName: "Steele",
        nickName: "Dwight",

        businessUnit: "Petrolift",
        department: "Board of Directors",
        position: "Business Unit Head",

        userType: "Employee",
        employmentType: "Full Time",
    }
]
mongodb.insertMany('users', users_Petrolift_Board);

/**
 * Users Data for 
 * Petrolift
 * Technical Dep
 * <index> <company> <department, if applicable> 
 */
 var users_Petrolift_Technical = [
    {
        // 0   Petrolift Technical  Department Head
        _id: ObjectId(),
        email: "charity.cohen@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Charity",
        middleName: "Mary",
        lastName: "Cohen",
        nickName: "Charity",

        businessUnit: "Petrolift",
        department: "Technical",
        position: "Department Head",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 1  Petrolift Technical  Department Director
        _id: ObjectId(),
        email: "love.grogen@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Love",
        middleName: "Mary",
        lastName: "Grogen",
        nickName: "Charity",

        businessUnit: "Petrolift",
        department: "Technical",
        position: "Department Director",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 2   Petrolift Technical  
        _id: ObjectId(),
        email: "jarvis.aldo@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Jarvis",
        middleName: "Mary",
        lastName: "Aldo",
        nickName: "Jarvis",

        businessUnit: "Petrolift",
        department: "Technical",
        position: "Superintendent Engineer",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 3   Petrolift Technical  
        _id: ObjectId(),
        email: "peter.sicat@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Peter",
        middleName: "Mary",
        lastName: "Sicat",
        nickName: "Peter",

        businessUnit: "Petrolift",
        department: "Technical",
        position: "Technical Coordinator",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 4   Petrolift Technical  
        _id: ObjectId(),
        email: "ivan.deseo@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Ivan",
        middleName: "John",
        lastName: "Deseo",
        nickName: "Ivan",

        businessUnit: "Petrolift",
        department: "Technical",
        position: "Electronics Engineer",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 5   Petrolift Technical  
        _id: ObjectId(),
        email: "sam.casis@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Sam",
        middleName: "Milby",
        lastName: "Casis",
        nickName: "Sam",

        businessUnit: "Petrolift",
        department: "Technical",
        position: "Lubricants & Support Specialist",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 6   Petrolift Technical  
        _id: ObjectId(),
        email: "renee.barerra@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Renee",
        middleName: "Milby",
        lastName: "Barrera",
        nickName: "Ren",

        businessUnit: "Petrolift",
        department: "Technical",
        position: "Vessel Support Officer",

        userType: "Employee",
        employmentType: "Full Time",
    },

]
mongodb.insertMany('users', users_Petrolift_Technical);


/**
 * Users Data for 
 * Petrolift
 * Quality, Safety & Environmental (QSE) department
 * <index> <company> <department, if applicable> 
 */
 var users_Petrolift_QSE = [
    {
        // 0   Petrolift QSE  Department Head
        _id: ObjectId(),
        email: "jamie.anipot@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Jamie",
        middleName: "Cruz",
        lastName: "Anipot",
        nickName: "Jamie",

        businessUnit: "Petrolift",
        department: "Quality, Safety & Environmental",
        position: "Department Head",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 1  Petrolift QSE  Department Director
        _id: ObjectId(),
        email: "jonas.manolo@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Jonas",
        middleName: "Diaz",
        lastName: "Manolo",
        nickName: "Jonas",

        businessUnit: "Petrolift",
        department: "Quality, Safety & Environmental",
        position: "Department Director",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 2   Petrolift QSE  
        _id: ObjectId(),
        email: "jacob.belo@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Jacob",
        middleName: "Wolf",
        lastName: "Belo",
        nickName: "Jacob",

        businessUnit: "Petrolift",
        department: "Quality, Safety & Environmental",
        position: "Quality Officer",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 3   Petrolift QSE  
        _id: ObjectId(),
        email: "oliver.acosta@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Oliver",
        middleName: "Juan",
        lastName: "Acosta",
        nickName: "Oli",

        businessUnit: "Petrolift",
        department: "Quality, Safety & Environmental",
        position: "Environmental Advisor",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 4   Petrolift QSE  
        _id: ObjectId(),
        email: "sophie.bernal@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Sophie",
        middleName: "Mae",
        lastName: "Bernal",
        nickName: "Sophie",

        businessUnit: "Petrolift",
        department: "Quality, Safety & Environmental",
        position: "Port Captain",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 5   Petrolift QSE  
        _id: ObjectId(),
        email: "mara.regis@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Mara",
        middleName: "Dona",
        lastName: "Regis",
        nickName: "Mara",

        businessUnit: "Petrolift",
        department: "Quality, Safety & Environmental",
        position: "Marine Officer",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 6   Petrolift QSE  
        _id: ObjectId(),
        email: "holly.magno@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Holly",
        middleName: "Shid",
        lastName: "Magno",
        nickName: "Holly",

        businessUnit: "Petrolift",
        department: "Quality, Safety & Environmental",
        position: "Vetting Officer",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 7   Petrolift QSE  
        _id: ObjectId(),
        email: "thomas.naval@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Thomas",
        middleName: "Shid",
        lastName: "Naval",
        nickName: "Thomas",

        businessUnit: "Petrolift",
        department: "Quality, Safety & Environmental",
        position: "Safety Officer",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 8   Petrolift QSE  
        _id: ObjectId(),
        email: "kobe.catapang@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Kobe",
        middleName: "Bryant",
        lastName: "Catapang",
        nickName: "Kobe",

        businessUnit: "Petrolift",
        department: "Quality, Safety & Environmental",
        position: "QSE Consultant",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 9   Petrolift QSE  
        _id: ObjectId(),
        email: "heidi.diaz@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Heidi",
        middleName: "Bryant",
        lastName: "Diaz",
        nickName: "Heidi",

        businessUnit: "Petrolift",
        department: "Quality, Safety & Environmental",
        position: "Protection Technician",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 10   Petrolift QSE  
        _id: ObjectId(),
        email: "jenny.cuenco@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Jenny",
        middleName: "Mantap",
        lastName: "Cuenco",
        nickName: "Jen",

        businessUnit: "Petrolift",
        department: "Quality, Safety & Environmental",
        position: "Compliance Assistance Specialist",

        userType: "Employee",
        employmentType: "Full Time",
    },
    {
        // 11   Petrolift QSE  
        _id: ObjectId(),
        email: "irma.macaraig@leoniogroup.com",
        password: "$2a$10$D2o/aRGWQIRHyYctUvXScOzFNLQXf3mRRRaDEPhHBUEFpzL2wDSDC", //"secret"

        firstName: "Irma",
        middleName: "Alfonso",
        lastName: "Macaraig",
        nickName: "Irma",

        businessUnit: "Petrolift",
        department: "Quality, Safety & Environmental",
        position: "QSE Coordinator",

        userType: "Employee",
        employmentType: "Full Time",
    },


]
mongodb.insertMany('users', users_Petrolift_QSE);


/**
 * Initial Positions Data
 * for choices in making PRF
 */
var positions = [
    {
        // [0]
        _id: ObjectId(),

        positionTitle: "Safety Compliance Officer",

        businessUnit: "LNL Archipelago Minerals",
        department: "Environment & Safety",
        
        positionLevel:"Operational/Technical",
        jobCode: "Level 1",
        

        billToCompany: "LNL Archipelago Minerals",
        location: "Makati City",

        jobDescription: "Establishes a safe workplace according to legal standards and foster a culture of attention to health and safety, support the development of OHS policies and programs,  advise and instruct on various safety-related topics (noise levels, use of machinery etc.), and conduct risk assessment and enforcing preventative measures. ",
        positionRequirements: "In depth knowledge of legislation (e.g. OSHA/EPA) and procedures, Knowledge of potentially hazardous materials or practices, and experience in writing reports and policies for health and safety",
        skills:[
            "Decision Making", "Collaboration Skill", "Building Capability", "Delivering at Pace", "Problem Solving Skill" 
        ]
    
    }, 
    {
        // [1]
        _id: ObjectId(),

        positionTitle: "Hazard Control Specialist",

        businessUnit: "LNL Archipelago Minerals",
        department: "Environment & Safety",
        
        positionLevel:"Operational/Technical",
        jobCode: "Level 2",
        

        billToCompany: "LNL Archipelago Minerals",
        location: "Manila City",

        jobDescription: "Provides research and analysis across several Risk Management functions or processes including interpreting policies and processes, determining required actions and making recommendations based on firm policies or guidance. Other responsibilities include analyzing issues and producing deliverables to document the diligence with which such tasks were performed, as the work product is subject to review and scrutiny by outside regulators. ",
        positionRequirements: "Ability to learn and understand the firm and regulators’ independence rules and policies as well as familiarity with other quality and risk management initiatives outside of area of expertise. Must have basic knowledge of project management tools and methodologies."
        ,
        skills:[
            "Analytical Skill", "Commercial Awareness", "Numeracy", "Business Understanding ", "Regulation Knowledge" 
        ]
    }, 
    {
        // [2]
        _id: ObjectId(),

        positionTitle: "Safety Engineer",

        businessUnit: "LNL Archipelago Minerals",
        department: "Environment & Safety",
        
        positionLevel:"Professional",
        jobCode: "Level 1",
        

        billToCompany: "LNL Archipelago Minerals",
        location: "Davao City",

        jobDescription: "Monitor the general work environment, inspect buildings and machines for hazards and safety violations, and recommend safety features in new processes and products. Evaluate plans for new equipment to assure that it is safe to operate and investigate accidents to determine the cause and how to keep them from happening again.",
        positionRequirements: "Must have relevant work experience, typically at least 4 years. A bachelor’s degree, typically in environmental health and safety or in an engineering discipline, such as electrical, chemical, mechanical, industrial, or systems engineering. And a passing score on the Professional Engineering (PE) exam."
        ,
        skills:[
            "Health and Safety Management", "Documentation", "Communication Skill", "Innovation", "Risk Management" 
        ]
    }, 
    {
        // [3]
        _id: ObjectId(),

        positionTitle: "Environmental Engineer",

        businessUnit: "LNL Archipelago Minerals",
        department: "Environment & Safety",
        
        positionLevel:"Professional",
        jobCode: "Level 2",
        

        billToCompany: "LNL Archipelago Minerals",
        location: "Laguna City",

        jobDescription: "Design technology for pollution control and waste management, collect and analyze environmental data. Also carry out site assessments to determine the environmental impact of commercial activity, study human influences on the environment, and identify critical research areas such as renewable energy, climate change, and food and water security.",
        positionRequirements: "Degree in environmental, civil, or Mechanical Engineering and Master's degree preferred. Must have a PE (Professional Engineering) license and is comfortable working outdoors and have excellent written communication and proficiency with technical reports."
        ,
        skills:[
            "Analytical Skill", "Quality Assurance ", "Problem Solving ", "Documentation", "Innovation" 
        ]
    }, 
    {
        // [4]
        _id: ObjectId(),

        positionTitle: "Risk Control Specialist ",

        businessUnit: "LNL Archipelago Minerals",
        department: "Environment & Safety",
        
        positionLevel:"Operational/Technical",
        jobCode: "Level 1",
        

        billToCompany: "LNL Archipelago Minerals",
        location: "Ilocos City",

        jobDescription: "Document, and ensure communication of, key risks, prepare financial documents, reports, or budgets,maintain input or data quality of risk management systems. And, identify key risks and mitigating factors of potential investments, such as asset types and values, legal and ownership structures, professional reputations, customer bases, or industry segments.",
        positionRequirements: "Must have a bachelor's degree in statistics, economics, finance or another business-related degree. They should be able to use software programs, including Excel, and complete extensive research to evaluate business decisions."
        ,
        skills:[
            "Financial Acumen", "Statistical Analysis", "Risk Assessment", "Data Privacy and Protection", "Project Management" 
        ]
    }, 
    {
        // [5]
        _id: ObjectId(),

        positionTitle: "Materials Engineer",

        businessUnit: "LNL Archipelago Minerals",
        department: "Functional Materials",
        
        positionLevel:"Professional",
        jobCode: "Level 1",
        

        billToCompany: "LNL Archipelago Minerals",
        location: "Makati City",

        jobDescription: "Investigate, develop, process and test ceramics, chemicals, polymers, metals and other; able to improve their existing properties, and create entirely new substances by examining the way various materials behave and are formed at the atomic level.",
        positionRequirements: "Graduates will need a degree in a relevant engineering or science-based subject, such as materials engineering, mining engineering, mechanical engineering, materials science, or metallurgy."
        ,
        skills:[
            "Attention to Detail", "Teamwork", "Leadership Skill", "Organizational Skill", "Commercial Awareness" 
        ]
    },
    {
        // [6]
        _id: ObjectId(),

        positionTitle: "Plant Technician",

        businessUnit: "LNL Archipelago Minerals",
        department: "Functional Materials",
        
        positionLevel:"Operational/Technical",
        jobCode: "Level 1",
        

        billToCompany: "LNL Archipelago Minerals",
        location: "Manila City",

        jobDescription: "Monitors the operation of a power plant to ensure its functionality and output are stable. Perform diagnostic evaluation on equipment and make repairs when needed. Ensures that repairs are performed in the shortest amount of time possible to alleviate down time. Performs preventive, corrective and scheduled maintenance on a daily basis on a variety of machinery within the plant.",
        positionRequirements: "Hands on experience with all aspects of steam power plant operations and maintenance including mechanical maintenance, instrument and electrical systems, and a working knowledge of power cycles."
        ,
        skills:[
            "Machine Maintenance", "Design Skill", "Attention to Detail", "Teamwork", "Computer Skill" 
        ]
    },
    {
        // [7]
        _id: ObjectId(),

        positionTitle: "Materials Associate",

        businessUnit: "LNL Archipelago Minerals",
        department: "Functional Materials",
        
        positionLevel:"Operational/Technical",
        jobCode: "Level 1",
        

        billToCompany: "LNL Archipelago Minerals",
        location: "Manila City",

        jobDescription: "Maintaining the production and distribution of products, documenting materials and supplies, and preparing finished products for shipment.",
        positionRequirements: "Manufacturing experience is strongly preferred. The ability to read and interpret documents such as safety rules, operating and maintenance instructions, and procedure manuals."
        ,
        skills:[
            "Production Assessment", "Quality Assurance", "Documentation", "Material and Machine Defect Detection", "Process Assessment" 
        ]
    },
    {
        // [8]
        _id: ObjectId(),

        positionTitle: "Research Scientist",

        businessUnit: "LNL Archipelago Minerals",
        department: "Functional Materials",
        
        positionLevel:"Professional",
        jobCode: "Level 3",
        

        billToCompany: "LNL Archipelago Minerals",
        location: "Marilao City",

        jobDescription: "Responsible for designing, undertaking and analysing information from controlled laboratory-based investigations, experiments and trials.",
        positionRequirements: "Receipt of a pertinent master's degree. Possession of an applicable doctorate is suggested. Completion of a postdoctoral course is highly advantageous. Existing publications in authoritative outlets. Polished data analysis techniques."
        ,
        skills:[
            "Job Market Skill", "Responsible Conduct of Research", "Research Development", "Experimental Design", "Statistical Analysis" 
        ]
    },
    {
        // [9]
        _id: ObjectId(),

        positionTitle: "Plant Materials Coordinator",

        businessUnit: "LNL Archipelago Minerals",
        department: "Functional Materials",
        
        positionLevel:"Operational/Technical",
        jobCode: "Level 1",
        

        billToCompany: "LNL Archipelago Minerals",
        location: "Lipa City",

        jobDescription: "Receipt of a pertinent master's degree. Possession of an applicable doctorate is suggested. Completion of a postdoctoral course is highly advantageous. Existing publications in authoritative outlets. Polished data analysis techniques. Excellent written and verbal communication skills. Well-honed interpersonal capacities. Passionate about gainful collaboration.",
        positionRequirements: "Bachelor’s degree in botany, biology, wildlife, horticulture, ecology or related field with five years of post-degree experience or Master’s degree in one of the same areas with three years of experience. Strong organizational skills and attention to detail. Experience managing several projects simultaneously."
        ,
        skills:[
            "Inventory Management", "Communication Skill", "Time Management", "Problem Solving", "Organizational Skill " 
        ]
    },
    {
        // [10]
        _id: ObjectId(),

        positionTitle: "Miner",

        businessUnit: "LNL Archipelago Minerals",
        department: "Environment & Safety",
        
        positionLevel:"Operational/Technical",
        jobCode: "Level 1",
        

        billToCompany: "LNL Archipelago Minerals",
        location: "Lipa City",

        jobDescription: "Job duties in the mining industry usually depend on the particular segment: oil and gas, metal ores, nonmetallic mineral mining (quarrying) and mining support. For example, coal miners can work in deep coal mines or on surface mining areas, where they are responsible for extracting coal, bringing it to the surface and transporting it to the buyers. Oil and petroleum workers may work on ocean oil rigs or land-based oil wells. ",
        positionRequirements: "At least High School graduate. at least 1 year experience in mining."
        ,
        skills:[
            "Mining Skill", "First Aid Skill", "Safety Skill", "Cart Operation Skill", "Tools Maintenance Skill" 
        ]
    },
    {
        // [11]
        _id: ObjectId(),

        positionTitle: "Flowback Operator",

        businessUnit: "LNL Archipelago Minerals",
        department: "Environment & Safety",
        
        positionLevel:"Operational/Technical",
        jobCode: "Level 1",
        

        billToCompany: "LNL Archipelago Minerals",
        location: "Lipa City",

        jobDescription: "We are seeking experienced flowback operators for work on the front range and western slope. At least one year of experience preferred. Must have a valid drivers license, good background and be drug free. We offer competitive pay and benefits.",
        positionRequirements: " High school graduate or equivalent. Driver's License. English language"
        ,
        skills:[
            "Flowback Operation Skill", "First Aid Skill", "Safety Skill", "Cart Operation Skill", "Tools Maintenance Skill" 
        ]
    }
]
mongodb.insertMany('positions', positions);

