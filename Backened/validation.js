
const validateRegistration = (data) => {

    const errors = {};

    // Full Name: Only alphabets and spaces
    if (!data.name || !/^[A-Za-z ]+$/.test(data.name.trim())) {
        errors.name = "Name mein sirf alphabets use karo.";
    } else if (data.name.trim().length < 2) {
        errors.name = "Name kam se kam 2 characters ka hona chahiye.";
    }

    // Email validation
    const email = (data.email || "").trim().toLowerCase();

    if (!email) {
        errors.email = "Email address required hai.";
    } else if (!/^[^\s@]+@(gmail\.com|akgec\.ac\.in)$/i.test(email)) {
        errors.email = "Sirf Gmail ya AKGEC email use karo.";
    }

    // Phone Number
    const phone = (data.phone || "").trim();

    if (!/^(?:\+91)?[6-9]\d{9}$/.test(phone)) {
        errors.phone = "Valid 10-digit Indian mobile number enter karo.";
    }

    // Student Number: Exactly 7 digits
    const studentNumber = (data.studentNumber || "").trim();

    if (!/^\d{7}$/.test(studentNumber)) {
        errors.studentNumber = "Student Number exactly 7 digits ka hona chahiye.";
    }

    // University Roll Number: Exactly 13 digits
    const universityRollNumber = (data.universityRollNumber || "").trim();

    if (!/^\d{13}$/.test(universityRollNumber)) {
        errors.universityRollNumber = "University Roll Number exactly 13 digits ka hona chahiye.";
    }

    // Year validation
    const validYears = ["2nd Year", "3rd Year", "4th Year"];

    if (!validYears.includes(data.year)) {
        errors.year = "Please select a valid year.";
    }

    // Branch validation
    const validBranches = [
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
    ];

    if (!validBranches.includes(data.branch)) {
        errors.branch = "Please select a valid branch.";
    }

    // Domain validation
    const domain = (data.domainOfInterest || "").trim();

    if (domain.length > 100) {
        errors.domainOfInterest = "Domain name bahut lamba hai.";
    }

    // College validation
    const college = (data.collegeOrganization || "").trim();

    if (college.length > 150) {
        errors.collegeOrganization = "College name bahut lamba hai.";
    }

    // Consent validation
    if (data.consent !== true) {
        errors.consent = "Please accept the consent.";
    }

    // Return validation result
    if (Object.keys(errors).length > 0) {
        return {
            valid: false,
            errors
        };
    }

    return {
        valid: true,

        data: {
            name: data.name.trim(),
            email,
            phone,
            studentNumber,
            universityRollNumber,
            year: data.year,
            branch: data.branch,
            domainOfInterest: domain,
            collegeOrganization: college,
            consent: true
        }
    };
};

module.exports = validateRegistration;
