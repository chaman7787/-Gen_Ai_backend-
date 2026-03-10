const mongoose = require("mongoose");

const interviewReportSchema = new mongoose.Schema({
    candidateName: {
        type: String,
        required: true
    },
    interviewerName: {
        type: String,
        required: true
    },
    interviewDate: {
        type: Date,
        required: true
    },
});
