
const validateRegistration = (body) => {
const errors = {};
const data = {};

const name = (body.name || "").trim();
const email = (body.email || "").trim().toLowerCase();
const phone = (body.phone || "").trim();
const studentNumber = (body.studentNumber || "").trim();
const universityRollNumber = (body.universityRollNumber || "").trim();
const year = (body.year || "").trim();
const branch = (body.branch || "").trim();
const domainOfInterest = (body.domainOfInterest || "").trim();
const collegeOrganization = (body.collegeOrganization || "").trim();

if (!name) errors.name = "Name is required.";
else if (name.length < 2 || !/^[A-Za-z ]+$/.test(name))
errors.name = "Please enter a valid name using letters only.";

if (!email) errors.email = "Email address is required.";
else if (!/^[a-zA-Z0-9._%+-]+@(gmail\.com|akgec\.ac\.in)$/i.test(email))
errors.email = "Please enter a valid Gmail or AKGEC email address.";

if (!phone) errors.phone = "Phone number is required.";
else if (!/^(?:\+91[- ]?)?[6-9]\d{9}$/.test(phone))
errors.phone = "Please enter a valid 10-digit mobile number.";

if (!studentNumber) errors.studentNumber = "Student number is required.";
else if (!/^\d{7}$/.test(studentNumber))
errors.studentNumber = "Student number must contain exactly 7 digits.";

if (!universityRollNumber) errors.universityRollNumber = "University roll number is required.";
else if (!/^\d{13}$/.test(universityRollNumber))
errors.universityRollNumber = "University roll number must contain exactly 13 digits.";

if (!["2nd Year","3rd Year","4th Year"].includes(year))
errors.year = "Please select a valid academic year.";

const branches = ["CS","CSE","CSE-AIML","CSIT","IT","CSE-DS","AIML","Civil","Mechanical","ECE","CSE Hindi"];

if (!branches.includes(branch))
errors.branch = "Please select a valid branch.";

if (domainOfInterest.length > 100)
errors.domainOfInterest = "Domain of interest cannot exceed 100 characters.";

if (collegeOrganization.length > 150)
errors.collegeOrganization = "College/Organization name cannot exceed 150 characters.";

if (body.consent !== true && body.consent !== "true")
errors.consent = "Please accept the terms and conditions.";

if (Object.keys(errors).length > 0)
return { valid: false, errors };

data.name = name;
data.email = email;
data.phone = phone;
data.studentNumber = studentNumber;
data.universityRollNumber = universityRollNumber;
data.year = year;
data.branch = branch;
data.domainOfInterest = domainOfInterest;
data.collegeOrganization = collegeOrganization;
data.consent = true;

return { valid: true, data };
};

module.exports = validateRegistration;
