const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
	PName: { type: String, required: true },
	date: { type: Date, required: true },
	useremail: { type: String, required: true },
	Languages: { type: Array, required: true },
});

const Project = mongoose.model("project", userSchema);
module.exports = {Project};