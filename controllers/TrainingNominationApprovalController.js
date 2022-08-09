const TrainingNominationApprovalController = {
	TrainingNominationIndividual: function (req, res) {
		TrainingNominationData = [{}];
		res.render("pages/TrainingNominationApprovalPage", {
			TrainingNominationData: TrainingNominationData,
		});
	},
};

module.exports = TrainingNominationApprovalController;
