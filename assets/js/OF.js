var currentDate = new Date();
// var date = currentDate.toISOString().slice(0, 10);
var date = new Date(currentDate.setDate(currentDate.getDate() + 30))
	.toISOString()
	.slice(0, 10);
let BUValue;
let positions = [];
let names = [];
let businessUnits = [];
let departments = [];
let usersData = [];
$("#effective_date").attr("min", date);

// initializes the modal UI
$(".modal").modal();

$(window).load(function () {
	$.get("/getNextOffboardingID", function (offboardingID, err) {
		$(".offboardingID").text(offboardingID);
	});

	$.get("/getSessionDetails", function (session, err) {
		if (session.position === "HR Supervisor") {
			$(".nature").remove();
			$(".separation").remove();
		} else {
			$(".personalInfo").remove();
			$(".termination").remove();
			$(".noticeLetter").remove();
		}

		if (session.position != "HR Supervisor") {
			// if not HR supervisor, check for current logged user
			//checks if there is an existing Pending/Approved clearance form.
			$.post(
				"/checkExistingClearanceFormBeingProcessed",
				{ name: session.name },
				function (existingOffboardingID, err) {
					if (existingOffboardingID != "null") {
						$("#clearance_form_actual").remove();
						$(".NoticeModal-content").html(`
                    <h4>Notice</h4>
                    You already submitted a Clearance form that is being processed. 
                    `);

						$(".modal-footer").append(`
                        <a href="/OffboardingTracker/${existingOffboardingID}" class="modal-action 
                                btn btn-flat ">
                                Go To My Clearance Form
                            </a>
                    `);

						$("#notice_modal_btn").click();
					}
				}
			);
		}
	});

	$.get("/ClearanceForm", function (userData, err) {
		userData.map(user => {
			usersData.push({
				name: `${user.firstName} ${user.lastName}`,
				_id: user._id,
				position: user.position,
				department: user.department,
				businessUnit: user.businessUnit,
			});
		});

		displayValues(userData);
	});
});

$(".name").change(function (event) {
	// $('.department').attr('disabled', true)
	// $('.position').attr('disabled', true)

	//filter -
	var newData = usersData.filter(user => user.name === this.value);

	newData.map(user => {
		$(".off_user_id").val(user._id);
		$(".department").html(
			`<option value="${user.department}" selected>${user.department}</option >`
		);
		$(".position").html(
			`<option value="${user.position}" selected>${user.position}</option >`
		);
		$(".businessUnit").val(user.businessUnit);
	});

	const userInput = this.value;
	const names = userInput.split(" ");
	const lastName = names[names.length - 1];
	$(".lastName").val(lastName);

	var name = this.value;

	// if HR supervisor, check for the selected name
	//checks if there is an existing Pending/Approved clearance form.
	$.post(
		"/checkExistingClearanceFormBeingProcessed",
		{ name: name },
		function (existingOffboardingID, err) {
			if (existingOffboardingID != "null") {
				$(".NoticeModal-content").html(`
            <h4>Notice</h4>
            You already submitted a Clearance form for ${name} that is being processed. 
            `);

				$(".modal-footer").append(`
                <a href="/OffboardingTracker/${existingOffboardingID}" class="modal-action 
                        btn btn-flat ">
                        Go To ${name}'s Clearance Form
                    </a>
            `);

				$("#notice_modal_btn").click();
			}
		}
	);
});

$(".businessUnit").on("change", function () {
	// $('.department').attr('disabled', false)
	// $('.position').attr('disabled', false)
	departments = [];
	positions = [];
	$(".position").html(`
        <option value="" disabled selected> Select Position</option >
    `);
	$(".department").html(`
        <option value=""  disabled selected> Select Department</option >
    `);

	//kukunin lahat ng dept and postion sa bu na naselect
	usersData.map(user => {
		if (
			user.businessUnit === this.value &&
			!departments.includes(user.department) &&
			!positions.includes(user.position)
		) {
			departments.push(user.department);
			positions.push(user.position);
		}
	});

	departments.map(dept => {
		$(".department").append(`
        <option value="${dept}">${dept}</option>
        `);
	});

	positions.map(pos => {
		$(".position").append(`
        <option value="${pos}">${pos}</option>
        `);
	});
});

$(".department").on("change", function () {
	positions = [];
	$(".position").html(`
        <option value="" disabled selected> Select Position</option >
    `);

	//kunin lahat ng pos sa department na naselect
	usersData.map(user => {
		if (user.department === this.value && !positions.includes(user.position)) {
			positions.push(user.position);
		}
	});

	positions.map(pos => {
		$(".position").append(`
        <option value="${pos}">${pos}</option>
        `);
	});
});

$(document).on("change", "#notice_issued", function () {
	let isChecked = $("#notice_issued").prop("checked");

	if (isChecked == true) {
		$(".submitBtn").prop("disabled", false);
	} else {
		$(".submitBtn").prop("disabled", true);
	}
});

$(document).on("change", "effective_date", function () {});

const displayValues = userData => {
	positions = [];
	departments = [];
	names = [];

	userData.map(user => {
		if (
			user.firstName &&
			!names.includes(`${user.firstName} ${user.lastName}`)
		) {
			names.push({ name: `${user.firstName} ${user.lastName}` });
			$(".name").append(`
            <option value="${user.firstName} ${user.lastName}">${user.firstName} ${user.lastName}</option>
            `);
		}
		//includes() - chinecheck if kasama na siya sa array
		if (!departments.includes(user.department) && user.department) {
			departments.push(user.department);
			$(".department").append(`
            <option value="${user.department}">${user.department}</option>
            `);
		}

		if (!positions.includes(user.position) && user.position) {
			//push - add item sa array
			positions.push(user.position);
			$(".position").append(`
            <option value="${user.position}">${user.position}</option>
            `);
		}
	});
};
