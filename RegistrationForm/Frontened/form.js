
const form = document.getElementById("registrationForm");
const message = document.getElementById("message");
const submitButton = document.getElementById("submitButton");

form.addEventListener("submit", async (e) => {
e.preventDefault();

message.textContent = "";
message.style.color = "#dc2626";

const buttonText = submitButton.querySelector("span");
buttonText.textContent = "Submitting...";
submitButton.disabled = true;

const data = {
name: document.getElementById("name").value.trim(),
email: document.getElementById("email").value.trim(),
phone: document.getElementById("phone").value.trim(),
studentNumber: document.getElementById("studentNumber").value.trim(),
universityRollNumber: document.getElementById("universityRollNumber").value.trim(),
year: document.getElementById("year").value,
branch: document.getElementById("branch").value,
domainOfInterest: document.getElementById("domainOfInterest").value.trim(),
collegeOrganization: document.getElementById("collegeOrganization").value.trim(),
consent: document.getElementById("consent").checked
};

try {
const response = await fetch("http://localhost:5000/api/registrations", {
method: "POST",
headers: {"Content-Type": "application/json"},
body: JSON.stringify(data)
});

const result = await response.json();

if (response.ok && result.success) {
window.location.href = `success.html?ticketId=${encodeURIComponent(result.ticketId)}&emailStatus=${encodeURIComponent(result.emailStatus)}`;
return;
}

if (result.errors) {
const errorMessages = Object.values(result.errors);
message.textContent = errorMessages.join(" ");
} else {
message.textContent = result.message || "Registration could not be completed. Please try again.";
}

} catch (error) {
message.textContent = "Unable to connect to the server. Please try again later.";
}

submitButton.disabled = false;
buttonText.textContent = "Submit Registration";
});
