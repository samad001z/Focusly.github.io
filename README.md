Focusly 📚✨

Focusly is a modern task management web app where users can securely log in and manage their personal tasks through a clean, Notion/Bloom inspired interface.

✅ Features

User Registration & Login (Firebase Authentication)

Protected dashboard (only logged-in users can access)

Create / View / Edit / Delete tasks

Task properties:

Status (Todo / In Progress / Done)

Due Date

Completed checkbox

Responsive and mobile-friendly UI

🛠 Tech Stack Used

Frontend: HTML, CSS, JavaScript (Vanilla)

Backend: Node.js, Express.js

Database: Firebase Firestore

Authentication: Firebase Authentication

🚀 How to Run Locally
1️⃣ Clone the repository
git clone https://github.com/<your-username>/<your-repo-name>.git

2️⃣ Move into the project folder
cd <your-repo-name>

3️⃣ Install dependencies
npm install

4️⃣ Create .env file

Create a file named .env in the root folder and add:

PORT=5000

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"


⚠️ Do not upload .env to GitHub.

5️⃣ Start the server
npm start


Now open in browser:

http://localhost:5000

🔑 Firebase Setup (Required)

Go to Firebase Console

Create a project

Enable:

Authentication → Email/Password

Firestore Database

Generate Firebase Admin credentials:

Project Settings → Service Accounts → Generate new private key

Copy values into your .env

📌 Notes

Each user can access only their own tasks.

Protected routes are secured using Firebase ID token verification.

UI is responsive and works on both mobile and desktop.

✅ Submission Checklist

Before submitting, make sure:

Your GitHub repository link is public and working

This README clearly explains what you built

Any live demo links (if provided) are accessible
