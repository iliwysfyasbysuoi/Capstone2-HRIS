const { ObjectId } = require("bson");
const notificationModel = require("../models/notificationModel.js");

// for python call
// const { spawn } = require("child_process");
// const from_js = "bababa";
// const obj_from_js = { cookie: { path: "/" }, email: "asdf@asdf.com" }; //needs to be JSON.stringified
// end for python call

const NotificationController = {
	get_notifications_page: function (req, res) {
		// console.log("req.session", req.session);
		// console.log("obj_from_js", obj_from_js);

		// python call
		// const child_python = spawn("python3", [
		// 	"assets/python/test.py",
		// 	JSON.stringify(obj_from_js),
		// ]);
		// child_python.stdout.on("data", data => {
		// 	console.log(`Node JS got Data ${data}`);
		// 	console.log(`Path ${data.path}`);
		// 	// console.log(`Data cookie ${data.cookie}`);
		// 	// console.log(`Node JS got Data ${JSON.stringify(data)}`);
		// 	console.log(`Type is:${typeof data}`);
		// 	// convert dict to string
		// 	mystr = data.toString();
		// 	// convert string to Json
		// 	console.log(`Data To String ${mystr} Type of ${typeof mystr}`);
		// 	myjson = JSON.parse(mystr);
		// 	console.log(`JSON IS ${myjson}`);
		// 	console.log(`PATH ${myjson.path}`);
		// });

		// child_python.stderr.on("data", data => {
		// 	console.log(`stderr: ${data}`);
		// });

		// child_python.on("close", code => {
		// 	console.log(`child process exited with code: ${code}`);
		// });
		// end of python call
		res.render("pages/Notifications/NotificationsPage", {});
	},
	getMyNotifications: function (req, res) {
		var user_id = req.session._id;
		notificationModel.find(
			{ "receiver._id": ObjectId(user_id) },
			null,
			{ sort: { date: 1 } },
			function (err, notificationsResult) {
				res.send(notificationsResult.reverse());
			}
		);
	},

	setNotificationSeen: function (req, res) {
		var notificationID = req.body.notificationID;

		// console.log(notificationID);
		notificationModel.updateOne(
			{ _id: ObjectId(notificationID) },
			{ $set: { isSeen: true } },
			function (data) {
				res.send(data);
			}
		);
	},
};

module.exports = NotificationController;
