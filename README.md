Focusly 📚✨
Focusly is a modern task management web app where users can securely log in and manage their personal tasks.
It also includes an AI assistant (Gemini) to help with task suggestions and productivity guidance.

✅ Features

User Registration & Login (Firebase Auth)

Authentication protected dashboard

Create / View / Edit / Delete tasks

Task properties:

Status (Todo / In Progress / Done)

Due Date

Completed checkbox

Modern UI (Notion/Bloom inspired)

AI Assistant (Gemini API)

🛠 Tech Stack

Frontend: HTML, CSS, JavaScript (Vanilla)

Backend: Node.js, Express.js

Database: Firebase Firestore

Auth: Firebase Authentication

AI: Google Gemini API

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

GEMINI_API_KEY=your_gemini_api_key


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

Create Firebase Admin credentials:

Project Settings → Service Accounts → Generate new private key

Use values in .env

🤖 Gemini AI Setup (Required)

Go to Google AI Studio

Create API key

Add it in .env as:

GEMINI_API_KEY=your_key


Also ensure in Google Cloud:

Enable Generative Language API

🌍 Deployment (Render)

Push your code to GitHub

Go to Render → New → Web Service

Connect your repo

Set:

Build Command

npm install


Start Command

npm start


Add Environment Variables in Render (same as .env)

Deploy 🚀

📌 Notes

Each user can access only their own tasks.

Protected routes are secured using Firebase ID token verification.

UI is responsive and mobile-friendly.