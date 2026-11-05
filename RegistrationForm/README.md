# 🎟️ EventHub – Event Registration System

A web-based event registration system that allows students to register for events, securely stores their information in MongoDB, and generates a unique ticket ID with a QR code delivered through email.

## 🚀 Features

- 📝 Student Registration Form
- 📧 Email Validation
- 📱 Phone Number Validation
- 🎓 Student and University Roll Number Validation
- 🗄️ MongoDB Database Integration
- 🎫 Unique Registration Ticket ID
- 🔳 QR Code Generation
- 📩 Automated Email with QR Code
- 🛡️ Backend Input Validation
- ⚡ API Rate Limiting
- 🎨 Responsive and Modern UI
- ✨ Animated Background and Gradient Design
- 🔐 Environment Variables for Sensitive Credentials

## 🛠️ Tech Stack

**Frontend**
- HTML
- CSS
- JavaScript

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose

**Additional Libraries**
- Nodemailer – Email sending
- QRCode – QR code generation
- Helmet – Security headers
- CORS – Cross-Origin Resource Sharing
- Express Rate Limit – API rate limiting
- dotenv – Environment variable management

## 📁 Project Structure

```text
RegistrationForm/
│
├── Backened/
│   ├── server.js
│   ├── database.js
│   ├── Registration.js
│   ├── validation.js
│   ├── email.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   └── node_modules/
│
├── Frontened/
│   ├── index.html
│   ├── style.css
│   ├── form.js
│   └── success.html
│
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
```

### 2. Open the Project

```bash
cd RegistrationForm
```

### 3. Install Backend Dependencies

```bash
cd Backened
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `Backened` folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

**Important:** Never share or upload your `.env` file or credentials to GitHub.

### 5. Start the Backend Server

```bash
npm run dev
```

If a development script is not configured in `package.json`, run:

```bash
node server.js
```

### 6. Open the Frontend

Open `Frontened/index.html` using VS Code Live Server.

The backend runs at:

```text
http://localhost:5000
```

Health check endpoint:

```text
http://localhost:5000/api/health
```

## 🔗 API Endpoint

### Register a Student

| Method | Endpoint |
|---|---|
| POST | `/api/registrations` |

**Request Body Example**

```json
{
  "name": "Student Name",
  "email": "student@gmail.com",
  "phone": "9876543210",
  "studentNumber": "1234567",
  "universityRollNumber": "1234567890123",
  "year": "2nd Year",
  "branch": "CSIT",
  "domainOfInterest": "Web Development",
  "collegeOrganization": "Your College",
  "consent": true
}
```

The API validates the submitted information, saves the registration in MongoDB, generates a unique ticket ID and QR code, and sends the QR code to the registered email address.

## 🔄 Application Workflow

1. Student opens the registration website.
2. Student fills out the registration form.
3. Frontend sends registration details to the backend API.
4. Backend validates the submitted information.
5. Registration details are saved in MongoDB.
6. A unique Ticket ID is generated.
7. A QR code is generated using the Ticket ID.
8. Registration confirmation email is sent with the QR code.
9. Student is redirected to the success page.

## 🔒 Security

- Environment variables are used for sensitive credentials.
- Helmet is used for HTTP security headers.
- CORS is configured for local frontend development.
- Express Rate Limit helps prevent excessive registration requests.
- Backend validation checks submitted form data.
- `.env` and `node_modules` are excluded through `.gitignore`.

## 📸 Screenshots

Add your project screenshots here.

```text
screenshots/
├── registration-page.png
├── success-page.png
└── registration-email.png
```

## 🔮 Future Improvements

- Admin Dashboard
- View and Manage Registrations
- Export Registration Data to Excel
- QR Code Scanning and Entry Verification
- Duplicate Registration Management
- Deployment to Cloud Hosting

## 👨‍💻 Author

**EventHub Registration System**

Built using HTML, CSS, JavaScript, Node.js, Express.js and MongoDB.

---

⭐ If you find this project useful, consider giving it a star!
