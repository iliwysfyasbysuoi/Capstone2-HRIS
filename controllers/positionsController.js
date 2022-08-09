const positionsModel = require("../models/positionsModel.js");

const PositionsController = {
	postRetrieveListOfPositions: function (req, res) {
		var businessUnit = req.body.businessUnit;
		var department = req.body.department;

		positionsModel.find(
			{ businessUnit: businessUnit, department: department },
			"positionTitle",
			function (err, positionsList) {
				var optionsArray = [];
				optionsArray.push(
					`<option value="" selected disabled> Select Position </option>`
				);
				for (i = 0; i < positionsList.length; i++) {
					optionsArray.push(
						`<option value="${positionsList[i].positionTitle}" > ${positionsList[i].positionTitle} </option>`
					);
					if (i == positionsList.length - 1) {
						res.send(optionsArray);
					}
				}
			}
		);
	},

	postRetrievePositionDetails: function (req, res) {
		var businessUnit = req.body.businessUnit;
		var department = req.body.department;
		var position = req.body.position;

		// console.log(` ${businessUnit} ${department} ${position}`);
		positionsModel.findOne(
			{
				positionTitle: position,
				businessUnit: businessUnit,
				department: department,
			},
			function (err, positionsDetails) {
				// if (err) console.error(err)
				if (positionsDetails != null) {
					// console.log("positionsDetails", positionsDetails);
					res.send(positionsDetails);
				} else res.send();
			}
		);
	},

	getPositions: function (req, res) {
		const { needed } = req.params;
		positionsModel.find({}, needed, function (err, positions) {
			res.send(positions);
		});
	},
};

module.exports = PositionsController;
