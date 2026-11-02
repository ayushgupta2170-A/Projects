
const form = document.getElementById("registrationForm");
const message = document.getElementById("message");
const button = document.getElementById("submitButton");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    button.disabled = true;
    button.querySelector("span").textContent = "Submitting...";
    message.textContent = "";
    message.style.color = "#dc2626";

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
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {

            window.location.href =
                "success.html?ticketId=" +
                encodeURIComponent(result.ticketId) +
                "&emailStatus=" +
                encodeURIComponent(result.emailStatus);

            return;
        }

        // Show all validation errors
        if (result.errors) {

            const errorList = Object.values(result.errors);

            message.textContent = errorList.join(" | ");

        } else {

            message.textContent =
                result.message || "Registration failed. Please try again.";
        }

    } catch (error) {

        message.textContent =
            "Unable to connect to server. Please try again.";

    }

    button.disabled = false;
    button.querySelector("span").textContent = "Submit Registration";

});
