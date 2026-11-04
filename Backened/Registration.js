
const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    phone: {
        type: String,
        required: true
    },

    studentNumber: {
        type: String,
        required: true,
        unique: true
    },

    universityRollNumber: {
        type: String,
        required: true,
        unique: true
    },

    year: {
        type: String,
        required: true,
        enum: ["2nd Year", "3rd Year", "4th Year"]
    },

    branch: {
        type: String,
        required: true,
        enum: [
            "CS",
            "CSE",
            "CSE-AIML",
            "CSIT",
            "IT",
            "CSE-DS",
            "AIML",
            "Civil",
            "Mechanical",
            "ECE",
            "CSE Hindi"
        ]
    },

    domainOfInterest: {
        type: String,
        default: ""
    },

    collegeOrganization: {
        type: String,
        default: ""
    },

    consent: {
        type: Boolean,
        required: true
    },

    ticketId: {
        type: String,
        unique: true,
        sparse: true
    },

    emailStatus: {
        type: String,
        enum: ["pending", "sent", "failed"],
        default: "pending"
    },

    // Attendance fields
    isCheckedIn: {
        type: Boolean,
        default: false
    },

    checkedInAt: {
        type: Date,
        default: null
    }

}, {
    timestamps: true
});

const Registration = mongoose.model(
    "Registration",
    registrationSchema
);

module.exports = Registration;
